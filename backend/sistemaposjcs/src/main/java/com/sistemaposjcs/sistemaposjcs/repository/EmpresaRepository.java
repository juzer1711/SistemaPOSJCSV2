package com.sistemaposjcs.sistemaposjcs.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sistemaposjcs.sistemaposjcs.model.Empresa;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {

    Optional<Empresa> findByNit(String nit);

    boolean existsByNit(String nit);

    Optional<Empresa> findFirstByEstadoTrue();

}