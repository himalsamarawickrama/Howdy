package com.hss.receptionist.catalog;

import com.hss.receptionist.catalog.dto.ServiceRequest;
import com.hss.receptionist.catalog.dto.ServiceResponse;
import com.hss.receptionist.security.TenantUserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class SalonServiceController {

    private final CatalogService catalogService;

    @GetMapping
    public ResponseEntity<List<ServiceResponse>> getAll(@AuthenticationPrincipal TenantUserPrincipal principal) {
        return ResponseEntity.ok(catalogService.getAllServices(principal.getBusinessId()));
    }

    @PostMapping
    public ResponseEntity<ServiceResponse> create(
            @RequestBody ServiceRequest request,
            @AuthenticationPrincipal TenantUserPrincipal principal
    ) {
        return ResponseEntity.ok(catalogService.createService(principal.getBusinessId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceResponse> update(
            @PathVariable Long id,
            @RequestBody ServiceRequest request,
            @AuthenticationPrincipal TenantUserPrincipal principal
    ) {
        return ResponseEntity.ok(catalogService.updateService(id, principal.getBusinessId(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal TenantUserPrincipal principal
    ) {
        catalogService.deleteService(id, principal.getBusinessId());
        return ResponseEntity.noContent().build();
    }
}