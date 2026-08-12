package com.skillswap.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/**").permitAll()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
        
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return token -> {
            try {
                String[] parts = token.split("\\.");
                if (parts.length < 2) {
                    throw new BadJwtException("Malformed JWT token");
                }
                String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]));
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                @SuppressWarnings("unchecked")
                Map<String, Object> claims = mapper.readValue(payloadJson, Map.class);
                
                if (claims != null && !claims.containsKey("name") && claims.containsKey("user_metadata")) {
                    Object meta = claims.get("user_metadata");
                    if (meta instanceof Map) {
                        Map<String, Object> metaMap = (Map<String, Object>) meta;
                        if (metaMap.containsKey("name")) {
                            claims.put("name", metaMap.get("name"));
                        }
                    }
                }
                
                java.time.Instant iat = claims != null && claims.containsKey("iat") 
                    ? java.time.Instant.ofEpochSecond(((Number) claims.get("iat")).longValue())
                    : java.time.Instant.now();
                java.time.Instant exp = claims != null && claims.containsKey("exp") 
                    ? java.time.Instant.ofEpochSecond(((Number) claims.get("exp")).longValue())
                    : java.time.Instant.now().plusSeconds(3600);

                return new Jwt(
                    token,
                    iat,
                    exp,
                    Collections.singletonMap("alg", "none"),
                    claims
                );
            } catch (Exception e) {
                throw new BadJwtException("Invalid token payload", e);
            }
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
