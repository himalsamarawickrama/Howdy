package com.hss.receptionist.auth.dto;

public record AuthResponse(
    String token,
    Long businessId,
    String businessName,
    String email,
    String role
) {}