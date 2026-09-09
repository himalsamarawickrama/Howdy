package com.hss.receptionist.customer;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerRepository customerRepository;

    @GetMapping
    public ResponseEntity<List<Customer>> listCustomers(Authentication authentication) {
        Long businessId = extractBusinessId(authentication);
        List<Customer> customers = customerRepository.findAllByBusinessIdOrderByFirstContactAtDesc(businessId);
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomer(@PathVariable Long id, Authentication authentication) {
        Long businessId = extractBusinessId(authentication);

        return customerRepository.findById(id)
                .filter(c -> c.getBusiness().getId().equals(businessId))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private Long extractBusinessId(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new IllegalStateException("Unauthenticated request");
        }
        if (authentication.getDetails() instanceof Long bId) {
            return bId;
        }
        try {
            var method = authentication.getPrincipal().getClass().getMethod("getBusinessId");
            return (Long) method.invoke(authentication.getPrincipal());
        } catch (Exception e) {
            return 1L;
        }
    }
}