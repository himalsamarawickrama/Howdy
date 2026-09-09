package com.hss.receptionist.whatsapp.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record WhatsAppWebhookRequest(
    String object,
    List<Entry> entry
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Entry(
        String id,
        List<Change> changes
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Change(
        Value value,
        String field
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Value(
        @JsonProperty("messaging_product") String messagingProduct,
        Metadata metadata,
        List<Contact> contacts,
        List<Message> messages
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Metadata(
        @JsonProperty("display_phone_number") String displayPhoneNumber,
        @JsonProperty("phone_number_id") String phoneNumberId
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Contact(
        Profile profile,
        String waId
    ) {
        @JsonIgnoreProperties(ignoreUnknown = true)
        public record Profile(String name) {}
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Message(
        String from,
        String id,
        String timestamp,
        Text text,
        String type
    ) {
        @JsonIgnoreProperties(ignoreUnknown = true)
        public record Text(String body) {}
    }
}