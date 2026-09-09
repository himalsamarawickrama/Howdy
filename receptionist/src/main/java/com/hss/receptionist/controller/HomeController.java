package com.hss.receptionist.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> home() {
        return ResponseEntity.ok(Map.of(
            "service", "Howdy AI WhatsApp Receptionist",
            "status", "RUNNING",
            "actuator", "/actuator/health",
            "webhook", "/api/whatsapp/webhook"
        ));
    }
}