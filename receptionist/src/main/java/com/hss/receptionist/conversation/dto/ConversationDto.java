package com.hss.receptionist.conversation.dto;

import java.time.ZonedDateTime;
import java.util.List;

public record ConversationDto(
    Long id,
    String status,
    ZonedDateTime updatedAt,
    CustomerSummary customer,
    List<MessageSummary> messages
) {
    public record CustomerSummary(Long id, String name, String whatsappNumber) {}
    public record MessageSummary(Long id, String sender, String content, ZonedDateTime createdAt) {}
}