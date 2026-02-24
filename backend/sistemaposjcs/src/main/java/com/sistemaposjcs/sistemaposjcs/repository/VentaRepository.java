package com.sistemaposjcs.sistemaposjcs.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.sistemaposjcs.sistemaposjcs.model.Venta;

public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByEstadoTrue();
    List<Venta> findByEstadoFalse();
}
