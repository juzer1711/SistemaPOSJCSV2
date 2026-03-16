package com.sistemaposjcs.sistemaposjcs.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sistemaposjcs.sistemaposjcs.model.Caja;
import com.sistemaposjcs.sistemaposjcs.model.Enum.EstadoCaja;

public interface CajaRepository extends JpaRepository<Caja, Long> {

    List<Caja> findByEstadoCaja(EstadoCaja estadoCaja);

    List<Caja> findByUsuarioIdUsuario(Long idUsuario);

    Optional<Caja> findByEstadoCajaAndUsuarioIdUsuario(EstadoCaja estadoCaja, Long idUsuario);

    boolean existsByUsuarioIdUsuarioAndEstadoCaja(Long idUsuario, EstadoCaja estadoCaja);

}
