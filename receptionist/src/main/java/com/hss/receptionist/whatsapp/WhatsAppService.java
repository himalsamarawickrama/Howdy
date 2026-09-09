package com.hss.receptionist.whatsapp;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hss.receptionist.ai.AiOrchestrationService;
import com.hss.receptionist.booking.BookingRequest;
import com.hss.receptionist.booking.BookingRequestRepository;
import com.hss.receptionist.business.Business;
import com.hss.receptionist.business.BusinessRepository;
import com.hss.receptionist.catalog.SalonService;
import com.hss.receptionist.catalog.SalonServiceRepository;
import com.hss.receptionist.conversation.Conversation;
import com.hss.receptionist.conversation.ConversationRepository;
import com.hss.receptionist.conversation.Message;
import com.hss.receptionist.conversation.MessageRepository;
import com.hss.receptionist.customer.Customer;
import com.hss.receptionist.customer.CustomerRepository;
import com.hss.receptionist.whatsapp.dto.WhatsAppWebhookRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class WhatsAppService {

    private final RestClient restClient;
    private final String globalAccessToken;
    
    private final BusinessRepository businessRepository;
    private final CustomerRepository customerRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final BookingRequestRepository bookingRequestRepository;
    private final SalonServiceRepository salonServiceRepository;
    private final AiOrchestrationService aiOrchestrationService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // De-duplication cache: keeps recent message IDs to prevent double processing
    private final Set<String> processedMessageIds = Collections.newSetFromMap(new ConcurrentHashMap<>());

    public WhatsAppService(
            BusinessRepository businessRepository,
            CustomerRepository customerRepository,
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            BookingRequestRepository bookingRequestRepository,
            SalonServiceRepository salonServiceRepository,
            AiOrchestrationService aiOrchestrationService,
            @Value("${whatsapp.api-base-url:https://graph.facebook.com/v19.0}") String apiBaseUrl,
            @Value("${whatsapp.access-token:placeholder_token}") String accessToken) {

        this.restClient = RestClient.builder().baseUrl(apiBaseUrl).build();
        this.globalAccessToken = accessToken;
        this.businessRepository = businessRepository;
        this.customerRepository = customerRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.bookingRequestRepository = bookingRequestRepository;
        this.salonServiceRepository = salonServiceRepository;
        this.aiOrchestrationService = aiOrchestrationService;
    }

    @Async
    public void processIncomingMessage(WhatsAppWebhookRequest request) {
        try {
            if (request.entry() == null) return;

            for (var entry : request.entry()) {
                if (entry.changes() == null) continue;

                for (var change : entry.changes()) {
                    if (change.value() == null || change.value().messages() == null) continue;

                    String profileName = null;
                    if (change.value().contacts() != null && !change.value().contacts().isEmpty()) {
                        var contact = change.value().contacts().get(0);
                        if (contact.profile() != null) {
                            profileName = contact.profile().name();
                        }
                    }

                    for (var incoming : change.value().messages()) {
                        // 1. De-duplicate by WhatsApp Message ID (wamid)
                        String messageId = incoming.id();
                        if (messageId != null) {
                            if (!processedMessageIds.add(messageId)) {
                                log.warn("Duplicate WhatsApp message ID detected [{}]. Skipping processing.", messageId);
                                continue;
                            }
                        }

                        String senderPhone = incoming.from();
                        String messageBody = incoming.text() != null ? incoming.text().body() : null;
                        String phoneNumberId = change.value().metadata().phoneNumberId();

                        if (messageBody == null || messageBody.isBlank()) {
                            log.info("Ignoring non-text or empty payload from {}", senderPhone);
                            continue;
                        }

                        log.info("-> Inbound WhatsApp [{}] -> Phone ID [{}]: {}", senderPhone, phoneNumberId, messageBody);

                        handleMessageWorkflow(phoneNumberId, senderPhone, messageBody, profileName);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Fatal error processing incoming WhatsApp message", e);
        }
    }

    @Transactional
    public void handleMessageWorkflow(String phoneNumberId, String senderPhone, String messageBody, String profileName) {
        // 1. Identify Tenant Business
        Business business = businessRepository.findByWhatsappPhoneNumberId(phoneNumberId).orElse(null);
        if (business == null) {
            log.warn("No registered business mapped to Phone ID: {}", phoneNumberId);
            return;
        }

        // 2. Identify or Enroll Customer
        Customer customer = customerRepository.findByBusinessIdAndWhatsappNumber(business.getId(), senderPhone)
                .map(existingCust -> {
                    if (profileName != null && !profileName.isBlank() && ("WhatsApp User".equals(existingCust.getName()) || existingCust.getName() == null)) {
                        existingCust.setName(profileName);
                        return customerRepository.save(existingCust);
                    }
                    return existingCust;
                })
                .orElseGet(() -> {
                    Customer newCust = new Customer();
                    newCust.setBusiness(business);
                    newCust.setWhatsappNumber(senderPhone);
                    newCust.setName(profileName != null && !profileName.isBlank() ? profileName : "WhatsApp User");
                    return customerRepository.save(newCust);
                });

        // 3. Retrieve or Create Conversation Thread
        Conversation conversation = conversationRepository
                .findFirstByBusinessIdAndCustomerIdOrderByUpdatedAtDesc(business.getId(), customer.getId())
                .orElseGet(() -> {
                    Conversation newConv = new Conversation();
                    newConv.setBusiness(business);
                    newConv.setCustomer(customer);
                    newConv.setStatus("AI_ACTIVE");
                    return conversationRepository.save(newConv);
                });

        // 4. If human takeover is active, persist customer message and stop AI execution
        if ("NEEDS_HUMAN".equalsIgnoreCase(conversation.getStatus())) {
            log.info("Conversation [{}] requires human attention. Halting AI response.", conversation.getId());
            saveMessage(conversation, "CUSTOMER", messageBody);
            return;
        }

        // 5. Persist Inbound Customer Message
        saveMessage(conversation, "CUSTOMER", messageBody);

        // 6. Fetch Recent Short-Term Conversation Memory
        List<Message> recentMessages = messageRepository.findTop5ByConversationIdOrderByCreatedAtDesc(conversation.getId());
        Collections.reverse(recentMessages);

        List<Map<String, String>> history = new ArrayList<>();
        for (Message msg : recentMessages) {
            if (msg.getContent().equals(messageBody) && "CUSTOMER".equals(msg.getSender())) continue;

            String role = "CUSTOMER".equalsIgnoreCase(msg.getSender()) ? "user" : "model";
            history.add(Map.of("role", role, "content", msg.getContent()));
        }

        // 7. Generate Contextualized Reply via AI Orchestrator
        AiOrchestrationService.AiResponseResult aiResult = aiOrchestrationService.processCustomerMessage(business, history, messageBody);

        // 8. Update Customer Name if extracted from slots
        if (aiResult.bookingDraft() != null && aiResult.bookingDraft().customerName() != null && !aiResult.bookingDraft().customerName().isBlank()) {
            String extractedName = aiResult.bookingDraft().customerName().trim();
            if ("WhatsApp User".equalsIgnoreCase(customer.getName()) || customer.getName() == null) {
                customer.setName(extractedName);
                customerRepository.save(customer);
            }
        }

        // 9. Manage the booking draft and completion state
        if (aiResult.bookingIntent()) {
            if (aiResult.bookingDraft() != null) {
                try {
                    String draftJson = objectMapper.writeValueAsString(aiResult.bookingDraft());
                    conversation.setPendingBookingDraft(draftJson);
                } catch (Exception e) {
                    log.error("Failed to serialize booking draft", e);
                }
            }

            if (aiResult.isComplete() && aiResult.bookingDraft() != null) {
                Optional<BookingRequest> existingBooking = bookingRequestRepository
                        .findByBusinessIdAndCustomerIdAndStatus(business.getId(), customer.getId(), "PENDING");

                BookingRequest booking;
                if (existingBooking.isPresent()) {
                    booking = existingBooking.get();
                    log.info("-> Updating existing pending booking request for customer [{}]", customer.getWhatsappNumber());
                } else {
                    booking = new BookingRequest();
                    booking.setBusiness(business);
                    booking.setCustomer(customer);
                    booking.setStatus("PENDING");
                    log.info("-> Creating final pending booking request for approval dashboard");
                }

                AiOrchestrationService.BookingDraftDto draft = aiResult.bookingDraft();
                booking.setNotes(draft.notes());
                
                if (draft.date() != null && !draft.date().isBlank()) {
                    try {
                        booking.setRequestedDate(LocalDate.parse(draft.date()));
                    } catch (Exception e) {
                        log.warn("Could not parse date string: {}", draft.date());
                    }
                }
                
                if (draft.time() != null && !draft.time().isBlank()) {
                    try {
                        booking.setRequestedTime(LocalTime.parse(draft.time()));
                    } catch (Exception e) {
                        log.warn("Could not parse time string: {}", draft.time());
                    }
                }

                if (draft.serviceName() != null) {
                    List<SalonService> activeServices = salonServiceRepository.findAllByBusinessIdAndIsActiveTrue(business.getId());
                    for (SalonService s : activeServices) {
                        if (s.getName().equalsIgnoreCase(draft.serviceName().trim())) {
                            booking.setServiceId(s.getId());
                            break;
                        }
                    }
                }

                bookingRequestRepository.save(booking);
                conversation.setPendingBookingDraft(null);
            }
        }

        // 10. Explicit Human Escalation Check
        if (aiResult.needsHuman()) {
            log.info("AI explicitly triggered needsHuman for conversation [{}]", conversation.getId());
            conversation.setStatus("NEEDS_HUMAN");
        }

        conversationRepository.save(conversation);

        // 11. Persist Outbound AI Message
        saveMessage(conversation, "AI", aiResult.reply());

        // 12. Dispatch Reply via Meta WhatsApp Cloud API
        String token = (business.getWhatsappAccessToken() != null && !business.getWhatsappAccessToken().isBlank())
                ? business.getWhatsappAccessToken()
                : globalAccessToken;

        sendWhatsAppReply(phoneNumberId, senderPhone, aiResult.reply(), token);
    }

    public void sendTextMessage(Long businessId, String recipientPhone, String message) {
        Business business = businessRepository.findById(businessId).orElse(null);
        if (business == null) {
            log.warn("Cannot send manual message: No business found for ID {}", businessId);
            return;
        }

        String phoneId = business.getWhatsappPhoneNumberId();
        if (phoneId == null || phoneId.isBlank()) {
            log.warn("Cannot send manual message: Business {} has no configured whatsappPhoneNumberId", businessId);
            return;
        }

        String token = (business.getWhatsappAccessToken() != null && !business.getWhatsappAccessToken().isBlank())
                ? business.getWhatsappAccessToken()
                : globalAccessToken;

        sendWhatsAppReply(phoneId, recipientPhone, message, token);
    }

    private void saveMessage(Conversation conversation, String sender, String content) {
        Message msg = new Message();
        msg.setConversation(conversation);
        msg.setSender(sender);
        msg.setContent(content);
        messageRepository.save(msg);
    }

    private void sendWhatsAppReply(String phoneId, String recipientPhone, String message, String token) {
        try {
            WhatsAppReplyPayload payload = new WhatsAppReplyPayload(
                    "whatsapp",
                    recipientPhone,
                    "text",
                    new TextContent(message)
            );

            restClient.post()
                    .uri("/{phoneId}/messages", phoneId)
                    .header("Authorization", "Bearer " + token)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();

            log.info("-> Dispatched outbound message to WhatsApp [{}]", recipientPhone);
        } catch (Exception e) {
            log.error("Failed to dispatch WhatsApp message to {}: {}", recipientPhone, e.getMessage());
        }
    }

    record TextContent(String body) {}
    record WhatsAppReplyPayload(String messaging_product, String to, String type, TextContent text) {}
}