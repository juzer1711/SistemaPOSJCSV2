package com.sistemaposjcs.sistemaposjcs.service;

import com.sistemaposjcs.sistemaposjcs.dto.MovimientoCajaDTO;
import com.sistemaposjcs.sistemaposjcs.model.*;
import com.sistemaposjcs.sistemaposjcs.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovimientoCajaService {

    private final MovimientoCajaRepository movimientoRepo;
    private final CajaRepository cajaRepo;
    private final UserRepository usuarioRepo;

    @Transactional
    public MovimientoCajaDTO registrarMovimiento(MovimientoCajaDTO dto) {

        Caja caja = cajaRepo.findById(dto.getIdCaja())
                .orElseThrow(() -> new RuntimeException("Caja no encontrada"));

        if (!caja.getEstadoCaja().name().equals("ABIERTA")) {
            throw new RuntimeException("La caja no está abierta");
        }

        Usuario usuario = usuarioRepo.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        MovimientoCaja mov = new MovimientoCaja();
        mov.setCaja(caja);
        mov.setUsuario(usuario);
        mov.setTipo(dto.getTipo());
        mov.setMonto(dto.getMonto());
        mov.setMotivo(dto.getMotivo());

        // 🔥 Lógica contable real
        BigDecimal montoFinal = caja.getMontoFinal();

        if (dto.getTipo().name().equals("ENTRADA")) {
            caja.setMontoFinal(montoFinal.add(dto.getMonto()));
        } else {
            caja.setMontoFinal(montoFinal.subtract(dto.getMonto()));
        }

        cajaRepo.save(caja);
        movimientoRepo.save(mov);

        return toDTO(mov);
    }

    public List<MovimientoCajaDTO> listarPorCaja(Long idCaja){
        return movimientoRepo.findByCaja_IdCajaOrderByFechaDesc(idCaja)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private MovimientoCajaDTO toDTO(MovimientoCaja m){
        return MovimientoCajaDTO.builder()
                .idMovimiento(m.getIdMovimiento())
                .idCaja(m.getCaja().getIdCaja())
                .idUsuario(m.getUsuario().getIdUsuario())
                .tipo(m.getTipo())
                .monto(m.getMonto())
                .motivo(m.getMotivo())
                .fecha(m.getFecha())
                .build();
    }
}