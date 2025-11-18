package com.sistemaposjcs.sistemaposjcs.controller;

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

    //  Crear producto
    @PostMapping
    public ResponseEntity<Producto> createProducto(@Valid @RequestBody Producto producto) {
        return ResponseEntity.ok(productoService.createProducto(producto));
    }

    //  Obtener todos los productos
    @GetMapping
    public ResponseEntity<List<Producto>> getAllProductos() {
        return ResponseEntity.ok(productoService.getAllProductos());
    }

    //  Obtener producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.getProductoById(id));
    }

    //  Actualizar producto
    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(
            @PathVariable Long id,
            @Valid @RequestBody Producto producto
    ) {
        return ResponseEntity.ok(productoService.updateProducto(id, producto));
    }

    //  Desactivar producto (eliminación lógica)
    @PutMapping("/desactivar/{id}")
    public ResponseEntity<String> desactivarProducto(@PathVariable Long id) {
        productoService.desactivarProducto(id);
        return ResponseEntity.ok("Producto desactivado correctamente");
    }

    //  Activar producto
    @PutMapping("/activar/{id}")
    public ResponseEntity<String> activarProducto(@PathVariable Long id) {
        productoService.activarProducto(id);
        return ResponseEntity.ok("Producto activado correctamente");
    }
}

