package com.sistemaposjcs.sistemaposjcs.service;

import com.sistemaposjcs.sistemaposjcs.model.Venta;
import com.sistemaposjcs.sistemaposjcs.model.Enum.MetodoPago;
import com.sistemaposjcs.sistemaposjcs.model.Cliente;
import com.sistemaposjcs.sistemaposjcs.model.ItemFactura;
import com.sistemaposjcs.sistemaposjcs.model.Producto;
import com.sistemaposjcs.sistemaposjcs.model.Caja;
import com.sistemaposjcs.sistemaposjcs.model.Usuario;
import com.sistemaposjcs.sistemaposjcs.model.Enum.EstadoCaja;
import com.sistemaposjcs.sistemaposjcs.repository.VentaRepository;
import com.sistemaposjcs.sistemaposjcs.repository.ClienteRepository;
import com.sistemaposjcs.sistemaposjcs.repository.ProductoRepository;
import com.sistemaposjcs.sistemaposjcs.repository.CajaRepository;
import com.sistemaposjcs.sistemaposjcs.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import java.util.List;
import jakarta.persistence.criteria.Predicate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;

@Service
public class VentaService {
    private final VentaRepository ventaRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;
    private final CajaRepository cajaRepository;
    private final UserRepository userRepository;


    public VentaService(VentaRepository ventaRepository, ClienteRepository clienteRepository, ProductoRepository productoRepository, CajaRepository cajaRepository, UserRepository userRepository) {
        this.ventaRepository = ventaRepository;
        this.clienteRepository = clienteRepository;
        this.productoRepository = productoRepository;
        this.cajaRepository = cajaRepository;
        this.userRepository = userRepository;
    }
    
    // ✅ Obtener venta por ID
    public Venta getVentaById(Long id) {
        return ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada"));
    }

    public Page<Venta> getActiveVentas(Pageable pageable){
        return ventaRepository.findByEstadoTrue(pageable);
    }

