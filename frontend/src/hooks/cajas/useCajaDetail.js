import { useEffect, useState } from "react";
import { getVentasPorCaja, getVentaById } from "../../services/ventaService";
import { getMovimientosPorCaja } from "../../services/movimientosCajaService";

export const useCajaDetail = ({ open, caja }) => {
  const [ventas, setVentas] = useState([]);
  const [loadingVentas, setLoadingVentas] = useState(true);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [ventaOpen, setVentaOpen] = useState(false);
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    if (!open || !caja?.idCaja) return;

    const fetchVentas = async () => {
      try {
        setLoadingVentas(true);
        const ventas = await getVentasPorCaja(caja.idCaja);
        setVentas(ventas || []);
      } catch (e) {
        setVentas([]);
      } finally {
        setLoadingVentas(false);
      }
    };

    fetchVentas();
  }, [open, caja?.idCaja]);

  useEffect(() => {
    if (caja?.idCaja) {
      getMovimientosPorCaja(caja.idCaja)
        .then((res) => setMovimientos(res))
        .catch(() => setMovimientos([]));
    }
  }, [caja]);

  const verDetalleVenta = async (idVenta) => {
    const res = await getVentaById(idVenta);
    setVentaSeleccionada(res.data);
    setVentaOpen(true);
  };

  // Cálculos derivados de caja
  const diferenciaEfectivo =
    Number(caja?.efectivoReal ?? 0) - Number(caja?.totalEfectivo ?? 0);

  const diferenciaTransferencia =
    Number(caja?.transferenciaReal ?? 0) - Number(caja?.totalTransferencia ?? 0);

  return {
    ventas,
    loadingVentas,
    ventaSeleccionada,
    ventaOpen,
    setVentaOpen,
    movimientos,
    verDetalleVenta,
    diferenciaEfectivo,
    diferenciaTransferencia,
  };
};