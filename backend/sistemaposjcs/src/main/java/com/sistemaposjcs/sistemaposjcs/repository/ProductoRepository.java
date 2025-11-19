package com.sistemaposjcs.sistemaposjcs.repository;

import com.sistemaposjcs.sistemaposjcs.model.Producto;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByEstadoTrue();
    List<Producto> findByEstadoFalse();
}
