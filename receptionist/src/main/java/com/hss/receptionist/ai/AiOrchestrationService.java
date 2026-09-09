package com.hss.receptionist.ai;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hss.receptionist.business.Business;
import com.hss.receptionist.catalog.Faq;
import com.hss.receptionist.catalog.FaqRepository;
import com.hss.receptionist.catalog.SalonService;
import com.hss.receptionist.catalog.SalonServiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiOrchestrationService {

    private final AiProvider aiProvider;
    private final SalonServiceRepository serviceRepository;
    private final FaqRepository faqRepository;
    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    private static final Pattern JSON_BLOCK_PATTERN = Pattern.compile("\\{.*\\}", Pattern.DOTALL);

    public AiResponseResult processCustomerMessage(Business business, List<Map<String, String>> recentHistory, String incomingMessage) {
        // Step 1: Pre-AI cheap FAQ substring check
        List<Faq> faqs = faqRepository.findAllByBusinessId(business.getId());
        Optional<String> directFaqMatch = findDirectFaqAnswer(faqs, incomingMessage);
        if (directFaqMatch.isPresent()) {
            log.info("Direct FAQ match found for query: '{}'", incomingMessage);
            return new AiResponseResult(
                directFaqMatch.get(),
                false,
                null,
                false,
                false
            );
        }

        // Step 2: Retrieve services
        List<SalonService> services = serviceRepository.findAllByBusinessIdAndIsActiveTrue(business.getId());

        // Step 3: Build prompt context
        String systemPrompt = buildSystemPrompt(business, services, faqs);

        // Step 4: Call LLM with full exception safety
        try {
            String rawAiResponse = aiProvider.generateResponse(systemPrompt, recentHistory, incomingMessage);
            String cleanJson = extractJson(rawAiResponse);
            log.info("LLM Clean JSON Payload: {}", cleanJson);
            return objectMapper.readValue(cleanJson, AiResponseResult.class);
        } catch (Exception e) {
            log.error("AI Generation or JSON parsing failed. Returning graceful non-locking fallback.", e);
            // CRITICAL: needsHuman MUST be false here so 429 quota or network timeouts
            // do not permanently lock out the customer from the bot.
            return new AiResponseResult(
                "I'm experiencing a brief network delay right now. Please message again in a few seconds!",
                false,
                null,
                false,
                false
            );
        }
    }

    private Optional<String> findDirectFaqAnswer(List<Faq> faqs, String userQuery) {
        String cleanQuery = userQuery.trim().toLowerCase();
        for (Faq faq : faqs) {
            String question = faq.getQuestion().trim().toLowerCase();
            if (cleanQuery.contains(question) || question.contains(cleanQuery)) {
                return Optional.of(faq.getAnswer());
            }
        }
        return Optional.empty();
    }

    private String extractJson(String text) {
        if (text == null) return "{}";
        String cleaned = text.trim();
        Matcher matcher = JSON_BLOCK_PATTERN.matcher(cleaned);
        if (matcher.find()) {
            return matcher.group(0);
        }
        return cleaned.replaceAll("```json", "").replaceAll("```", "").trim();
    }

    private String buildSystemPrompt(Business business, List<SalonService> services, List<Faq> faqs) {
        LocalDate today = LocalDate.now();
        StringBuilder sb = new StringBuilder();

        sb.append("You are the conversational AI receptionist for ").append(business.getName()).append(" located in the UAE.\n");
        sb.append("Today's current date is: ").append(today.format(DateTimeFormatter.ISO_LOCAL_DATE))
          .append(" (").append(today.getDayOfWeek().name()).append(").\n\n");

        sb.append("--- AVAILABLE SERVICES (STRICT CATALOG) ---\n");
        if (services.isEmpty()) {
            sb.append("No services currently listed.\n");
        } else {
            for (SalonService s : services) {
                sb.append(String.format("- %s: AED %s (%d mins). %s\n",
                        s.getName(),
                        s.getPrice() != null ? s.getPrice().toString() : "Variable",
                        s.getDurationMinutes() != null ? s.getDurationMinutes() : 0,
                        s.getDescription() != null ? s.getDescription() : ""));
            }
        }

        sb.append("\n--- FREQUENTLY ASKED QUESTIONS ---\n");
        for (Faq f : faqs) {
            sb.append(String.format("Q: %s\nA: %s\n", f.getQuestion(), f.getAnswer()));
        }

        sb.append("""

        --- CONVERSATIONAL & EDGE CASE RULES ---
        1. UNMATCHED OFFERINGS / SERVICE NAMES:
           - If customer asks for something not in the catalog above (e.g. 'mohawk tape', 'fade'):
             * Set bookingDraft.serviceName = null and isComplete = false.
             * In your reply, politely clarify that this service is not on the menu and suggest 2-3 closest real services from the catalog.
             * NEVER invent or substitute services silently.
             * needsHuman MUST BE FALSE. Do NOT escalate to a human simply because a service is missing.

        2. AMBIGUOUS MULTI-FIELD / SHORTHAND INPUT:
           - Customers may combine fields with commas or shorthand (e.g. 'tomorrow, haircut, Himal'):
             * Parse each part as its own slot:
               - Relative dates ('tomorrow', 'Friday') MUST be converted to YYYY-MM-DD using today's date.
               - Times ('3 PM', '15:00') MUST be converted to HH:MM (24-hr format).
               - Customer names must be populated into bookingDraft.customerName.
               - Services must be validated against the catalog.
             * If any slot remains missing or invalid, ask ONE specific follow-up question. Do NOT dump raw multi-field text into 'notes'.
             * needsHuman MUST BE FALSE.

        3. OFF-TOPIC / SMALL TALK:
           - For greetings or chit-chat ('How are you?', 'How is your family?'):
             * Reply briefly and warmly, then politely redirect back to business/booking.
             * needsHuman MUST BE FALSE.

        4. ESCALATION TO HUMAN (SET needsHuman = true ONLY FOR THESE 4 CASES):
           - Explicit Request: Customer explicitly asks for a human, staff, or manager ('speak to someone', 'real person').
           - Complaints & Negative Sentiment: Customer is angry, upset, or complains about past service. Acknowledge respectfully and confirm staff will assist.
           - Refund & Cancellation Requests: Customer asks to cancel an existing booking or wants money back.
           - Severe Profanity or Abusive Language: Stay calm, do not argue, and set needsHuman = true.
           - FOR ALL OTHER CONVERSATIONS (including unknown services, typos, partial booking details), needsHuman MUST BE FALSE!

        --- OUTPUT FORMAT (RAW JSON ONLY) ---
        Output ONLY a JSON object matching this structure:
        {
          "reply": "Your response message to the customer",
          "bookingIntent": true or false,
          "bookingDraft": {
            "serviceName": "Exact catalog service name or null",
            "customerName": "Extracted name or null",
            "date": "YYYY-MM-DD or null",
            "time": "HH:MM or null",
            "notes": "Any customer preferences/notes or null"
          },
          "isComplete": true only if serviceName, customerName, date, and time are ALL valid and non-null,
          "needsHuman": true only if human escalation conditions are met, otherwise false
        }
        """);

        return sb.toString();
    }

    public record AiResponseResult(
        String reply,
        boolean bookingIntent,
        BookingDraftDto bookingDraft,
        boolean isComplete,
        boolean needsHuman
    ) {}

    public record BookingDraftDto(
        String serviceName,
        String customerName,
        String date,
        String time,
        String notes
    ) {}
}