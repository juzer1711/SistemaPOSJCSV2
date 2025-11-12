package com.sistemaposjcs.sistemaposjcs.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.sistemaposjcs.sistemaposjcs.model.Usuario;

public interface UserRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);
    Optional<Usuario> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByDocumento(String documento);
}
