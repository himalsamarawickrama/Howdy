package com.hss.receptionist.booking;

import com.hss.receptionist.booking.dto.BookingResponse;
import com.hss.receptionist.booking.dto.UpdateBookingStatusRequest;
import com.hss.receptionist.catalog.SalonService;
import com.hss.receptionist.catalog.SalonServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRequestRepository bookingRequestRepository;
    private final SalonServiceRepository salonServiceRepository;

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsForBusiness(Long businessId) {
        return bookingRequestRepository.findAllByBusinessId(businessId)
                .stream()
                .map(req -> {
                    SalonService service = null;
                    if (req.getServiceId() != null) {
                        service = salonServiceRepository.findById(req.getServiceId()).orElse(null);
                    }
                    return BookingResponse.fromEntity(req, service);
                })
                .toList();
    }

    @Transactional
    public BookingResponse updateStatus(Long bookingId, Long businessId, UpdateBookingStatusRequest request) {
        BookingRequest booking = bookingRequestRepository.findByIdAndBusinessId(bookingId, businessId)
                .orElseThrow(() -> new RuntimeException("Booking request not found"));

        booking.setStatus(request.getStatus().toUpperCase());
        
        SalonService service = null;
        if (booking.getServiceId() != null) {
            service = salonServiceRepository.findById(booking.getServiceId()).orElse(null);
        }
        
        return BookingResponse.fromEntity(booking, service);
    }
}