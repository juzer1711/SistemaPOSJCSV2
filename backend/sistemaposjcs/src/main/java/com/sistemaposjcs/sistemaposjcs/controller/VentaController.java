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
@CrossOrigin(origins = "http://localhost:3000")

public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    // 🔹 Convertir entidad → DTO
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
                v.getCaja().getIdCaja(),          
                v.getUsuario().getIdUsuario(),
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

    // ✅ 1. Listar ventas activas
    @GetMapping
    public List<VentaDTO> getActiveVentas() {

        return ventaService.getActiveVentas()
                .stream()
                .map(this::convertirVenta)
                .toList();
    }

    // ✅ 2. Listar ventas inactivas
    @GetMapping("/inactivas")
    public List<VentaDTO> getInactiveVentas() {

        return ventaService.getInactiveVentas()
                .stream()
                .map(this::convertirVenta)
                .toList();
    }

    // ✅ 3. Obtener venta por ID
    @GetMapping("/{id}")
    public ResponseEntity<VentaDTO> getVentaById(@PathVariable Long id) {

        Venta venta = ventaService.getVentaById(id);

        return ResponseEntity.ok(convertirVenta(venta));
    }

    // ✅ 4. Crear venta
    @PostMapping
    public ResponseEntity<VentaDTO> createVenta(
            @Valid @RequestBody Venta venta
    ) {

        Venta nuevaVenta = ventaService.createVenta(venta);

        return ResponseEntity.ok(convertirVenta(nuevaVenta));
    }

    // ✅ 5. Actualizar venta
    @PutMapping("/{id}")
    public ResponseEntity<VentaDTO> updateVenta(
            @PathVariable Long id,
            @Valid @RequestBody Venta venta
    ) {

        Venta ventaActualizada = ventaService.updateVenta(id, venta);

        return ResponseEntity.ok(convertirVenta(ventaActualizada));
    }

    // ✅ 6. Desactivar venta (anular)
    @PatchMapping("/desactivar/{id}")
    public ResponseEntity<Void> desactivarVenta(@PathVariable Long id) {

        ventaService.desactivarVenta(id);

        return ResponseEntity.noContent().build();
    }

    // ✅ 7. Reactivar venta
    @PatchMapping("/activar/{id}")
    public ResponseEntity<VentaDTO> activarVenta(@PathVariable Long id) {

        Venta venta = ventaService.activarVenta(id);

        return ResponseEntity.ok(convertirVenta(venta));
    }
}


