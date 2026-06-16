package com.sistemaposjcs.sistemaposjcs.service;

import java.text.Normalizer;
import java.util.Locale;

import org.springframework.stereotype.Service;

import com.sistemaposjcs.sistemaposjcs.model.Enum.TipoConsulta;

@Service
public class IntentClassifierService {

    public TipoConsulta clasificar(String pregunta) {

        String texto = normalizar(pregunta);

        if (esConsultaProductosStockBajo(texto)) {
            return TipoConsulta.PRODUCTOS_STOCK_BAJO;
        }

        if (esConsultaProductosAgotados(texto)) {
            return TipoConsulta.PRODUCTOS_AGOTADOS;
        }

        if (esConsultaMovimientosInventarioHoy(texto)) {
            return TipoConsulta.MOVIMIENTOS_INVENTARIO_HOY;
        }

        if (esConsultaProductoMayorStock(texto)) {
            return TipoConsulta.PRODUCTO_MAYOR_STOCK;
        }

        if (esConsultaStockProducto(texto)) {
            return TipoConsulta.STOCK_PRODUCTO;
        }

        if (esConsultaTotalCajasAbiertas(texto)) {
            return TipoConsulta.TOTAL_CAJAS_ABIERTAS;
        }

        if (esConsultaListarCajasAbiertas(texto)) {
            return TipoConsulta.LISTAR_CAJAS_ABIERTAS;
        }

        if (esConsultaUsuarioCajaPrincipal(texto)) {
            return TipoConsulta.USUARIO_CAJA_PRINCIPAL;
        }

        if (esConsultaUltimoCierreCaja(texto)) {
            return TipoConsulta.ULTIMO_CIERRE_CAJA;
        }

        if (esConsultaDineroActualCaja(texto)) {
            return TipoConsulta.DINERO_ACTUAL_CAJA;
        }

        if (esConsultaCajeroMasVentasMes(texto)) {
            return TipoConsulta.CAJERO_MAS_VENTAS_MES;
        }

        if (esConsultaCajeroMasVentasHoy(texto)) {
            return TipoConsulta.CAJERO_MAS_VENTAS_HOY;
        }

        if (esConsultaRankingCajeros(texto)) {
            return TipoConsulta.RANKING_CAJEROS;
        }

        if (esConsultaVentasPorCajero(texto)) {
            return TipoConsulta.VENTAS_POR_CAJERO;
        }

        if (esConsultaUltimosClientes(texto)) {
            return TipoConsulta.ULTIMOS_CLIENTES;
        }

        if (esConsultaClientesActivos(texto)) {
            return TipoConsulta.CLIENTES_ACTIVOS;
        }

        if (esConsultaTotalClientes(texto)) {
            return TipoConsulta.TOTAL_CLIENTES;
        }

        if (esConsultaTopProductosMasVendidos(texto)) {
            return TipoConsulta.TOP_PRODUCTOS_MAS_VENDIDOS;
        }

        if (esConsultaProductoMenosVendido(texto)) {
            return TipoConsulta.PRODUCTO_MENOS_VENDIDO;
        }

        if (esConsultaProductoMasVendido(texto)) {
            return TipoConsulta.PRODUCTO_MAS_VENDIDO;
        }

        if (esConsultaProductosInactivos(texto)) {
            return TipoConsulta.PRODUCTOS_INACTIVOS;
        }

        if (esConsultaProductosActivos(texto)) {
            return TipoConsulta.PRODUCTOS_ACTIVOS;
        }

        if (esConsultaTotalProductos(texto)) {
            return TipoConsulta.TOTAL_PRODUCTOS;
        }

        if (esConsultaUltimasVentas(texto)) {
            return TipoConsulta.ULTIMAS_VENTAS;
        }

        if (esConsultaVentaMasAlta(texto)
                && contieneAlguna(texto, "mes", "mensual")) {
            return TipoConsulta.VENTA_MAS_ALTA_MES;
        }

        if (esConsultaVentaMasAlta(texto)
                && contieneAlguna(texto, "hoy", "dia", "diaria")) {
            return TipoConsulta.VENTA_MAS_ALTA_DIA;
        }

        if (esConsultaCantidadVentasHoy(texto)) {
            return TipoConsulta.CANTIDAD_VENTAS_HOY;
        }

        if (contieneAlguna(texto, "venta", "ventas", "vendido", "vendi", "vendimos")
                && contieneAlguna(texto, "semana", "semanal")) {
            return TipoConsulta.VENTAS_SEMANA;
        }

        if (contieneAlguna(texto, "venta", "ventas", "vendido", "vendi", "vendimos")
                && contieneAlguna(texto, "mes", "mensual")) {
            return TipoConsulta.VENTAS_MES;
        }

        if (contieneAlguna(texto, "venta", "ventas")
                && contieneAlguna(texto, "hoy", "dia", "diarias")) {
            return TipoConsulta.VENTAS_HOY;
        }

        return TipoConsulta.DESCONOCIDA;
    }

