package com.hss.receptionist.conversation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    // Look up the active conversation regardless of status (AI_ACTIVE or NEEDS_HUMAN)
    Optional<Conversation> findFirstByBusinessIdAndCustomerIdOrderByUpdatedAtDesc(Long businessId, Long customerId);

    Optional<Conversation> findByBusinessIdAndCustomerIdAndStatus(Long businessId, Long customerId, String status);

    long countByBusinessIdAndUpdatedAtBetween(Long businessId, LocalDateTime start, LocalDateTime end);

    long countByBusinessIdAndStatus(Long businessId, String status);

    List<Conversation> findAllByBusinessIdOrderByUpdatedAtDesc(Long businessId);
}