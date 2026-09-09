package com.hss.receptionist.catalog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalonServiceRepository extends JpaRepository<SalonService, Long> {
    List<SalonService> findAllByBusinessId(Long businessId);
    List<SalonService> findAllByBusinessIdAndIsActiveTrue(Long businessId);
    Optional<SalonService> findByIdAndBusinessId(Long id, Long businessId);

    long countByBusinessId(Long businessId);
}