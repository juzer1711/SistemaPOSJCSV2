package com.sistemaposjcs.sistemaposjcs.controller;

import com.sistemaposjcs.sistemaposjcs.dto.CajaDTO;
import com.sistemaposjcs.sistemaposjcs.model.Caja;
import com.sistemaposjcs.sistemaposjcs.service.CajaService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cajas")
@CrossOrigin(origins = "http://localhost:3000")
public class CajaController {

    private final CajaService cajaService;

    public CajaController(CajaService cajaService) {
        this.cajaService = cajaService;
    }

    // 🔹 Convertir Caja a DTO
    private CajaDTO convertirCaja(Caja c) {
        return new CajaDTO(
                c.getIdCaja(),
                c.getUsuario().getIdUsuario(),
                c.getUsuario().getNombreCompleto(),
                c.getFechaApertura(),
                c.getFechaCierre(),
                c.getMontoInicial(),
                c.getTotalVentas(),
                c.getTotalEfectivo(),
                c.getTotalTransferencia(),
                c.getMontoFinal(),
                c.getEstadoCaja()
        );
    }

    // ✅ 1. Listar todas las cajas
    @GetMapping
    public List<CajaDTO> getAllCajas() {
        return cajaService.getAllCajas()
                .stream()
                .map(this::convertirCaja)
                .toList();
    }

    // ✅ 2. Obtener caja por ID
    @GetMapping("/{id}")
    public ResponseEntity<CajaDTO> getCajaById(@PathVariable Long id) {
        Caja caja = cajaService.getCajaById(id);
        return ResponseEntity.ok(convertirCaja(caja));
    }

    // ✅ 3. Listar cajas abiertas
    @GetMapping("/abiertas")
    public List<CajaDTO> getCajasAbiertas() {
        return cajaService.getCajasAbiertas()
                .stream()
                .map(this::convertirCaja)
                .toList();
    }

    // ✅ 4. Abrir caja
    @PostMapping("/abrir")
    public ResponseEntity<CajaDTO> abrirCaja(@RequestBody CajaDTO dto) {

        Caja caja = cajaService.abrirCaja(
                dto.getIdUsuario(),
                dto.getMontoInicial()
        );

        return ResponseEntity.ok(convertirCaja(caja));
    }

    // ✅ 5. Cerrar caja
    @PutMapping("/cerrar/{id}")
    public ResponseEntity<CajaDTO> cerrarCaja(
            @PathVariable Long id,
            @RequestBody CajaDTO cajaDTO
    ) {

        Caja caja = cajaService.cerrarCaja(id, cajaDTO.getMontoFinal());
        return ResponseEntity.ok(convertirCaja(caja));
    }

    // ✅ 4. Listar cajas cerradas
    @GetMapping("/cerradas")
    public List<CajaDTO> getCajasCerradas() {
        return cajaService.getCajasCerradas()
                .stream()
                .map(this::convertirCaja)
                .toList();
    }

    // ✅ 5. Obtener caja por IDUsuario
    @GetMapping("/{idUsuario}/activa")
    public ResponseEntity<CajaDTO> getCajaByIdUsuario(@PathVariable Long idUsuario) {
        Caja caja = cajaService.obtenerCajaActivaPorUsuario(idUsuario);
        return ResponseEntity.ok(convertirCaja(caja));
    }

}