    private boolean esConsultaUltimasVentas(String texto) {
        return contieneAlguna(texto, "ultimas", "recientes", "reciente")
                && contieneAlguna(texto, "venta", "ventas");
    }

    private boolean esConsultaVentaMasAlta(String texto) {
        return contieneAlguna(texto, "venta", "ventas")
                && (
                        texto.contains("mas alta")
                        || texto.contains("mayor venta")
                        || texto.contains("venta mayor")
                        || texto.contains("mas grande")
                        || texto.contains("mayor monto")
                );
    }

    private boolean esConsultaCantidadVentasHoy(String texto) {
        return contieneAlguna(texto, "venta", "ventas")
                && contieneAlguna(texto, "hoy", "dia", "diarias")
                && contieneAlguna(texto, "cantidad", "cuantas", "numero", "conteo", "total de ventas");
    }

    private boolean esConsultaTopProductosMasVendidos(String texto) {
        return contieneAlguna(texto, "producto", "productos")
                && contieneAlguna(texto, "top", "ranking", "lista", "listado", "mas vendidos");
    }

    private boolean esConsultaProductoMenosVendido(String texto) {
        return contieneAlguna(texto, "producto", "productos")
                && (
                        texto.contains("menos vendido")
                        || texto.contains("menos vendidos")
                        || texto.contains("menor venta")
                        || texto.contains("vende menos")
                );
    }

    private boolean esConsultaProductoMasVendido(String texto) {
        return contieneAlguna(texto, "producto", "productos")
                && (
                        texto.contains("mas vendido")
                        || texto.contains("mas vendidos")
                        || texto.contains("mayor venta")
                        || texto.contains("vende mas")
                );
    }

    private boolean esConsultaTotalProductos(String texto) {
        return contieneAlguna(texto, "producto", "productos")
                && contieneAlguna(texto, "total", "cuantos", "cantidad", "numero", "conteo");
    }

    private boolean esConsultaProductosActivos(String texto) {
        return contieneAlguna(texto, "producto", "productos")
                && contieneAlguna(texto, "activo", "activos", "habilitado", "habilitados");
    }

    private boolean esConsultaProductosInactivos(String texto) {
        return contieneAlguna(texto, "producto", "productos")
                && contieneAlguna(texto, "inactivo", "inactivos", "desactivado", "desactivados");
    }

    private boolean esConsultaProductosStockBajo(String texto) {
        return contieneAlguna(texto, "producto", "productos", "inventario", "stock")
                && (
                        texto.contains("stock bajo")
                        || texto.contains("bajo stock")
                        || texto.contains("poco stock")
                        || texto.contains("alerta de stock")
                        || texto.contains("alertas de stock")
                );
    }

    private boolean esConsultaProductosAgotados(String texto) {
        return contieneAlguna(texto, "producto", "productos", "inventario", "stock")
                && contieneAlguna(texto, "agotado", "agotados", "sin stock", "stock cero");
    }

    private boolean esConsultaMovimientosInventarioHoy(String texto) {
        return contieneAlguna(texto, "movimiento", "movimientos")
                && contieneAlguna(texto, "inventario", "stock")
                && contieneAlguna(texto, "hoy", "dia");
    }

    private boolean esConsultaProductoMayorStock(String texto) {
        return contieneAlguna(texto, "producto", "productos")
                && (
                        texto.contains("mayor stock")
                        || texto.contains("mas stock")
                        || texto.contains("stock mas alto")
                        || texto.contains("mayor inventario")
                );
    }

