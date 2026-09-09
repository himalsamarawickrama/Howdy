package com.hss.receptionist.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class GeminiAiProvider implements AiProvider {

    private final ChatModel chatModel;

    @Override
    public String generateResponse(String systemPrompt, List<Map<String, String>> conversationHistory, String userMessage) {
        List<Message> messages = new ArrayList<>();

        // 1. System instructions, catalog context, and tone constraints
        messages.add(new SystemMessage(systemPrompt));

        // 2. Short-term memory history
        if (conversationHistory != null) {
            for (Map<String, String> entry : conversationHistory) {
                String role = entry.get("role");
                String content = entry.get("content");
                if ("user".equalsIgnoreCase(role)) {
                    messages.add(new UserMessage(content));
                } else {
                    messages.add(new AssistantMessage(content));
                }
            }
        }

        // 3. New incoming user query
        messages.add(new UserMessage(userMessage));

        try {
            Prompt prompt = new Prompt(messages);
            return chatModel.call(prompt).getResult().getOutput().getText();
        } catch (Exception e) {
            log.error("Gemini AI API call failed: {}", e.getMessage(), e);
            // Return valid fallback JSON without flagging needsHuman = true
            return """
            {
              "reply": "I'm experiencing a brief network delay right now. Please message again in a moment!",
              "bookingIntent": false,
              "bookingDraft": null,
              "isComplete": false,
              "needsHuman": false
            }
            """;
        }
    }
}