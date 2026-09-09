package com.hss.receptionist.booking;

import com.hss.receptionist.booking.dto.BookingResponse;
import com.hss.receptionist.booking.dto.UpdateBookingStatusRequest;
import com.hss.receptionist.security.TenantUserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booking-requests")
@RequiredArgsConstructor
public class BookingRequestController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getBookings(
            @AuthenticationPrincipal TenantUserPrincipal principal
    ) {
        return ResponseEntity.ok(bookingService.getBookingsForBusiness(principal.getBusinessId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateBookingStatusRequest request,
            @AuthenticationPrincipal TenantUserPrincipal principal
    ) {
        return ResponseEntity.ok(bookingService.updateStatus(id, principal.getBusinessId(), request));
    }
}