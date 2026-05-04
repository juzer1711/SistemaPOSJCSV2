package com.sistemaposjcs.sistemaposjcs.service;

import com.sistemaposjcs.sistemaposjcs.model.*;
import com.sistemaposjcs.sistemaposjcs.repository.*;
import com.sistemaposjcs.sistemaposjcs.model.Enum.TipoMovimientoInventario;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class InventarioService {

    private final ProductoRepository productoRepository;
    private final MovimientoInventarioRepository movimientoRepository;
    private static final Logger log = LoggerFactory.getLogger(InventarioService.class);

    public InventarioService(
        ProductoRepository productoRepository,
        MovimientoInventarioRepository movimientoRepository
    ) {
        this.productoRepository = productoRepository;
        this.movimientoRepository = movimientoRepository;
    }

    @Transactional
    public void registrarEntrada(Long idProducto, int cantidad, String motivo) {

        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        if (cantidad <= 0) {
            throw new RuntimeException("La cantidad debe ser mayor a 0");
        }

        producto.setStockActual(producto.getStockActual() + cantidad);

        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setProducto(producto);
        movimiento.setCantidad(cantidad);
        movimiento.setTipo(TipoMovimientoInventario.ENTRADA);
        movimiento.setMotivo(motivo);

        movimientoRepository.save(movimiento);
        productoRepository.save(producto);
    }

    @Transactional
    public void registrarSalida(Long idProducto, int cantidad, String motivo) {

        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        if (cantidad <= 0) {
            throw new RuntimeException("La cantidad debe ser mayor a 0");
        }

        if (producto.getStockActual() < cantidad) {
            log.warn("Stock negativo permitido para producto: {}", producto.getNombre());
        }

        producto.setStockActual(producto.getStockActual() - cantidad);


        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setProducto(producto);
        movimiento.setCantidad(cantidad);
        movimiento.setTipo(TipoMovimientoInventario.SALIDA);
        movimiento.setMotivo(motivo);

        movimientoRepository.save(movimiento);
        productoRepository.save(producto);
    }

    @Transactional
    public void registrarVenta(Long idProducto, int cantidad, String motivo) {

        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (cantidad <= 0) {
            throw new RuntimeException("La cantidad debe ser mayor a 0");
        }

        if (producto.getStockActual() < cantidad) {
            log.warn("Stock negativo permitido para producto: {}", producto.getNombre());
        }

        producto.setStockActual(producto.getStockActual() - cantidad);

        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setProducto(producto);
        movimiento.setCantidad(cantidad);
        movimiento.setTipo(TipoMovimientoInventario.VENTA); // 🔥 AQUÍ ESTÁ LA CLAVE
        movimiento.setMotivo(motivo);

        movimientoRepository.save(movimiento);
        productoRepository.save(producto);
    }

    public Integer obtenerStock(Long idProducto) {
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        return producto.getStockActual();
    }

    public Page<MovimientoInventario> buscarMovimientos(
        Long idProducto,
        TipoMovimientoInventario tipo,
        LocalDateTime fechaInicio,
        LocalDateTime fechaFin,
        Pageable pageable
    ) {

        Specification<MovimientoInventario> spec = (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // 🔍 filtro por producto
            if (idProducto != null) {
                predicates.add(cb.equal(root.get("producto").get("idProducto"), idProducto));
            }

            // 🔍 filtro por tipo
            if (tipo != null) {
                predicates.add(cb.equal(root.get("tipo"), tipo));
            }

            // 🔍 rango fechas
            if (fechaInicio != null && fechaFin != null) {
                predicates.add(cb.between(root.get("fecha"), fechaInicio, fechaFin));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return movimientoRepository.findAll(spec, pageable);
    }

    public List<Producto> obtenerProductosBajoStock() {
        return productoRepository.findProductosBajoStock();
    }
}