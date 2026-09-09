package com.hss.receptionist.business;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_settings")
@Getter
@Setter
@NoArgsConstructor
public class AiSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", unique = true, nullable = false)
    private Business business;

    @Column(name = "system_prompt_extra", columnDefinition = "TEXT")
    private String systemPromptExtra;

    @Column(name = "max_tokens")
    private Integer maxTokens = 300;

    @Column(name = "ai_enabled")
    private Boolean aiEnabled = true;

    @Column(name = "tone", length = 30)
    private String tone = "FRIENDLY";

    @Column(name = "language", length = 10)
    private String language = "EN";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}