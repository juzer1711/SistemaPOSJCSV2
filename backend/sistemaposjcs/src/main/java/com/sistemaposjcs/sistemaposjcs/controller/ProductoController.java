package com.sistemaposjcs.sistemaposjcs.controller;

import com.sistemaposjcs.sistemaposjcs.dto.ProductoDTO;
import com.sistemaposjcs.sistemaposjcs.model.Producto;
import com.sistemaposjcs.sistemaposjcs.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:3000") // permitir conexión desde React
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    //  1. Listar todos los usuarios
    @GetMapping
    public List<ProductoDTO> getActiveProductos() {
        return productoService.getActiveProductos()
            .stream()
            .map(p -> new ProductoDTO(
                p.getIdProducto(),
                p.getNombre(),
                p.getCategoria(),
                p.getCosto(),
                p.getPrecioventa(),
                p.getEstado()))
            .toList();
    }

    @GetMapping("/inactivos")
    public List<ProductoDTO> getInactiveProductos() {
        return productoService.getInactiveProductos()
            .stream()
            .filter(p -> p.getEstado() == false)
            .map(p -> new ProductoDTO(
                p.getIdProducto(),
                p.getNombre(),
                p.getCategoria(),
                p.getCosto(),
                p.getPrecioventa(),
                p.getEstado()))
            .toList();
    }

    // 2. Obtener producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.getProductoById(id));
    }

    //  3. Crear producto
    @PostMapping
    public ResponseEntity<Producto> createProducto(@Valid @RequestBody Producto producto) {
        return ResponseEntity.ok(productoService.createProducto(producto));
    }

    //  4. Actualizar producto
    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(
            @PathVariable Long id,
            @Valid @RequestBody Producto producto
    ) {
        return ResponseEntity.ok(productoService.updateProducto(id, producto));
    }

    //  5. Activar/Desactivar usuario
    @DeleteMapping("/desactivar/{id}")
    public ResponseEntity<Void> desactivarProducto(@PathVariable Long id) {
        productoService.desactivarProducto(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/activar/{id}")
    public ResponseEntity<Producto> activarProducto(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.activarProducto(id));
    }
}

