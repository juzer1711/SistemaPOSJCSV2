package com.sistemaposjcs.sistemaposjcs.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import com.sistemaposjcs.sistemaposjcs.dto.LoginRequest;
import com.sistemaposjcs.sistemaposjcs.dto.LoginResponse;
import com.sistemaposjcs.sistemaposjcs.service.AuthService;

// Marcamos esta clase como un controlador REST,para manejar peticiones HTTP (GET, POST, etc.)
@RestController
//ruta base: todas las peticiones empezarán con /api/auth
@RequestMapping("/api/auth")
// Permitimos solicitudes desde el frontend que corre en localhost:3000 (React)
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {


    private final AuthService authService;

    public AuthController(AuthService authService) { this.authService = authService; }

     // Se accede mediante una solicitud POST a /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> IniciarSesion(@Valid @RequestBody LoginRequest req) {
        
         // Se llama al servicio de autenticación, pasando el objeto LoginRequest (usuario, contraseña)
        LoginResponse res = authService.IniciarSesion(req);

        // Si el estado de la respuesta es "ok", se devuelve un HTTP 200 (OK)
        if ("ok".equals(res.getStatus())) {
            return ResponseEntity.ok(res);

        // Si no, se devuelve un HTTP 401 (Unauthorized) con el mensaje correspondiente
        } else {
            return ResponseEntity.status(401).body(res);
        }
    }

    }
