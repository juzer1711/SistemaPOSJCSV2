package com.sistemaposjcs.sistemaposjcs.repository;

import com.sistemaposjcs.sistemaposjcs.model.Producto;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository

public interface ProductoRepository extends JpaRepository<Producto, Long>, JpaSpecificationExecutor<Producto> {
    Page<Producto> findByEstadoTrue(Pageable pageable);
    Page<Producto> findByEstadoFalse(Pageable pageable);
}
