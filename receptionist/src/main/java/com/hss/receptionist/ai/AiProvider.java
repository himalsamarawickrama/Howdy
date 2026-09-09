package com.hss.receptionist.ai;

import java.util.List;
import java.util.Map;

public interface AiProvider {
    /**
     * @param systemPrompt Instructions, salon services, FAQs, and constraints
     * @param conversationHistory List of maps containing role ("user"/"model") and content
     * @param userMessage Latest incoming customer message
     * @return Model response text
     */
    String generateResponse(String systemPrompt, List<Map<String, String>> conversationHistory, String userMessage);
}