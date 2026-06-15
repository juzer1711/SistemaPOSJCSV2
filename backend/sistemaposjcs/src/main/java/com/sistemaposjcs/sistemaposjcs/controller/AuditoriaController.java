package com.sistemaposjcs.sistemaposjcs.controller;

import com.sistemaposjcs.sistemaposjcs.dto.AuditoriaDTO;
import com.sistemaposjcs.sistemaposjcs.service.AuditoriaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auditoria")
@CrossOrigin(origins = "*")
public class AuditoriaController {

    private final AuditoriaService auditoriaService;

    public AuditoriaController(AuditoriaService auditoriaService) {
        this.auditoriaService = auditoriaService;
    }

    //  Traer todo el log
    @GetMapping
    public List<AuditoriaDTO> listar() {
        return auditoriaService.listar();
    }
}
