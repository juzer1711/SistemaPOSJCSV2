import { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardContent, Grid,
  TextField, MenuItem, Button, Autocomplete, Snackbar, Alert, Chip, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import {
  getActiveProducts
} from "../services/productService";

import {
  registrarEntrada,
  registrarSalida,
  getMovimientos
} from "../services/inventarioService";

import InventarioGrid from "../components/Inventario/InventarioGrid";
import MovimientosGrid from "../components/Inventario/MovimientosGrid";

export default function InventarioManagement() {

  // ================= ESTADOS =================

  const [productos, setProductos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [motivo, setMotivo] = useState("");

  // paginación
  const [pageInv, setPageInv] = useState(0);
  const [pageMov, setPageMov] = useState(0);
  const size = 10;

  const [totalRowsMov, setTotalRowsMov] = useState(0);

  // filtros movimientos
    const [filtroMov, setFiltroMov] = useState({
    producto: null,
    fechaInicio: "",
    fechaFin: ""
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

const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
  severity: "success"
});

const showMessage = (message, severity = "success") => {
  setSnackbar({ open: true, message, severity });
};

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
        fechaInicio: formatDateTime(filtroMov.fechaInicio),
        fechaFin: formatDateTime(filtroMov.fechaFin, true)
        });
    const data = res.data.content || [];

    const rowsFormateados = data.map(r => ({
        ...r,
        nombreProducto: r.producto?.nombre ?? "—"
    }));

    setMovimientos(rowsFormateados);
    setTotalRowsMov(res.data.totalElements);
    };


  // ================= ACCIONES =================

  const handleRegistrarMovimiento = async () => {
  if (!productoSeleccionado || !tipoMovimiento || !cantidad) {
    showMessage("Completa todos los campos", "warning");
    return;
  }

  try {
    setLoadingMovimiento(true);

    const body = {
      idProducto: productoSeleccionado.idProducto,
      cantidad: Number(cantidad),
      motivo: motivo || "Movimiento manual"
    };

    if (tipoMovimiento === "ENTRADA") {
      await registrarEntrada(body);
    } else {
      await registrarSalida(body);
    }

    showMessage("Movimiento registrado correctamente", "success");

    // reset
    setProductoSeleccionado(null);
    setCantidad("");
    setTipoMovimiento("");
    setMotivo("");

    await loadProductos();
    await loadMovimientos();

  } catch (error) {
    console.error(error);
    showMessage("Error al registrar movimiento", "error");
  } finally {
    setLoadingMovimiento(false);
  }
};
const lowStockProducts = inventario.filter(
  p => p.stockActual <= p.stockMinimo
);

  const formatDateTime = (date, end = false) => {
    if (!date) return undefined;
    return end
        ? `${date}T23:59:59`
        : `${date}T00:00:00`;
    };

    const handleRowClick = (row) => {
    setMovimientoSeleccionado(row);
    setOpenDetalle(true);
    };

    const inventarioFiltrado = showOnlyLowStock
    ? inventario.filter(p => p.stockActual <= p.stockMinimo)
    : inventario;

  // ================= UI =================

  return (
    <Box sx={{ p: 4 }}>

      <Typography variant="h5" fontWeight="bold" mb={3}>
        Gestión de Inventario
      </Typography>
    {lowStockProducts.length > 0 && (
        <Box
            sx={{
            mb: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeeba",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
            }}
        >
            <Typography fontWeight="bold">
            ⚠ {lowStockProducts.length} productos con stock bajo
            </Typography>

            <Button
            size="small"
            color="warning"
            onClick={() => setShowOnlyLowStock(true)}
            >
            Ver productos
            </Button>
        </Box>
        )}

      {/* 🔵 PANEL MOVIMIENTO */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Registrar movimiento manual
          </Typography>

          <Grid container spacing={2}>

            <Grid item xs={12} md={3}>
              <Autocomplete
                size="small"
                sx={{ width: 250 }}
                options={productos}
                getOptionLabel={(p) => `${p.nombre} | Stock: ${p.stockActual}`}
                value={productoSeleccionado}
                onChange={(e, val) => setProductoSeleccionado(val)}
                renderInput={(params) => (
                  <TextField {...params} label="Producto" />
                )}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                size="small"
                sx={{ width: 150 }}
                select
                fullWidth
                label="Tipo"
                value={tipoMovimiento}
                onChange={(e) => setTipoMovimiento(e.target.value)}
              >
                <MenuItem value="ENTRADA">Entrada</MenuItem>
                <MenuItem value="SALIDA">Salida</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                size="small"
                fullWidth
                label="Cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={3}>
            <TextField
                size="small"
                fullWidth
                label="Motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
            />
            </Grid>
            <Grid item xs={12} md={2}>
                <Button
                fullWidth
                variant="contained"
                onClick={handleRegistrarMovimiento}
                disabled={loadingMovimiento}
                >
                {loadingMovimiento ? (
                <CircularProgress size={20} color="inherit" />
                ) : (
                "Registrar"
                )}
                </Button>
            </Grid>

          </Grid>
        </CardContent>
      </Card>

      {/* 🟩 INVENTARIO ACTUAL */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
            <Typography variant="h6">
            Inventario actual
            {lowStockProducts.length > 0 && (
                <Chip
                label={`${lowStockProducts.length} bajo stock`}
                color="error"
                size="small"
                sx={{ ml: 1 }}
                />
            )}
            </Typography>

            {showOnlyLowStock && (
            <Button
                size="small"
                onClick={() => setShowOnlyLowStock(false)}
            >
                Mostrar todos
            </Button>
            )}

          <InventarioGrid
            rows={inventarioFiltrado}
            page={pageInv}
            onPageChange={setPageInv}
          />
        </CardContent>
      </Card>

      {/* 🟨 HISTORIAL */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Historial de movimientos
          </Typography>

          {/* filtros */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Autocomplete
            size="small"
            sx={{ width: 250 }}
            options={productos}
            getOptionLabel={(p) => p.nombre}
            value={filtroMov.producto}
            onChange={(e, val) =>
                setFiltroMov({ ...filtroMov, producto: val })
            }
            renderInput={(params) => (
                <TextField {...params} label="Producto" />
            )}
            />

            <Box sx={{ display: "flex", gap: 1 }}>
            {["", "ENTRADA", "SALIDA", "VENTA"].map((tipo) => (
                <Chip
                key={tipo}
                label={tipo || "Todos"}
                clickable
                color={tipoFiltro === tipo ? "primary" : "default"}
                onClick={() => setTipoFiltro(tipo)}
                />
            ))}
            </Box>

            <TextField
              type="date"
              size="small"
              value={filtroMov.fechaInicio}
              onChange={(e) =>
                setFiltroMov({ ...filtroMov, fechaInicio: e.target.value })
              }
            />

            <TextField
              type="date"
              size="small"
              value={filtroMov.fechaFin}
              onChange={(e) =>
                setFiltroMov({ ...filtroMov, fechaFin: e.target.value })
              }
            />
          </Box>

          <MovimientosGrid
            rows={movimientos}
            totalRows={totalRowsMov}
            onRowClick={handleRowClick}
            page={pageMov}
            onPageChange={setPageMov}
          />
        </CardContent>
      </Card>
      <Dialog open={openDetalle} onClose={() => setOpenDetalle(false)} fullWidth>
        <DialogTitle>Detalle del movimiento</DialogTitle>

        <DialogContent>
            <Typography><b>Producto:</b> {movimientoSeleccionado?.nombreProducto}</Typography>
            <Typography><b>Tipo:</b> {movimientoSeleccionado?.tipo}</Typography>
            <Typography><b>Cantidad:</b> {movimientoSeleccionado?.cantidad}</Typography>
            <Typography><b>Motivo:</b> {movimientoSeleccionado?.motivo}</Typography>
            <Typography>
            <b>Fecha:</b>{" "}
            {movimientoSeleccionado?.fecha &&
                new Date(movimientoSeleccionado.fecha).toLocaleString("es-CO")}
            </Typography>
        </DialogContent>
        </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
        <Alert
            severity={snackbar.severity}
            variant="filled"
            onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
            {snackbar.message}
        </Alert>
        </Snackbar>

    </Box>
    
  );
}