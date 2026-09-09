package com.hss.receptionist.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthFilter.class);
    private final JwtService jwtService;

    // --- THIS IS THE METHOD WE UPDATED ---
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.contains("/auth/") || path.contains("/whatsapp/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Path [{}] - No Bearer token found in header", request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7).trim();
        try {
            String email = jwtService.extractEmail(token);
            String role = jwtService.extractClaim(token, claims -> claims.get("role", String.class));
            Long businessId = jwtService.extractBusinessId(token);

            log.info("Path [{}] - Token decoded. Email: {}, BusinessId: {}, Role: {}", 
                     request.getRequestURI(), email, businessId, role);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                String authorityName = (role == null || role.isBlank())
                        ? "ROLE_BUSINESS_OWNER"
                        : (role.startsWith("ROLE_") ? role : "ROLE_" + role);

                List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                        new SimpleGrantedAuthority(authorityName)
                );

                TenantUserPrincipal principal = new TenantUserPrincipal(email, businessId, authorityName);

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        authorities
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);

                log.info("Path [{}] - SecurityContext successfully populated for user [{}] with authority [{}]", 
                         request.getRequestURI(), email, authorityName);
            }
        } catch (Exception ex) {
            log.error("Path [{}] - JWT validation failed: {}", request.getRequestURI(), ex.getMessage(), ex);
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}