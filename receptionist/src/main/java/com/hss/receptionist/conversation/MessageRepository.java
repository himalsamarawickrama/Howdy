package com.hss.receptionist.conversation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findTop5ByConversationIdOrderByCreatedAtDesc(Long conversationId);

    List<Message> findAllByConversationIdOrderByCreatedAtAsc(Long conversationId);

    long countByConversationBusinessIdAndSenderAndCreatedAtBetween(
            Long businessId, String sender, LocalDateTime start, LocalDateTime end
    );
}