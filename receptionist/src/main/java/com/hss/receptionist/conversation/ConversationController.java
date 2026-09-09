package com.hss.receptionist.conversation;

import com.hss.receptionist.conversation.dto.ConversationDto;
import com.hss.receptionist.whatsapp.WhatsAppService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final WhatsAppService whatsAppService;

    @GetMapping
    public ResponseEntity<List<ConversationDto>> listConversations(Authentication authentication) {
        Long businessId = extractBusinessId(authentication);

        List<Conversation> conversations = conversationRepository
                .findAllByBusinessIdOrderByUpdatedAtDesc(businessId);

        List<ConversationDto> dtos = conversations.stream().map(c -> {
            List<Message> msgs = messageRepository.findAllByConversationIdOrderByCreatedAtAsc(c.getId());

            ConversationDto.CustomerSummary customerSummary = new ConversationDto.CustomerSummary(
                    c.getCustomer().getId(),
                    c.getCustomer().getName(),
                    c.getCustomer().getWhatsappNumber()
            );

            List<ConversationDto.MessageSummary> messageSummaries = msgs.stream()
                    .map(m -> new ConversationDto.MessageSummary(m.getId(), m.getSender(), m.getContent(), m.getCreatedAt()))
                    .toList();

            return new ConversationDto(
                    c.getId(),
                    c.getStatus(),
                    c.getUpdatedAt(),
                    customerSummary,
                    messageSummaries
            );
        }).toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<ConversationDto.MessageSummary>> getConversationMessages(
            @PathVariable Long id,
            Authentication authentication) {
        
        Long businessId = extractBusinessId(authentication);

        Conversation conversation = conversationRepository.findById(id)
                .filter(c -> c.getBusiness().getId().equals(businessId))
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        List<ConversationDto.MessageSummary> messages = messageRepository
                .findAllByConversationIdOrderByCreatedAtAsc(conversation.getId())
                .stream()
                .map(m -> new ConversationDto.MessageSummary(m.getId(), m.getSender(), m.getContent(), m.getCreatedAt()))
                .toList();

        return ResponseEntity.ok(messages);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ConversationDto> setConversationStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request,
            Authentication authentication) {

        Long businessId = extractBusinessId(authentication);

        Conversation conversation = conversationRepository.findById(id)
                .filter(c -> c.getBusiness().getId().equals(businessId))
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        conversation.setStatus(request.status());
        conversation.setUpdatedAt(ZonedDateTime.now());
        conversationRepository.save(conversation);

        List<Message> msgs = messageRepository.findAllByConversationIdOrderByCreatedAtAsc(conversation.getId());

        ConversationDto dto = new ConversationDto(
                conversation.getId(),
                conversation.getStatus(),
                conversation.getUpdatedAt(),
                new ConversationDto.CustomerSummary(
                        conversation.getCustomer().getId(),
                        conversation.getCustomer().getName(),
                        conversation.getCustomer().getWhatsappNumber()
                ),
                msgs.stream().map(m -> new ConversationDto.MessageSummary(m.getId(), m.getSender(), m.getContent(), m.getCreatedAt())).toList()
        );

        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<ConversationDto.MessageSummary> sendManualMessage(
            @PathVariable Long id,
            @RequestBody SendMessageRequest request,
            Authentication authentication) {

        Long businessId = extractBusinessId(authentication);

        Conversation conversation = conversationRepository.findById(id)
                .filter(c -> c.getBusiness().getId().equals(businessId))
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        // 1. Save staff message locally
        Message message = new Message();
        message.setConversation(conversation);
        message.setSender("BUSINESS_OWNER");
        message.setContent(request.content());
        message.setCreatedAt(ZonedDateTime.now());
        Message saved = messageRepository.save(message);

        // 2. Refresh conversation timestamp
        conversation.setUpdatedAt(ZonedDateTime.now());
        conversationRepository.save(conversation);

        // 3. Dispatch directly to customer's WhatsApp via the tenant's number
        String customerPhone = conversation.getCustomer().getWhatsappNumber();
        whatsAppService.sendTextMessage(businessId, customerPhone, request.content());

        return ResponseEntity.ok(new ConversationDto.MessageSummary(
                saved.getId(),
                saved.getSender(),
                saved.getContent(),
                saved.getCreatedAt()
        ));
    }

    private Long extractBusinessId(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new IllegalStateException("Unauthenticated request");
        }
        if (authentication.getDetails() instanceof Long bId) {
            return bId;
        }
        try {
            var method = authentication.getPrincipal().getClass().getMethod("getBusinessId");
            return (Long) method.invoke(authentication.getPrincipal());
        } catch (Exception e) {
            return 1L;
        }
    }

    public record StatusUpdateRequest(String status) {}
    public record SendMessageRequest(String content) {}
}