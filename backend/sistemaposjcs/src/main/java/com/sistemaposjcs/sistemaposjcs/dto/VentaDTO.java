package com.sistemaposjcs.sistemaposjcs.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.sistemaposjcs.sistemaposjcs.model.Enum.MetodoPago;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Getter @Setter @AllArgsConstructor
public class VentaDTO {
    private Long idVenta;
    private LocalDateTime fecha;
    private Long idCliente;
    private String nombreCliente;
    private String documentoCliente;
    private MetodoPago metodoPago;
    private BigDecimal total;
    private String observaciones;
    private Boolean estado;
    private List<ItemFacturaDTO> items;
}
