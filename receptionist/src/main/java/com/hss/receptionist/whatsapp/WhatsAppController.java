package com.hss.receptionist.whatsapp;

import com.hss.receptionist.whatsapp.dto.WhatsAppWebhookRequest;
import org.springframework.ai.chat.client.ChatClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/whatsapp/webhook")
@Slf4j
public class WhatsAppController {

    private final WhatsAppService whatsAppService;
    private final ChatClient chatClient;

    // We removed @RequiredArgsConstructor and added this constructor to build the ChatClient
    public WhatsAppController(WhatsAppService whatsAppService, ChatClient.Builder chatClientBuilder) {
        this.whatsAppService = whatsAppService;
        this.chatClient = chatClientBuilder.build();
    }

    // --- TEMPORARY TEST ENDPOINT ---
    @GetMapping("/test-ai")
    public String testGemini() {
        log.info("Sending test prompt to Gemini...");
        return chatClient.prompt()
                .user("Who is the president of Sri Lanka?")
                .call()
                .content();
    }

    // 1. Webhook Verification (Handshake with Meta)
    @GetMapping
    public ResponseEntity<String> verifyWebhook(
            @RequestParam("hub.mode") String mode,
            @RequestParam("hub.verify_token") String token,
            @RequestParam("hub.challenge") String challenge) {
        
        String myVerifyToken = "hss_secure_verify_token"; // You can customize or move to application.yml

        if ("subscribe".equals(mode) && myVerifyToken.equals(token)) {
            log.info("WhatsApp webhook verified successfully!");
            return ResponseEntity.ok(challenge);
        }
        return ResponseEntity.status(403).body("Verification failed");
    }

    // 2. Receive Incoming Messages from WhatsApp
    @PostMapping
    public ResponseEntity<Void> receiveMessage(@RequestBody WhatsAppWebhookRequest request) {
        log.info("Received WhatsApp webhook payload.");
        whatsAppService.processIncomingMessage(request);
        return ResponseEntity.ok().build();
    }
}