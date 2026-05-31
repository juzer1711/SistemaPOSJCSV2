package com.sistemaposjcs.sistemaposjcs.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.sistemaposjcs.sistemaposjcs.dto.EmpresaDTO;
import com.sistemaposjcs.sistemaposjcs.model.Empresa;
import com.sistemaposjcs.sistemaposjcs.service.EmpresaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.io.IOException;


@RestController
@RequestMapping("/api/empresa")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "http://localhost:3000")
public class EmpresaController {

    private final EmpresaService empresaService;

    @GetMapping
    public ResponseEntity<EmpresaDTO> obtenerEmpresa() {

        return ResponseEntity.ok(
                empresaService.obtenerEmpresa()
        );
    }

    @PostMapping
    public ResponseEntity<EmpresaDTO> crearEmpresa(
            @Valid @RequestBody Empresa empresa) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(empresaService.crearEmpresa(empresa));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmpresaDTO> actualizarEmpresa(
            @PathVariable Long id,
            @Valid @RequestBody Empresa empresa) {

        return ResponseEntity.ok(
                empresaService.actualizarEmpresa(id, empresa)
        );
    }

    // Solo este endpoint nuevo, el GET /logo/{filename} ya no hace falta
        @PostMapping("/logo")
        public ResponseEntity<EmpresaDTO> subirLogo(
                @RequestParam("file") MultipartFile file) throws IOException {

            return ResponseEntity.ok(empresaService.actualizarLogo(file));
        }
}