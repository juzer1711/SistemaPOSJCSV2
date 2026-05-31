package com.sistemaposjcs.sistemaposjcs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.sistemaposjcs.sistemaposjcs.model.Venta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VentaRepository extends JpaRepository<Venta, Long>, JpaSpecificationExecutor<Venta> {

    // ventas activas
    Page<Venta> findByEstadoTrue(Pageable pageable);
    // ventas inactivas
    Page<Venta> findByEstadoFalse(Pageable pageable);

    List<Venta> findByCajaIdCaja(Long idCaja);

    @Query("""
        SELECT v.metodoPago, COALESCE(SUM(v.total), 0)
        FROM Venta v
        WHERE v.estado = true
        GROUP BY v.metodoPago
    """)
    List<Object[]> obtenerVentasPorMetodoPago();

    long countByEstadoTrue();

    long countByEstadoTrueAndFechaBetween(
            java.time.LocalDateTime inicio,
            java.time.LocalDateTime fin
    );

    @org.springframework.data.jpa.repository.Query("""
        SELECT COALESCE(SUM(v.total),0)
        FROM Venta v
        WHERE v.estado = true
    """)
    java.math.BigDecimal sumTotalVentas();

    @org.springframework.data.jpa.repository.Query("""
        SELECT COALESCE(SUM(v.totalIVA),0)
        FROM Venta v
        WHERE v.estado = true
    """)
    java.math.BigDecimal sumTotalIVA();

    @Query("""
        SELECT
            i.producto.nombre,
            SUM(i.cantidad)
        FROM ItemFactura i
        GROUP BY i.producto.nombre
        ORDER BY SUM(i.cantidad) DESC
    """)
    List<Object[]> obtenerTopProductosVendidos();

    @Query("""
        SELECT
            CONCAT(u.primerNombre, ' ', u.primerApellido),
            COALESCE(SUM(v.total),0)
        FROM Venta v
        JOIN v.usuario u
        WHERE v.estado = true
        GROUP BY
            u.idUsuario,
            u.primerNombre,
            u.primerApellido
        ORDER BY COALESCE(SUM(v.total),0) DESC
    """)
    List<Object[]> obtenerVentasPorCajero();

}
