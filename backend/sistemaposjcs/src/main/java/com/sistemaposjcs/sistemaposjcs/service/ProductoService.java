package com.sistemaposjcs.sistemaposjcs.service;

import com.sistemaposjcs.sistemaposjcs.model.Producto;
import com.sistemaposjcs.sistemaposjcs.model.EstadoProducto;
import com.sistemaposjcs.sistemaposjcs.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    // ✔ Listar todos los productos
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    // ✔ Obtener un producto por ID
    public Producto getProductoById(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    // ✔ Crear producto
    public Producto createProducto(Producto producto) {
        producto.setEstado(EstadoProducto.ACTIVO);
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

    // ✔ Desactivar producto 
    public void desactivarProducto(Long id) {
        Producto producto = getProductoById(id);
        producto.setEstado(EstadoProducto.INACTIVO);
        productoRepository.save(producto);
    }

    // ✔ Activar producto 
    public void activarProducto(Long id) {
        Producto producto = getProductoById(id);
        producto.setEstado(EstadoProducto.ACTIVO);
        productoRepository.save(producto);
    }
}
