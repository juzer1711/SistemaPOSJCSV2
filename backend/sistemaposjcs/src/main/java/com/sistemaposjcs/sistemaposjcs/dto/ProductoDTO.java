package com.sistemaposjcs.sistemaposjcs.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
public class ProductoDTO {
    private Long idProducto;
    private String nombre;
    private String categoria;
    private Double costo;
    private Double precioventa;
    private Boolean estado;
}
