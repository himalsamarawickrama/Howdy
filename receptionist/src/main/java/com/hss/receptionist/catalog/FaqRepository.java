package com.hss.receptionist.catalog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FaqRepository extends JpaRepository<Faq, Long> {
    List<Faq> findAllByBusinessId(Long businessId);
    Optional<Faq> findByIdAndBusinessId(Long id, Long businessId);
}