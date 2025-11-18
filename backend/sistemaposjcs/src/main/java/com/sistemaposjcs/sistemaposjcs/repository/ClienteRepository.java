package com.sistemaposjcs.sistemaposjcs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sistemaposjcs.sistemaposjcs.model.Cliente;
import java.util.List;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    List<Cliente> findByEstadoTrue();
}

