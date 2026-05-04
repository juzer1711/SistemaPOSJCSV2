package com.sistemaposjcs.sistemaposjcs.repository;

import com.sistemaposjcs.sistemaposjcs.model.MovimientoInventario;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MovimientoInventarioRepository
    extends JpaRepository<MovimientoInventario, Long>, JpaSpecificationExecutor<MovimientoInventario> {
}