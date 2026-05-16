import { useEffect, useState } from "react";
import { getActiveProducts } from "../../services/productService";
import { useSnackbar } from "../../context/SnackBarProvider";
import { formatDateForApi } from "../../utils/formats";
import {
  registrarEntrada,
  registrarSalida,
  getMovimientos,
} from "../../services/inventarioService";

export const useInventarioManagement = () => {
  // ================= ESTADOS =================

  const [productos, setProductos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [motivo, setMotivo] = useState("");
  const { showSnackbar } = useSnackbar();

  // paginación
  const [pageInv, setPageInv] = useState(0);
  const [pageMov, setPageMov] = useState(0);
  const size = 10;
  const [totalRowsMov, setTotalRowsMov] = useState(0);

  // filtros movimientos
  const [filtroMov, setFiltroMov] = useState({
    producto: null,
    fechaInicio: "",
    fechaFin: "",
  });

  // form movimiento
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [tipoMovimiento, setTipoMovimiento] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [loadingMovimiento, setLoadingMovimiento] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null);
  const [openDetalle, setOpenDetalle] = useState(false);
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);


  // ================= HELPERS =================



  // ================= LOADERS =================

  useEffect(() => {
    loadProductos();
  }, []);

  useEffect(() => {
    loadMovimientos();
  }, [pageMov, filtroMov, tipoFiltro]);

  const loadProductos = async () => {
    const res = await getActiveProducts();
    const data = res.data.content || [];
    setProductos(data);
    setInventario(data); // reutilizamos producto como inventario
  };

  const loadMovimientos = async () => {
    const res = await getMovimientos({
      page: pageMov,
      size,
      idProducto: filtroMov.producto?.idProducto || undefined,
      tipo: tipoFiltro || undefined,
      fechaInicio: formatDateForApi(filtroMov.fechaInicio),
      fechaFin: formatDateForApi(filtroMov.fechaFin, true),
    });

    const data = res.data.content || [];

    const rowsFormateados = data.map((r) => ({
      ...r,
      nombreProducto: r.producto?.nombre ?? "—",
    }));

    setMovimientos(rowsFormateados);
    setTotalRowsMov(res.data.totalElements);
  };

  // ================= ACCIONES =================

  const handleRegistrarMovimiento = async () => {
    if (!productoSeleccionado || !tipoMovimiento || !cantidad) {
      showSnackbar("Completa todos los campos", "warning");
      return;
    }

    try {
      setLoadingMovimiento(true);

      const body = {
        idProducto: productoSeleccionado.idProducto,
        cantidad: Number(cantidad),
        motivo: motivo || "Movimiento manual",
      };

      if (tipoMovimiento === "ENTRADA") {
        await registrarEntrada(body);
      } else {
        await registrarSalida(body);
      }

      showSnackbar("Movimiento registrado correctamente", "success");

      // reset
      setProductoSeleccionado(null);
      setCantidad("");
      setTipoMovimiento("");
      setMotivo("");

      await loadProductos();
      await loadMovimientos();
    } catch (error) {
      console.error(error);
      showSnackbar("Error al registrar movimiento", "error");
    } finally {
      setLoadingMovimiento(false);
    }
  };

  const handleRowClick = (row) => {
    setMovimientoSeleccionado(row);
    setOpenDetalle(true);
  };

  // ================= DERIVADOS =================

  const lowStockProducts = inventario.filter(
    (p) => p.stockActual <= p.stockMinimo
  );

  const inventarioFiltrado = showOnlyLowStock
    ? inventario.filter((p) => p.stockActual <= p.stockMinimo)
    : inventario;

  return {
    // Datos
    productos,
    movimientos,
    movimientoSeleccionado,
    lowStockProducts,
    inventarioFiltrado,
    // Paginación
    pageInv,
    setPageInv,
    pageMov,
    setPageMov,
    totalRowsMov,
    // Filtros
    filtroMov,
    setFiltroMov,
    tipoFiltro,
    setTipoFiltro,
    // Formulario movimiento
    productoSeleccionado,
    setProductoSeleccionado,
    tipoMovimiento,
    setTipoMovimiento,
    cantidad,
    setCantidad,
    motivo,
    setMotivo,
    loadingMovimiento,
    // Dialog detalle movimiento
    openDetalle,
    setOpenDetalle,
    handleRowClick,
    // Stock bajo
    showOnlyLowStock,
    setShowOnlyLowStock,
    // Handlers
    handleRegistrarMovimiento,
  };
};