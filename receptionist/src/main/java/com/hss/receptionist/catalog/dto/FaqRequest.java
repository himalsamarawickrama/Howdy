package com.hss.receptionist.catalog.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FaqRequest {
    private String question;
    private String answer;
}