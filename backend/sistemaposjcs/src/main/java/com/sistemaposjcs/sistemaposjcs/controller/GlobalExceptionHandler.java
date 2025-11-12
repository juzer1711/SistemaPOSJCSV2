package com.sistemaposjcs.sistemaposjcs.controller;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 🔹 Maneja errores de validación (por @Valid en tus DTOs)
    @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
            Map<String, String> errors = new HashMap<>();
            ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }


    // 🔹 Maneja errores de integridad (duplicados en DB, claves únicas, etc.)
     @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolation(DataIntegrityViolationException ex) {
        Map<String, String> errors = new HashMap<>();

        String message = Optional.ofNullable(ex.getRootCause())
                .map(Throwable::getMessage)
                .orElse(ex.getMessage())
                .toLowerCase();

        // ⚙️ Identificar qué campo causó la violación del índice único
        if (message.contains("username")) {
            errors.put("username", "El nombre de usuario ya está registrado");
        } else if (message.contains("documento")) {
            errors.put("documento", "El documento ya está registrado");
        } else if (message.contains("email")) {
            errors.put("email", "El correo electrónico ya está registrado");
        } else if (message.contains("email")) {
            errors.put("error", "Ya existe un usuario con ese correo electrónico");
        } else {
            errors.put("error", "Ya existe un registro con datos duplicados");
        }

        return new ResponseEntity<>(errors, HttpStatus.CONFLICT);
    }
}

