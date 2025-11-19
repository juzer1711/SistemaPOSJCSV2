package com.sistemaposjcs.sistemaposjcs.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(
    name = "productos"    
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Long idProducto;

    @NotBlank(message = "El nombre del producto es obligatorio")
    @Size(max = 100, message = "El nombre no debe exceder 100 caracteres")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "La categoria del producto es obligatoria")
    @Size(max = 100, message = "La categoria no debe exceder 100 caracteres")
    @Column(nullable = false)
    private String categoria;

    @Positive(message = "El costo debe ser mayor que cero")
    @Column(nullable = false)
    private Double costo;

    @Positive(message = "El precio debe ser mayor que cero")
    @Column(nullable = false)
    private Double precioventa;

    private Boolean estado = true;
}
