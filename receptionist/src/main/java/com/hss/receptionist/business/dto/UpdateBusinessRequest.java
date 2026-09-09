package com.hss.receptionist.business.dto;

public record UpdateBusinessRequest(
    String name,
    String phone,
    String address,
    String timezone
) {}