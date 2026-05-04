package com.sistemaposjcs.sistemaposjcs.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDuplicate(DataIntegrityViolationException e) {

        Map<String, String> response = new HashMap<>();

        String error = e.getMostSpecificCause().getMessage().toLowerCase();

        // 🔥 PRODUCTOS
        if (error.contains("codigo_barras")) {
            response.put("field", "codigoBarras");
            response.put("message", "El código de barras ya existe");
        }

        // 🔥 CLIENTES
        else if (error.contains("documento")) {
            response.put("field", "documento");
            response.put("message", "El documento ya existe");
        }

        // 🔥 USUARIOS
        else if (error.contains("username")) {
            response.put("field", "username");
            response.put("message", "El usuario ya existe");
        }

        // 🔥 DEFAULT
        else {
            response.put("field", "sistema");
            // Esto te dirá la verdad en el JSON de respuesta
            response.put("message", e.getMostSpecificCause().getMessage()); 
        }

        return ResponseEntity.badRequest().body(response);
    }
}
