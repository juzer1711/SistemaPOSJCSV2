package com.sistemaposjcs.sistemaposjcs.service;

import com.sistemaposjcs.sistemaposjcs.model.Producto;
import com.sistemaposjcs.sistemaposjcs.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    // ✔ Obtener un producto por ID
    public Producto getProductoById(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    // ✅ Listar todos los usuarios inactivos
    public List<Producto> getInactiveProductos() {
        return productoRepository.findByEstadoFalse();
    }

    public List<Producto> getActiveProductos() {
        return productoRepository.findByEstadoTrue();
    }


    // ✔ Crear producto
    public Producto createProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    // ✔ Actualizar producto
    public Producto updateProducto(Long id, Producto detalles) {
        Producto producto = getProductoById(id);

        producto.setNombre(detalles.getNombre());
        producto.setCategoria(detalles.getCategoria());
        producto.setPrecioventa(detalles.getPrecioventa());
        producto.setCosto(detalles.getCosto());

        return productoRepository.save(producto);
    }

    public void desactivarProducto(Long id) {
        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        p.setEstado(false);    // 🔥 Inactiva
        productoRepository.save(p);
    }

    public Producto activarProducto(Long id) {
    Producto p = productoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

    p.setEstado(true);     // 🔥 Activa
    return productoRepository.save(p);
    }
}
