package com.sistemaposjcs.sistemaposjcs.service;

import com.sistemaposjcs.sistemaposjcs.model.Venta;
import com.sistemaposjcs.sistemaposjcs.model.Enum.MetodoPago;
import com.sistemaposjcs.sistemaposjcs.model.Cliente;
import com.sistemaposjcs.sistemaposjcs.model.ItemFactura;
import com.sistemaposjcs.sistemaposjcs.model.Producto;
import com.sistemaposjcs.sistemaposjcs.repository.VentaRepository;
import com.sistemaposjcs.sistemaposjcs.repository.ClienteRepository;
import com.sistemaposjcs.sistemaposjcs.repository.ProductoRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class VentaService {
    private final VentaRepository ventaRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;


    public VentaService(VentaRepository ventaRepository, ClienteRepository clienteRepository, ProductoRepository productoRepository) {
        this.ventaRepository = ventaRepository;
        this.clienteRepository = clienteRepository;
        this.productoRepository = productoRepository;
    }
    
    // ✅ Obtener venta por ID
    public Venta getVentaById(Long id) {
        return ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada"));
    }

    // ✅ Listar todos los usuarios
    public List<Venta> getInactiveVentas() {
        return ventaRepository.findByEstadoFalse();
    }

    
    public List<Venta> getActiveVentas() {
    return ventaRepository.findByEstadoTrue();
    }

// Crear Venta
public Venta createVenta(Venta venta) {

    // Validar cliente real
    Cliente clienteReal = clienteRepository.findById(
            venta.getCliente().getIdCliente()
    ).orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

    venta.setCliente(clienteReal);

    if (venta.getItems() == null || venta.getItems().isEmpty()) {
        throw new RuntimeException("La venta debe contener al menos un item");
    }

    BigDecimal totalVenta = BigDecimal.ZERO;
    BigDecimal totalIVA = BigDecimal.ZERO;
    BigDecimal totalSinIVA = BigDecimal.ZERO;

    for (ItemFactura item : venta.getItems()) {

        // Buscar producto real
        Producto producto = productoRepository.findById(
                item.getProducto().getIdProducto()
        ).orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Precio final (incluye IVA)
        BigDecimal precioFinal = producto.getPrecioventa();
        item.setPrecioUnitario(precioFinal);

        // Precio sin IVA
        BigDecimal precioSinIVA = producto.getPrecioSinIva();

        // IVA unitario = (precioConIVA - precioSinIVA)
        BigDecimal ivaUnitario = precioFinal.subtract(precioSinIVA);

        // Subtotal final (con IVA)
        BigDecimal subtotal = precioFinal.multiply(BigDecimal.valueOf(item.getCantidad()));
        item.setSubtotal(subtotal);

        // IVA total de este Item
        BigDecimal valorIVA = ivaUnitario.multiply(BigDecimal.valueOf(item.getCantidad()));
        item.setValorIVA(valorIVA);

        // Guardar el porcentaje de IVA
        item.setIvaPorcentaje(producto.getIva().getValue());

        // Acumular
        totalIVA = totalIVA.add(valorIVA);
        totalVenta = totalVenta.add(subtotal);
        totalSinIVA = totalSinIVA.add(precioSinIVA);

        // Enlazar entidades
        item.setVenta(venta);
        item.setProducto(producto);
    }
    venta.setTotalIVA(totalIVA);
    venta.setTotal(totalVenta);
    venta.setTotalSinIVA(totalSinIVA);

    if (venta.getMetodoPago() == MetodoPago.EFECTIVO) {
        if (venta.getMontoRecibido() == null) {
            throw new RuntimeException("Debe enviar el monto recibido para pagos en efectivo.");
        }
        if (venta.getMontoRecibido().compareTo(totalVenta) < 0) {
            throw new RuntimeException("El monto recibido es insuficiente.");
        }
        venta.setCambio(venta.getMontoRecibido().subtract(totalVenta));
    }
    return ventaRepository.save(venta);
}



// ✅ Actualizar venta
@Transactional
public Venta updateVenta(Long id, Venta ventaDetails) {

    // Obtener venta real
    Venta venta = getVentaById(id);

    // 🔥 Actualizar cliente si cambia
    if (ventaDetails.getCliente() != null && ventaDetails.getCliente().getIdCliente() != null) {
        Cliente nuevoCliente = clienteRepository.findById(ventaDetails.getCliente().getIdCliente())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        venta.setCliente(nuevoCliente);
    }

    // 🔥 Actualizar datos básicos
    venta.setMetodoPago(ventaDetails.getMetodoPago());
    venta.setObservaciones(ventaDetails.getObservaciones());

    // 🔥 Manejar items
    venta.getItems().clear();  // Eliminar los items anteriores

    BigDecimal total = BigDecimal.ZERO;

    for (ItemFactura itemDetails : ventaDetails.getItems()) {

        // 🔥 Validar producto real
        Producto producto = productoRepository.findById(itemDetails.getProducto().getIdProducto())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        ItemFactura nuevoItem = new ItemFactura();

        nuevoItem.setProducto(producto);
        nuevoItem.setCantidad(itemDetails.getCantidad());
        nuevoItem.setPrecioUnitario(producto.getPrecioventa());

        BigDecimal subtotal = producto.getPrecioventa()
                .multiply(BigDecimal.valueOf(itemDetails.getCantidad()));

        nuevoItem.setSubtotal(subtotal);

        // 🔥 Relación inversa
        nuevoItem.setVenta(venta);

        // Agregar item a la venta
        venta.getItems().add(nuevoItem);

        // Sumar al total
        total = total.add(subtotal);
    }

    // 🔥 Actualizar total final
    venta.setTotal(total);

    return ventaRepository.save(venta);
}




    public void desactivarVenta(Long id) {
        Venta v = ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada"));

        v.setEstado(false);    // 🔥 Inactiva
        ventaRepository.save(v);
    }

    public Venta activarVenta(Long id) {
    Venta v = ventaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Venta no encontrada"));

    v.setEstado(true);     // 🔥 Activa
    return ventaRepository.save(v);
}
 
}