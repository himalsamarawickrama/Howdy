package com.hss.receptionist.customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByBusinessIdAndWhatsappNumber(Long businessId, String whatsappNumber);

    long countByBusinessIdAndFirstContactAtBetween(Long businessId, LocalDateTime start, LocalDateTime end);

    List<Customer> findAllByBusinessIdOrderByFirstContactAtDesc(Long businessId);
}