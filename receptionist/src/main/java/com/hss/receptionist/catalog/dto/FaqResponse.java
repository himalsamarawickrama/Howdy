package com.hss.receptionist.catalog.dto;

import com.hss.receptionist.catalog.Faq;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FaqResponse {
    private Long id;
    private String question;
    private String answer;

    public static FaqResponse fromEntity(Faq entity) {
        return FaqResponse.builder()
                .id(entity.getId())
                .question(entity.getQuestion())
                .answer(entity.getAnswer())
                .build();
    }
}