    private boolean esConsultaStockProducto(String texto) {
        return contieneAlguna(texto, "stock", "inventario", "existencias", "unidades")
                && contieneAlguna(texto, "producto", "productos", "de", "del");
    }

    private boolean esConsultaTotalClientes(String texto) {
        return contieneAlguna(texto, "cliente", "clientes")
                && contieneAlguna(texto, "total", "cuantos", "cantidad", "numero", "conteo");
    }

    private boolean esConsultaClientesActivos(String texto) {
        return contieneAlguna(texto, "cliente", "clientes")
                && contieneAlguna(texto, "activo", "activos", "habilitado", "habilitados");
    }

    private boolean esConsultaUltimosClientes(String texto) {
        return contieneAlguna(texto, "cliente", "clientes")
                && contieneAlguna(texto, "ultimos", "recientes", "reciente", "nuevos");
    }

    private boolean esConsultaTotalCajasAbiertas(String texto) {
        return contieneAlguna(texto, "caja", "cajas")
                && contieneAlguna(texto, "abierta", "abiertas")
                && contieneAlguna(texto, "total", "cuantas", "cantidad", "numero", "conteo");
    }

    private boolean esConsultaListarCajasAbiertas(String texto) {
        return contieneAlguna(texto, "caja", "cajas")
                && contieneAlguna(texto, "abierta", "abiertas")
                && contieneAlguna(texto, "listar", "lista", "muestra", "mostrar", "cuales", "ver");
    }

    private boolean esConsultaUsuarioCajaPrincipal(String texto) {
        return contieneAlguna(texto, "caja", "cajas")
                && contieneAlguna(texto, "principal", "mayor", "mas ventas")
                && contieneAlguna(texto, "usuario", "cajero", "responsable", "quien");
    }

    private boolean esConsultaUltimoCierreCaja(String texto) {
        return contieneAlguna(texto, "caja", "cajas")
                && contieneAlguna(texto, "cierre", "cerrada", "cerradas", "cerrar")
                && contieneAlguna(texto, "ultimo", "ultima", "reciente", "recientes");
    }

    private boolean esConsultaDineroActualCaja(String texto) {
        return contieneAlguna(texto, "caja", "cajas")
                && contieneAlguna(texto, "dinero", "monto", "actual", "saldo", "total")
                && contieneAlguna(texto, "actual", "abierta", "abiertas", "hay", "tiene");
    }

    private boolean esConsultaCajeroMasVentasMes(String texto) {
        return contieneAlguna(texto, "cajero", "cajeros", "usuario", "usuarios")
                && contieneAlguna(texto, "venta", "ventas", "vendio", "vendido")
                && contieneAlguna(texto, "mas", "mayor", "mejor")
                && contieneAlguna(texto, "mes", "mensual");
    }

    private boolean esConsultaCajeroMasVentasHoy(String texto) {
        return contieneAlguna(texto, "cajero", "cajeros", "usuario", "usuarios")
                && contieneAlguna(texto, "venta", "ventas", "vendio", "vendido")
                && contieneAlguna(texto, "mas", "mayor", "mejor")
                && contieneAlguna(texto, "hoy", "dia");
    }

    private boolean esConsultaVentasPorCajero(String texto) {
        return contieneAlguna(texto, "cajero", "cajeros", "usuario", "usuarios")
                && contieneAlguna(texto, "venta", "ventas")
                && contieneAlguna(texto, "por", "cada", "todos", "total");
    }

    private boolean esConsultaRankingCajeros(String texto) {
        return contieneAlguna(texto, "cajero", "cajeros", "usuario", "usuarios")
                && contieneAlguna(texto, "ranking", "top", "lista", "mejores");
    }

    private String normalizar(String texto) {
        if (texto == null) {
            return "";
        }

        String sinAcentos = Normalizer
                .normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");

        return sinAcentos.toLowerCase(Locale.ROOT).trim();
    }

    private boolean contieneAlguna(String texto, String... palabras) {
        for (String palabra : palabras) {
            if (texto.contains(palabra)) {
                return true;
            }
        }

        return false;
    }
}
