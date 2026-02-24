package com.sistemaposjcs.sistemaposjcs.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.sistemaposjcs.sistemaposjcs.model.Usuario;
import com.sistemaposjcs.sistemaposjcs.model.Enum.EstadoCaja;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
public class CajaDTO {
    private Long idCaja;
    private Usuario usuario;
    private LocalDateTime fechaApertura;
    private LocalDateTime fechaCierre;
    private BigDecimal montoInicial;
    private BigDecimal totalVentas;
    private BigDecimal totalEfectivo;
    private BigDecimal totalTransferencia;
    private BigDecimal montoFinal;
    private EstadoCaja estadoCaja;
}