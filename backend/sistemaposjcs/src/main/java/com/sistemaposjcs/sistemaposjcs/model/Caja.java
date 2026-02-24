package com.sistemaposjcs.sistemaposjcs.model;

import com.sistemaposjcs.sistemaposjcs.model.Enum.EstadoCaja;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cajas")
@NoArgsConstructor
public class Caja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_caja")
    private Long idCaja;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cajero", nullable = false)
    private Usuario usuario;

    @Column()
    private LocalDateTime fechaApertura = LocalDateTime.now();;
    @Column()
    private LocalDateTime fechaCierre = LocalDateTime.now();;
    @Column()
    private BigDecimal montoInicial;
    @Column()
    private BigDecimal totalVentas;
    @Column()
    private BigDecimal totalEfectivo;
    //private BigDecimal totalTarjeta;
    @Column()
    private BigDecimal totalTransferencia;
    @Column()
    private BigDecimal montoFinal;
    @Column()
    @Enumerated(EnumType.STRING)
    private EstadoCaja estadoCaja; // ABIERTA, CERRADA

    @PrePersist
    public void prePersist() {
        this.fechaApertura = LocalDateTime.now();
        this.fechaCierre = LocalDateTime.now();
    }
}
