package com.sistemaposjcs.sistemaposjcs.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.sistemaposjcs.sistemaposjcs.model.Enum.MetodoPago;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "ventas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_venta")
    private Long idVenta;

    @Column(nullable = false)
    private LocalDateTime fecha = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MetodoPago metodoPago;

    @Column(nullable = false)
    private BigDecimal total = BigDecimal.ZERO;

    @Column(length = 500)
    private String observaciones;

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ItemFactura> items = new ArrayList<>();

    private Boolean estado = true;

    public void addItem(ItemFactura item) {
        item.setVenta(this);
        items.add(item);
        total = total.add(item.getSubtotal()); // Recalcula total
    }
    @PrePersist
    public void prePersist() {
        this.fecha = LocalDateTime.now();
    }
}

