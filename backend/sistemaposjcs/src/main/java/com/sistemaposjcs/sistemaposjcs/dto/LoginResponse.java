package com.sistemaposjcs.sistemaposjcs.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String status;  // "ok" o "error"
    private Long idUsuario;
    private String username;
    private String role;
    private String message;
    private String token;   // 🔑 Nuevo campo para el JWT
}
