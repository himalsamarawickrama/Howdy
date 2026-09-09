package com.hss.receptionist.business.dto;

public record UpdateAiSettingsRequest(
    Boolean aiEnabled,
    String tone,
    String language
) {}