    public Page<Venta> getInactiveVentas(Pageable pageable){
        return ventaRepository.findByEstadoFalse(pageable);
    }

// Crear Venta
public Venta createVenta(Venta venta) {

    // Validar cliente real
    Cliente clienteReal = clienteRepository.findById(
            venta.getCliente().getIdCliente()
    ).orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

    venta.setCliente(clienteReal);

    // 🔥 Obtener usuario real
    Usuario usuario = userRepository.findById(
            venta.getUsuario().getIdUsuario()
    ).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    venta.setUsuario(usuario);

    // 🔥 Buscar caja abierta del usuario
    Caja caja = cajaRepository
            .findByEstadoCajaAndUsuarioIdUsuario(EstadoCaja.ABIERTA, usuario.getIdUsuario())
            .orElseThrow(() -> new RuntimeException("El usuario no tiene caja abierta"));

    venta.setCaja(caja);

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
        totalSinIVA = totalSinIVA.add(
        precioSinIVA.multiply(BigDecimal.valueOf(item.getCantidad()))
);

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

    // 🔥 Actualizar totales de la caja
    caja.setTotalVentas(
            caja.getTotalVentas().add(totalVenta)
    );

    if (venta.getMetodoPago() == MetodoPago.EFECTIVO) {

        caja.setTotalEfectivo(
                caja.getTotalEfectivo().add(totalVenta)
        );

    } else if (venta.getMetodoPago() == MetodoPago.TRANSFERENCIA) {

        caja.setTotalTransferencia(
                caja.getTotalTransferencia().add(totalVenta)
        );
    }
    return ventaRepository.save(venta);
}



// ✅ Actualizar venta
@Transactional
public Venta updateVenta(Long id, Venta ventaDetails) {

    // Obtener venta real
    Venta venta = getVentaById(id);

    BigDecimal totalAnterior = venta.getTotal();
    MetodoPago metodoAnterior = venta.getMetodoPago();

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

    Caja caja = venta.getCaja();

    // restar total anterior
    caja.setTotalVentas(
        caja.getTotalVentas().subtract(totalAnterior)
    );

    caja.setTotalVentas(
        caja.getTotalVentas().add(total)
    );
    if (metodoAnterior == MetodoPago.EFECTIVO) {
        caja.setTotalEfectivo(
            caja.getTotalEfectivo().subtract(totalAnterior)
        );
    }

    if (metodoAnterior == MetodoPago.TRANSFERENCIA) {
        caja.setTotalTransferencia(
            caja.getTotalTransferencia().subtract(totalAnterior)
        );
    }
    if (venta.getMetodoPago() == MetodoPago.EFECTIVO) {
    caja.setTotalEfectivo(
        caja.getTotalEfectivo().add(total)
    );
}

    if (venta.getMetodoPago() == MetodoPago.TRANSFERENCIA) {
        caja.setTotalTransferencia(
            caja.getTotalTransferencia().add(total)
        );
    }
    return ventaRepository.save(venta);
}

@Transactional
public void desactivarVenta(Long id) {

    Venta v = ventaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Venta no encontrada"));

    if (!v.getEstado()) {
        throw new RuntimeException("La venta ya está desactivada");
    }

    Caja caja = v.getCaja();

    BigDecimal total = v.getTotal();

    caja.setTotalVentas(
            caja.getTotalVentas().subtract(total)
    );

    if (v.getMetodoPago() == MetodoPago.EFECTIVO) {

        caja.setTotalEfectivo(
                caja.getTotalEfectivo().subtract(total)
        );

    } else if (v.getMetodoPago() == MetodoPago.TRANSFERENCIA) {

        caja.setTotalTransferencia(
                caja.getTotalTransferencia().subtract(total)
        );
    }

    v.setEstado(false);

    ventaRepository.save(v);
}

@Transactional
public Venta activarVenta(Long id) {

    Venta v = ventaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Venta no encontrada"));

    if (v.getEstado()) {
        throw new RuntimeException("La venta ya está activa");
    }

    Caja caja = v.getCaja();
    BigDecimal total = v.getTotal();

    caja.setTotalVentas(
            caja.getTotalVentas().add(total)
    );

    if (v.getMetodoPago() == MetodoPago.EFECTIVO) {

        caja.setTotalEfectivo(
                caja.getTotalEfectivo().add(total)
        );

    } else if (v.getMetodoPago() == MetodoPago.TRANSFERENCIA) {

        caja.setTotalTransferencia(
                caja.getTotalTransferencia().add(total)
        );
    }

    v.setEstado(true);

    return ventaRepository.save(v);
}

public Page<Venta> searchVentas(
    Pageable pageable,
    String search,
    String metodoPago,
    Boolean estado,
    LocalDate fechaInicio,
    LocalDate fechaFin
) {
    Specification<Venta> spec = buildSpec(search, metodoPago, estado, fechaInicio, fechaFin);
    return ventaRepository.findAll(spec, pageable);
}

public Specification<Venta> buildSpec(
    String search,
    String metodoPago,
    Boolean estado,
    LocalDate fechaInicio,
    LocalDate fechaFin
) {
    return (root, query, cb) -> {

        List<Predicate> predicates = new ArrayList<>();

        // 🔍 búsqueda global
        if (search != null && !search.isEmpty()) {
            predicates.add(cb.or(
                cb.like(cb.lower(root.get("nombreCliente")), "%" + search.toLowerCase() + "%"),
                cb.like(root.get("documentoCliente"), "%" + search + "%")
            ));
        }

        // 💳 método pago
        if (metodoPago != null && !metodoPago.isEmpty()) {
            predicates.add(cb.equal(root.get("metodoPago"), metodoPago));
        }

        // 🟢 estado
        if (estado != null) {
            predicates.add(cb.equal(root.get("estado"), estado));
        }

        // 📅 fechas
        if (fechaInicio != null && fechaFin != null) {
            predicates.add(cb.between(
                root.get("fecha"),
                fechaInicio.atStartOfDay(),
                fechaFin.atTime(23, 59)
            ));
        }

        return cb.and(predicates.toArray(new Predicate[0]));
    };
}
 
}