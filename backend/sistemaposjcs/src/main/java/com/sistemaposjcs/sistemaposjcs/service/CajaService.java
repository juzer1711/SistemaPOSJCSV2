package com.sistemaposjcs.sistemaposjcs.service;

import com.sistemaposjcs.sistemaposjcs.model.Caja;
import com.sistemaposjcs.sistemaposjcs.model.Usuario;
import com.sistemaposjcs.sistemaposjcs.model.Venta;
import com.sistemaposjcs.sistemaposjcs.model.Enum.EstadoCaja;
import com.sistemaposjcs.sistemaposjcs.model.Enum.MetodoPago;
import com.sistemaposjcs.sistemaposjcs.repository.CajaRepository;
import com.sistemaposjcs.sistemaposjcs.repository.UserRepository;
import com.sistemaposjcs.sistemaposjcs.repository.VentaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import java.util.List;
import jakarta.persistence.criteria.Predicate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
public class CajaService {

    private final CajaRepository cajaRepository;
    private final UserRepository userRepository;
    private final VentaRepository ventaRepository;

    public CajaService(CajaRepository cajaRepository,
                       UserRepository userRepository,
                    VentaRepository ventaRepository) {
        this.cajaRepository = cajaRepository;
        this.userRepository = userRepository;
        this.ventaRepository = ventaRepository;
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

    // ✅ Listar cajas abiertas
    public Page<Caja> getCajasAbiertas(Pageable pageable) {
        return cajaRepository.findByEstadoCaja(pageable, EstadoCaja.ABIERTA);
    }
    // ✅ Listar cajas cerradas
    public Page<Caja> getCajasCerradas(Pageable pageable) {
        return cajaRepository.findByEstadoCaja(pageable, EstadoCaja.CERRADA);
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
    public Caja cerrarCaja(Long idUsuario, BigDecimal efectivoReal, BigDecimal transferenciaReal) {

        Caja caja = cajaRepository
            .findByEstadoCajaAndUsuarioIdUsuario(EstadoCaja.ABIERTA, idUsuario)
            .orElseThrow(() -> new RuntimeException("No hay caja abierta"));

        if (caja.getEstadoCaja() == EstadoCaja.CERRADA) {
            throw new RuntimeException("La caja ya está cerrada");
        }

        // 🔥 Calcular diferencias
        BigDecimal diferenciaEfectivo = efectivoReal.subtract(caja.getTotalEfectivo());
        BigDecimal diferenciaTransferencia = transferenciaReal.subtract(caja.getTotalTransferencia());

        // Guardar datos reales
        caja.setEfectivoReal(efectivoReal);
        caja.setTransferenciaReal(transferenciaReal);
        caja.setDiferenciaEfectivo(diferenciaEfectivo);
        caja.setDiferenciaTransferencia(diferenciaTransferencia);

        // Total final real
        BigDecimal montoFinal = efectivoReal.add(transferenciaReal);

        caja.setMontoFinal(montoFinal);
        caja.setFechaCierre(LocalDateTime.now());
        caja.setEstadoCaja(EstadoCaja.CERRADA);

        return cajaRepository.save(caja);
    }

        public Page<Caja> searchCajas(
        Pageable pageable,
        String search,
        LocalDate fechaApertura,
        LocalDate fechaCierre,
        EstadoCaja estado
    ) {
        Specification<Caja> spec = buildSpec(search, fechaApertura, fechaCierre, estado);
        return cajaRepository.findAll(spec, pageable);
    }

    public Specification<Caja> buildSpec(
        String search,
        LocalDate fechaApertura,
        LocalDate fechaCierre,
        EstadoCaja estado
    ) {
        return (root, query, cb) -> {
                List<Predicate> predicates = new ArrayList<>();

                // 🔍 búsqueda global (nombre o email)
                if (search != null && !search.isEmpty()) {
                    String searchLower = "%" + search.toLowerCase() + "%";

                    Join<Caja, Usuario> usuario = root.join("usuario"); 

                    Expression<String> nombreCompletoUsuario = cb.concat(cb.lower(usuario.get("primerNombre")), " ");
                    nombreCompletoUsuario = cb.concat(nombreCompletoUsuario, cb.lower(cb.coalesce(usuario.get("segundoNombre"), "")));
                    nombreCompletoUsuario = cb.concat(nombreCompletoUsuario, " ");
                    nombreCompletoUsuario = cb.concat(nombreCompletoUsuario, cb.lower(usuario.get("primerApellido")));
                    nombreCompletoUsuario = cb.concat(nombreCompletoUsuario, " ");
                    nombreCompletoUsuario = cb.concat(nombreCompletoUsuario, cb.lower(usuario.get("segundoApellido")));
                        predicates.add(cb.or(
                            cb.like(nombreCompletoUsuario, searchLower)
                        ));
                    }
            
            if (estado != null) {
                    predicates.add(cb.equal(root.get("estadoCaja"), estado));
                }

            // 📅 fechas
            if (fechaApertura != null && fechaCierre != null) {
                predicates.add(cb.between(
                    root.get("fecha"),
                    fechaApertura.atStartOfDay(),
                    fechaCierre.atTime(23, 59)
                ));
            }
            // Si solo viene la de apertura, buscamos de ahí en adelante
            else if (fechaApertura != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("fechaApertura"), fechaApertura.atStartOfDay()));
            }
            // Si solo viene la de cierre, buscamos hasta ese día
            else if (fechaCierre != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("fechaApertura"), fechaCierre.atTime(23, 59, 59)));
            }

                return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Transactional
public void cerrarCajaForzadoAdmin(Long idCaja) {

    Caja caja = cajaRepository.findById(idCaja)
            .orElseThrow(() -> new RuntimeException("Caja no encontrada"));

    if (!caja.getEstadoCaja().equals(EstadoCaja.ABIERTA)) {
        throw new RuntimeException("La caja ya está cerrada");
    }

    // 🔥 1. Traer todas las ventas de esa caja
    List<Venta> ventas = ventaRepository.findByCajaIdCaja(idCaja);

    BigDecimal totalVentas = BigDecimal.ZERO;
    BigDecimal totalEfectivo = BigDecimal.ZERO;
    BigDecimal totalTransferencia = BigDecimal.ZERO;

   for (Venta v : ventas) {
    // totalVentas = totalVentas + v.getTotal()
    totalVentas = totalVentas.add(v.getTotal());

    if (v.getMetodoPago().equals(MetodoPago.EFECTIVO)) {
        totalEfectivo = totalEfectivo.add(v.getTotal());
    } else {
        totalTransferencia = totalTransferencia.add(v.getTotal());
    }
}


    // 🔥 2. Llenar datos de cierre AUTOMÁTICOS
    caja.setFechaCierre(LocalDateTime.now());
    caja.setTotalVentas(totalVentas);
    caja.setTotalEfectivo(totalEfectivo);
    caja.setTotalTransferencia(totalTransferencia);

    // ⚠️ No hay conteo real, entonces son iguales
    caja.setEfectivoReal(totalEfectivo);
    caja.setTransferenciaReal(totalTransferencia);

    caja.setEstadoCaja(EstadoCaja.CERRADA);

    cajaRepository.save(caja);
}


}
