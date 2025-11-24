package com.sistemaposjcs.sistemaposjcs.model;
/* 
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class ItemFactura {

    @Id
    private Long id;
    
    // Relación Mucho a Uno con la Factura (clave foránea a FACTURA_ID)
    @ManyToOne
    @JoinColumn(name = "id_venta") // Nombre de la columna FK en la DB
    private Venta venta;
    
    // Relación Mucho a Uno con el Producto (clave foránea a PRODUCTO_ID)
    // Es buena práctica usar un 'ManyToOne' y no solo guardar el ID
    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto producto;
    
    private int cantidad;
    
    // Guarda el precio en el momento de la venta (evita problemas si el precio del Producto cambia después)
    private BigDecimal precioVenta; 
}
*/