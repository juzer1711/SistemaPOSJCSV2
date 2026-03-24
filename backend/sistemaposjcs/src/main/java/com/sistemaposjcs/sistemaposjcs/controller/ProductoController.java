package com.sistemaposjcs.sistemaposjcs.controller;

import com.sistemaposjcs.sistemaposjcs.dto.ProductoDTO;
import com.sistemaposjcs.sistemaposjcs.model.Producto;
import com.sistemaposjcs.sistemaposjcs.service.ProductoService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
    public Page<ProductoDTO> getActiveProductos(Pageable pageable) {
        return productoService.getActiveProductos(pageable)
            .map(p -> new ProductoDTO(
                p.getIdProducto(),
                p.getNombre(),
                p.getCategoria(),
                p.getCodigoBarras(),
                p.getDescripcion(),
                p.getCosto(),
                p.getPrecioventa(),
                p.getIva(),
                p.getPrecioSinIva(),
                p.getEstado()
            ));
    }

    @GetMapping("/inactivos")
    public Page<ProductoDTO> getInactiveProductos(Pageable pageable) {
        return productoService.getInactiveProductos(pageable)
            .map(p -> new ProductoDTO(
                p.getIdProducto(),
                p.getNombre(),
                p.getCategoria(),
                p.getCodigoBarras(),
                p.getDescripcion(),
                p.getCosto(),
                p.getPrecioventa(),
                p.getIva(),
                p.getPrecioSinIva(),
                p.getEstado()
            ));
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

    @GetMapping("/search")
    public Page<ProductoDTO> searchProductos(
        Pageable pageable,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Long categoria,
        @RequestParam(required = false) Boolean estado
    ) {
        return productoService.searchProductos(
            pageable, search, categoria, estado
        ).map(p -> new ProductoDTO(
            p.getIdProducto(),
            p.getNombre(),
            p.getCategoria(),
            p.getCodigoBarras(),
            p.getDescripcion(),
            p.getCosto(),
            p.getPrecioventa(),
            p.getIva(),
            p.getPrecioSinIva(),
            p.getEstado()
        ));
    }
}

