package com.sistemaposjcs.sistemaposjcs.model;
/*
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;


@Entity
@Table(
    name = "ventas",
    uniqueConstraints = {
    @UniqueConstraint(name = "uk_codigo_barras", columnNames = "codigoBarras")
    }   
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_venta")
    private Long idVenta;

    // Almacena fecha y hora: ej. "2025-11-23T23:07:00"
    @Column(name = "fecha", nullable = false)
    private LocalDateTime fecha;

    @OneToMany(mappedBy = "factura", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemFactura> items = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @NotBlank(message = "El codigo de barras del producto es obligatorio")
    @Pattern(
        regexp = "^[0-9]{6,20}$",
        message = "El codigo de barras debe contener solo números (6 a 20 dígitos)"
    )
    @Column(nullable = false, unique = true)
    private String codigoBarras;

    @Size(max = 500, message = "La descripcion no debe exceder 500 caracteres")
    @Column(nullable = false)
    private String descripcion;


    @Positive(message = "El costo debe ser mayor que cero")
    @Column(nullable = false)
    private Double costo;

    @Positive(message = "El precio debe ser mayor que cero")
    @Column(nullable = false)
    private Double precioventa;

    private Boolean estado = true;

// Método de ayuda para añadir items
    public void addItem(ItemFactura item) {
        if (item != null) {
            if (items == null) {
                items = new ArrayList<>();
            }
            items.add(item);
            item.setVenta(this); // Importante para mantener la consistencia bidireccional
        }
}
}
*/