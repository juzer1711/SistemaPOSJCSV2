package com.sistemaposjcs.sistemaposjcs.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.sistemaposjcs.sistemaposjcs.model.Usuario;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserRepository extends JpaRepository<Usuario, Long>, JpaSpecificationExecutor<Usuario> {
    Optional<Usuario> findByUsername(String username);
    Optional<Usuario> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByDocumento(String documento);
    Page<Usuario> findByEstadoTrue(Pageable pageable);
    Page<Usuario> findByEstadoFalse(Pageable pageable);
}
