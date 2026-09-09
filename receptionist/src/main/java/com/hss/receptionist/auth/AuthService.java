package com.hss.receptionist.auth;

import com.hss.receptionist.auth.dto.AuthResponse;
import com.hss.receptionist.auth.dto.GoogleAuthRequest;
import com.hss.receptionist.auth.dto.LoginRequest;
import com.hss.receptionist.auth.dto.RegisterRequest;
import com.hss.receptionist.business.Business;
import com.hss.receptionist.business.BusinessRepository;
import com.hss.receptionist.security.JwtService;
import com.hss.receptionist.user.User;
import com.hss.receptionist.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BusinessRepository businessRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email already registered");
        }

        Business business = Business.builder()
                .name(req.businessName())
                .phone(req.phone())
                .timezone("Asia/Dubai")
                .build();
        business = businessRepository.save(business);

        User user = User.builder()
                .business(business)
                .email(req.email())
                .passwordHash(passwordEncoder.encode(req.password()))
                .role("ROLE_BUSINESS_OWNER")
                .build();
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), business.getId(), user.getRole());
        return new AuthResponse(token, business.getId(), business.getName(), user.getEmail(), user.getRole());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        Long businessId = user.getBusiness() != null ? user.getBusiness().getId() : null;
        String businessName = user.getBusiness() != null ? user.getBusiness().getName() : null;

        String token = jwtService.generateToken(user.getEmail(), businessId, user.getRole());
        return new AuthResponse(token, businessId, businessName, user.getEmail(), user.getRole());
    }

    @Transactional
    public AuthResponse loginWithGoogle(GoogleAuthRequest req) {
        String email = req.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            String salonName = (req.getName() != null && !req.getName().isBlank())
                    ? req.getName().trim() + "'s Salon"
                    : "My Salon & Spa";

            Business newBusiness = Business.builder()
                    .name(salonName)
                    .timezone("Asia/Dubai")
                    .build();
            Business savedBusiness = businessRepository.save(newBusiness);

            User newUser = User.builder()
                    .business(savedBusiness)
                    .email(email)
                    .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role("ROLE_BUSINESS_OWNER")
                    .build();
            return userRepository.save(newUser);
        });

        Long businessId = user.getBusiness() != null ? user.getBusiness().getId() : null;
        String businessName = user.getBusiness() != null ? user.getBusiness().getName() : null;

        String token = jwtService.generateToken(user.getEmail(), businessId, user.getRole());
        return new AuthResponse(token, businessId, businessName, user.getEmail(), user.getRole());
    }
}