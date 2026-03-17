package com.sistemaposjcs.sistemaposjcs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.sistemaposjcs.sistemaposjcs.model.Venta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VentaRepository extends JpaRepository<Venta, Long>, JpaSpecificationExecutor<Venta> {

    // ventas activas
    Page<Venta> findByEstadoTrue(Pageable pageable);
    // ventas inactivas
    Page<Venta> findByEstadoFalse(Pageable pageable);
}
