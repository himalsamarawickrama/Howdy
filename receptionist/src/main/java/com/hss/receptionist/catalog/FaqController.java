package com.hss.receptionist.catalog;

import com.hss.receptionist.catalog.dto.FaqRequest;
import com.hss.receptionist.catalog.dto.FaqResponse;
import com.hss.receptionist.security.TenantUserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faqs")
@RequiredArgsConstructor
public class FaqController {

    private final CatalogService catalogService;

    @GetMapping
    public ResponseEntity<List<FaqResponse>> getAll(@AuthenticationPrincipal TenantUserPrincipal principal) {
        return ResponseEntity.ok(catalogService.getAllFaqs(principal.getBusinessId()));
    }

    @PostMapping
    public ResponseEntity<FaqResponse> create(
            @RequestBody FaqRequest request,
            @AuthenticationPrincipal TenantUserPrincipal principal
    ) {
        return ResponseEntity.ok(catalogService.createFaq(principal.getBusinessId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FaqResponse> update(
            @PathVariable Long id,
            @RequestBody FaqRequest request,
            @AuthenticationPrincipal TenantUserPrincipal principal
    ) {
        return ResponseEntity.ok(catalogService.updateFaq(id, principal.getBusinessId(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal TenantUserPrincipal principal
    ) {
        catalogService.deleteFaq(id, principal.getBusinessId());
        return ResponseEntity.noContent().build();
    }
}