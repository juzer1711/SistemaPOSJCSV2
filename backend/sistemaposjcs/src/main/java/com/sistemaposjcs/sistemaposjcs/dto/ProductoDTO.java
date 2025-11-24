package com.sistemaposjcs.sistemaposjcs.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import com.sistemaposjcs.sistemaposjcs.model.Categoria;


@Getter @Setter @AllArgsConstructor
public class ProductoDTO {
    private Long idProducto;
    private String nombre;
    private Categoria categoria;
    private String codigoBarras;
    private String descripcion;
    private Double costo;
    private Double precioventa;
    private Boolean estado;
}
