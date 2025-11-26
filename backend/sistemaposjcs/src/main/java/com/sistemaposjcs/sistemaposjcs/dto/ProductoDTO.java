package com.sistemaposjcs.sistemaposjcs.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

import com.sistemaposjcs.sistemaposjcs.model.Categoria;


@Getter @Setter @AllArgsConstructor
public class ProductoDTO {
    private Long idProducto;
    private String nombre;
    private Categoria categoria;
    private String codigoBarras;
    private String descripcion;
    private BigDecimal costo;
    private BigDecimal precio;
    private Boolean estado;
}
