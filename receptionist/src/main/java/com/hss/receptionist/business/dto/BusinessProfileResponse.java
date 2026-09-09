package com.hss.receptionist.business.dto;

public record BusinessProfileResponse(
    Long id, String name, String description, String phone, String address, 
    String country, String timezone, String whatsappPhoneNumberId, 
    String whatsappAccessToken, Boolean aiEnabled, String tone, String language
) {}