package com.sistemaposjcs.sistemaposjcs.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration

public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // desactiva CSRF (útil para APIs)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // permite todo temporalmente
            )
            .formLogin(form -> form.disable()); // desactiva el login de formulario

        return http.build();
    }

    @Bean
        public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
