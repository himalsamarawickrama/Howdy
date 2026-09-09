package com.hss.receptionist.business;

import com.hss.receptionist.booking.BookingRequestRepository;
import com.hss.receptionist.business.dto.BusinessProfileResponse;
import com.hss.receptionist.business.dto.DashboardSummaryResponse;
import com.hss.receptionist.business.dto.UpdateAiSettingsRequest;
import com.hss.receptionist.security.TenantUserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/business")
@RequiredArgsConstructor
public class BusinessController {

    private final BusinessRepository businessRepository;
    private final BookingRequestRepository bookingRequestRepository;
    private final AiSettingsRepository aiSettingsRepository;

    @GetMapping("/me")
    public ResponseEntity<BusinessProfileResponse> getCurrentBusiness(
            @AuthenticationPrincipal TenantUserPrincipal principal
    ) {
        if (principal == null || principal.getBusinessId() == null) {
            return ResponseEntity.status(401).build();
        }

        return businessRepository.findById(principal.getBusinessId())
                .map(biz -> {
                    // Fetch AI Settings or create defaults if they don't exist yet
                    AiSettings aiSettings = aiSettingsRepository.findByBusinessId(biz.getId())
                            .orElseGet(() -> {
                                AiSettings defaultSettings = new AiSettings();
                                defaultSettings.setBusiness(biz);
                                return aiSettingsRepository.save(defaultSettings);
                            });

                    // Return combined profile
                    BusinessProfileResponse response = new BusinessProfileResponse(
                            biz.getId(),
                            biz.getName(),
                            biz.getDescription(),
                            biz.getPhone(),
                            biz.getAddress(),
                            biz.getCountry(),
                            biz.getTimezone(),
                            biz.getWhatsappPhoneNumberId(),
                            biz.getWhatsappAccessToken(),
                            aiSettings.getAiEnabled(),
                            aiSettings.getTone(),
                            aiSettings.getLanguage()
                    );
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<Business> updateProfile(
            @AuthenticationPrincipal TenantUserPrincipal principal,
            @RequestBody Map<String, Object> body
    ) {
        if (principal == null || principal.getBusinessId() == null) {
            return ResponseEntity.status(401).build();
        }

        return businessRepository.findById(principal.getBusinessId())
                .map(biz -> {
                    if (body.containsKey("name") && body.get("name") != null) {
                        biz.setName(body.get("name").toString());
                    }
                    if (body.containsKey("phone") && body.get("phone") != null) {
                        biz.setPhone(body.get("phone").toString());
                    }
                    if (body.containsKey("address") && body.get("address") != null) {
                        biz.setAddress(body.get("address").toString());
                    }
                    if (body.containsKey("timezone") && body.get("timezone") != null) {
                        biz.setTimezone(body.get("timezone").toString());
                    }
                    return ResponseEntity.ok(businessRepository.save(biz));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/me/ai-settings")
    public ResponseEntity<Void> updateAiSettings(
            @AuthenticationPrincipal TenantUserPrincipal principal,
            @RequestBody UpdateAiSettingsRequest req
    ) {
        if (principal == null || principal.getBusinessId() == null) {
            return ResponseEntity.status(401).build();
        }

        Business biz = businessRepository.findById(principal.getBusinessId()).orElse(null);
        if (biz == null) {
            return ResponseEntity.notFound().build();
        }

        AiSettings aiSettings = aiSettingsRepository.findByBusinessId(biz.getId())
                .orElseGet(() -> {
                    AiSettings s = new AiSettings();
                    s.setBusiness(biz);
                    return s;
                });

        // Update fields if provided in the frontend request
        if (req.aiEnabled() != null) aiSettings.setAiEnabled(req.aiEnabled());
        if (req.tone() != null) aiSettings.setTone(req.tone());
        if (req.language() != null) aiSettings.setLanguage(req.language());

        aiSettingsRepository.save(aiSettings);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/dashboard-summary")
    public ResponseEntity<DashboardSummaryResponse> getDashboardSummary(
            @AuthenticationPrincipal TenantUserPrincipal principal
    ) {
        Long businessId = (principal != null) ? principal.getBusinessId() : null;

        long pendingRequests = 0;

        if (businessId != null) {
            try {
                pendingRequests = bookingRequestRepository.countByBusinessId(businessId);
            } catch (Exception ignored) {}
        }

        DashboardSummaryResponse response = DashboardSummaryResponse.builder()
                .todaysConversations(0)
                .newCustomers(0)
                .aiResponses(0)
                .humanHandovers(0)
                .pendingRequests(pendingRequests)
                .popularOffering("Mid Taper")
                .build();

        return ResponseEntity.ok(response);
    }
}