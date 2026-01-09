package com.sistemaposjcs.sistemaposjcs.controller;

import com.sistemaposjcs.sistemaposjcs.dto.ItemFacturaDTO;
import com.sistemaposjcs.sistemaposjcs.dto.VentaDTO;
import com.sistemaposjcs.sistemaposjcs.model.Venta;
import com.sistemaposjcs.sistemaposjcs.service.VentaService;


import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "http://localhost:3000") // permitir conexión desde React

public class VentaController {

private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

private VentaDTO convertirVenta(Venta v) {
    List<ItemFacturaDTO> itemsDTO = v.getItems().stream()
        .map(i -> new ItemFacturaDTO(
                i.getProducto().getIdProducto(),
                i.getProducto().getNombre(),
                i.getCantidad(),
                i.getPrecioUnitario(),
                i.getSubtotal(),
                i.getIvaPorcentaje(),
                i.getValorIVA()
        )).toList();

    return new VentaDTO(
        v.getIdVenta(),
        v.getFecha(),
        v.getCliente().getIdCliente(),
        v.getCliente().getNombreCompleto(),
        v.getCliente().getDocumento(),
        v.getMetodoPago(),
        v.getTotal(),
        v.getTotalIVA(),
        v.getTotalSinIVA(),
        v.getObservaciones(),
        v.getEstado(),
        v.getMontoRecibido(),
        v.getCambio(),
        itemsDTO
    );
}



    // ✅ 1. Listar solo ACTIVOS
@GetMapping
public List<VentaDTO> getActiveVentas() {
    return ventaService.getActiveVentas()
        .stream()
        .map(this::convertirVenta)
        .toList();
}

    @GetMapping("/inactivos")
public List<VentaDTO> getInactiveVentas() {
    return ventaService.getInactiveVentas()
        .stream()
        .filter(v -> v.getEstado() == false)
        .map(this::convertirVenta)
        .toList();
}

    //  Obtener venta por ID
    @GetMapping("/{id}")
    public ResponseEntity<VentaDTO> getVentaById(@PathVariable Long id) {
        Venta venta = ventaService.getVentaById(id);
        return ResponseEntity.ok(convertirVenta(venta));
    }

    //  Crear venta
    @PostMapping
    public ResponseEntity<Venta> createVenta(@Valid @RequestBody Venta venta) {
        return ResponseEntity.ok(ventaService.createVenta(venta));
    }

    //  Actualizar venta
    @PutMapping("/{id}")
    public ResponseEntity<Venta> updateVenta(
            @PathVariable Long id,
            @Valid @RequestBody Venta venta
    ) {
        return ResponseEntity.ok(ventaService.updateVenta(id, venta));
    }

    // ✅ 5. Desactivar venta
    @DeleteMapping("/desactivar/{id}")
    public ResponseEntity<Void> desactivarVenta(@PathVariable Long id) {
        ventaService.desactivarVenta(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/activar/{id}")
    public ResponseEntity<Venta> activarVenta(@PathVariable Long id) {
        return ResponseEntity.ok(ventaService.activarVenta(id));
    }
}
    


