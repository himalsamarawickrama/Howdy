package com.hss.receptionist.customer;

import com.hss.receptionist.business.Business;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.ZonedDateTime;

@Entity
@Table(name = "customers", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"business_id", "whatsapp_number"})
})
@Data
@NoArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Column(name = "whatsapp_number", nullable = false, length = 30)
    private String whatsappNumber;

    private String name;

    @Column(name = "first_contact_at")
    private ZonedDateTime firstContactAt;

    @Column(name = "last_contact_at")
    private ZonedDateTime lastContactAt;

    @Column(name = "lead_status", length = 30)
    private String leadStatus = "NEW"; 

    @PrePersist
    protected void onCreate() {
        firstContactAt = ZonedDateTime.now();
        lastContactAt = ZonedDateTime.now();
    }
}