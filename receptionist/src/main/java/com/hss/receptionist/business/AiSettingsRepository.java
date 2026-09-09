package com.hss.receptionist.business;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AiSettingsRepository extends JpaRepository<AiSettings, Long> {
    Optional<AiSettings> findByBusinessId(Long businessId);
}