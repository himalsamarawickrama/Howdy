package com.hss.receptionist.booking.dto;

import com.hss.receptionist.booking.BookingRequest;
import com.hss.receptionist.catalog.SalonService;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;

@Getter
@Builder
public class BookingResponse {
    private Long id;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private Long serviceId;
    private String serviceName;
    private LocalDate requestedDate;
    private LocalTime requestedTime;
    private String notes;
    private String status;
    private OffsetDateTime createdAt;

    public static BookingResponse fromEntity(BookingRequest entity, SalonService salonService) {
        return BookingResponse.builder()
                .id(entity.getId())
                .customerId(entity.getCustomer().getId())
                .customerName(entity.getCustomer().getName())
                .customerPhone(entity.getCustomer().getWhatsappNumber())
                .serviceId(entity.getServiceId())
                .serviceName(salonService != null ? salonService.getName() : null)
                .requestedDate(entity.getRequestedDate())
                .requestedTime(entity.getRequestedTime())
                .notes(entity.getNotes())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public static BookingResponse fromEntity(BookingRequest entity) {
        return fromEntity(entity, null);
    }
}