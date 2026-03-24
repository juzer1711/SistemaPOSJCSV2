package com.sistemaposjcs.sistemaposjcs.service;

import com.sistemaposjcs.sistemaposjcs.model.Caja;
import com.sistemaposjcs.sistemaposjcs.model.Usuario;
import com.sistemaposjcs.sistemaposjcs.model.Enum.EstadoCaja;
import com.sistemaposjcs.sistemaposjcs.repository.CajaRepository;
import com.sistemaposjcs.sistemaposjcs.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CajaService {

    private final CajaRepository cajaRepository;
    private final UserRepository userRepository;

    public CajaService(CajaRepository cajaRepository,
                       UserRepository userRepository) {
        this.cajaRepository = cajaRepository;
        this.userRepository = userRepository;
    }

    // ✅ Obtener caja por ID
    public Caja getCajaById(Long id) {
        return cajaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Caja no encontrada"));
    }

    // ✅ Obtener caja por ID usuario
    public Caja obtenerCajaActivaPorUsuario(Long idUsuario) {

        return cajaRepository
            .findByEstadoCajaAndUsuarioIdUsuario(EstadoCaja.ABIERTA, idUsuario)
            .orElseThrow(() -> new RuntimeException("El usuario no tiene una caja abierta"));

    }

    // ✅ Listar todas las cajas
    public List<Caja> getAllCajas() {
        return cajaRepository.findAll();
    }

    // ✅ Listar cajas abiertas
    public List<Caja> getCajasAbiertas() {
        return cajaRepository.findByEstadoCaja(EstadoCaja.ABIERTA);
    }
    // ✅ Listar cajas cerradas
    public List<Caja> getCajasCerradas() {
        return cajaRepository.findByEstadoCaja(EstadoCaja.CERRADA);
    }

    // ✅ Abrir caja
    public Caja abrirCaja(Long idUsuario, BigDecimal montoInicial) {

        Usuario usuario = userRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar que el cajero no tenga otra caja abierta
        if (cajaRepository.existsByUsuarioIdUsuarioAndEstadoCaja(idUsuario, EstadoCaja.ABIERTA)) {
            throw new RuntimeException("El cajero ya tiene una caja abierta");
        }

        Caja caja = new Caja();
        caja.setUsuario(usuario);
        caja.setMontoInicial(montoInicial);
        caja.setEstadoCaja(EstadoCaja.ABIERTA);
        caja.setFechaApertura(LocalDateTime.now());

        return cajaRepository.save(caja);
    }

    // ✅ Cerrar caja
    @Transactional
    public Caja cerrarCaja(Long idCaja, BigDecimal montoFinal) {

        Caja caja = getCajaById(idCaja);

        if (caja.getEstadoCaja() == EstadoCaja.CERRADA) {
            throw new RuntimeException("La caja ya está cerrada");
        }

        caja.setFechaCierre(LocalDateTime.now());
        caja.setMontoFinal(montoFinal);
        caja.setEstadoCaja(EstadoCaja.CERRADA);

        return cajaRepository.save(caja);
    }

}
