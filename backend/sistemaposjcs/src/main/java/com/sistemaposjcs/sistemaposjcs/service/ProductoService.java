package com.sistemaposjcs.sistemaposjcs.service;

import com.sistemaposjcs.sistemaposjcs.model.Producto;
import com.sistemaposjcs.sistemaposjcs.model.Categoria;
import com.sistemaposjcs.sistemaposjcs.repository.CategoriaRepository;
import com.sistemaposjcs.sistemaposjcs.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ProductoService {
    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository, CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
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
        // Obtener valor numérico del IVA
        BigDecimal ivaValue = producto.getIva().getValue();

        // precio sin IVA = precioFinal / (1 + iva)
        BigDecimal divisor = BigDecimal.ONE.add(ivaValue);
        BigDecimal precioSinIva = producto.getPrecioventa().divide(divisor, 2, RoundingMode.HALF_UP);

        producto.setPrecioSinIva(precioSinIva);
        // 🔥 Reemplazar categoria recibida con la REAL de la BD
        if (producto.getCategoria() != null && producto.getCategoria().getId() != null) {
            Categoria categoriaReal = categoriaRepository.findById(producto.getCategoria().getId())
                    .orElseThrow(() -> new RuntimeException("Categoria no encontrado"));
            producto.setCategoria(categoriaReal);
        }

        return productoRepository.save(producto);
    }

    // ✔ Actualizar producto
    public Producto updateProducto(Long id, Producto productoDetails) {
        Producto producto = getProductoById(id);

        producto.setNombre(productoDetails.getNombre());
        producto.setCodigoBarras(productoDetails.getCodigoBarras());
        producto.setDescripcion(productoDetails.getDescripcion());
        producto.setCosto(productoDetails.getCosto());
        producto.setPrecioventa(productoDetails.getPrecioventa());
        producto.setIva(productoDetails.getIva());

        // recalcular precio sin IVA
        BigDecimal ivaValue = producto.getIva().getValue();
        BigDecimal divisor = BigDecimal.ONE.add(ivaValue);
        BigDecimal precioSinIva = producto.getPrecioventa().divide(divisor, 2, RoundingMode.HALF_UP);

        producto.setPrecioSinIva(precioSinIva);

        // 🔥 Si viene una categoria en el JSON, la asignamos correctamente
        if (productoDetails.getCategoria() != null && productoDetails.getCategoria().getId() != null) {
            Categoria nuevaCategoria = categoriaRepository.findById(productoDetails.getCategoria().getId())
                    .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));
            producto.setCategoria(nuevaCategoria);
        }

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
