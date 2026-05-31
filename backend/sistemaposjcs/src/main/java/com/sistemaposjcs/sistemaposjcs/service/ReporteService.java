package com.sistemaposjcs.sistemaposjcs.service;

import org.springframework.stereotype.Service;

import com.sistemaposjcs.sistemaposjcs.dto.ReporteResumenDTO;
import com.sistemaposjcs.sistemaposjcs.repository.VentaRepository;
import com.sistemaposjcs.sistemaposjcs.dto.ReporteCajeroDTO;
import com.sistemaposjcs.sistemaposjcs.dto.ReporteMetodoPagoDTO;
import com.sistemaposjcs.sistemaposjcs.dto.ReporteProductoDTO;
import com.sistemaposjcs.sistemaposjcs.dto.ReporteStockBajoDTO;
import com.sistemaposjcs.sistemaposjcs.model.Producto;
import com.sistemaposjcs.sistemaposjcs.repository.ProductoRepository;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Service
public class ReporteService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;

    public ReporteService(
            VentaRepository ventaRepository,
            ProductoRepository productoRepository
    ) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
    }

    public ReporteResumenDTO obtenerResumen() {

        

        LocalDate hoy = LocalDate.now();

        LocalDateTime inicioHoy = hoy.atStartOfDay();
        LocalDateTime finHoy = hoy.atTime(23, 59, 59);

        LocalDate primerDiaMes = hoy.withDayOfMonth(1);

        LocalDateTime inicioMes = primerDiaMes.atStartOfDay();
        LocalDateTime finMes = hoy.atTime(23, 59, 59);

        Long ventasHoy = ventaRepository.countByEstadoTrueAndFechaBetween(
                inicioHoy,
                finHoy
        );

        Long ventasMes = ventaRepository.countByEstadoTrueAndFechaBetween(
                inicioMes,
                finMes
        );

        BigDecimal totalFacturado = ventaRepository.sumTotalVentas();

        BigDecimal ivaRecaudado = ventaRepository.sumTotalIVA();

        return new ReporteResumenDTO(
                ventasHoy,
                ventasMes,
                totalFacturado,
                ivaRecaudado
        );
    }

    public List<ReporteMetodoPagoDTO> obtenerVentasPorMetodoPago() {

        List<Object[]> resultados = ventaRepository.obtenerVentasPorMetodoPago();

        return resultados.stream()
                .map(r -> new ReporteMetodoPagoDTO(
                        r[0].toString(),
                        (BigDecimal) r[1]
                ))
                .toList();
    }

    public List<ReporteProductoDTO> obtenerTopProductosVendidos() {

        List<Object[]> resultados =
                ventaRepository.obtenerTopProductosVendidos();

        return resultados.stream()
                .map(r -> new ReporteProductoDTO(
                        r[0].toString(),
                        ((Number) r[1]).longValue()
                ))
                .toList();
    }

    public List<ReporteCajeroDTO> obtenerVentasPorCajero() {

        List<Object[]> resultados =
                ventaRepository.obtenerVentasPorCajero();

        return resultados.stream()
                .map(r -> new ReporteCajeroDTO(
                        r[0].toString(),
                        (BigDecimal) r[1]
                ))
                .toList();
    }

    public List<ReporteStockBajoDTO> obtenerStock(String tipo) {

        List<Producto> productos = productoRepository.findAll();

        return productos.stream()
                .filter(p -> {

                    if (tipo == null) {
                        return p.getStockActual() <= p.getStockMinimo();
                    }

                    return switch (tipo) {
                        case "critico" -> p.getStockActual() <= 0;

                        case "bajo" -> p.getStockActual() > 0
                                && p.getStockActual() <= p.getStockMinimo();

                        case "normal" -> p.getStockMinimo() > 0
                                && p.getStockActual() > p.getStockMinimo();

                        default -> true;
                    };
                })
                .map(p -> new ReporteStockBajoDTO(
                        p.getNombre(),
                        p.getStockActual(),
                        p.getStockMinimo()
                ))
                .toList();
    }
}