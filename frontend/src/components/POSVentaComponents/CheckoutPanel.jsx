import React, { useState } from "react";
import {
  Paper, Typography, Autocomplete, TextField, Button, MenuItem, Select, FormControl, InputLabel, Box,
  IconButton,  Snackbar, Alert
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckoutResumenDialog from "./CheckoutResumenDialog";
import CircularProgress from "@mui/material/CircularProgress";


const CheckoutPanel = ({
  clientes = [],
  items = [],
  clienteSeleccionado, setClienteSeleccionado,
  metodoPago, setMetodoPago,
  montoRecibido, setMontoRecibido,
  observaciones, setObservaciones,
  registrarVenta, clearCart, reloadProductos, cajaActiva
}) => {
  const total = items.reduce((acc,i) => acc + (Number(i.precioUnitario) * Number(i.cantidad)), 0);
  const totalIVA = items.reduce((acc,i) => acc + (i.precioUnitario - i.precioSinIva) * i.cantidad, 0);

  const cambio = montoRecibido ? (montoRecibido - total) : 0;

  const totalSinIVA = items.reduce(
    (acc,i) => acc + (i.precioSinIva * i.cantidad),
    0
  );

  const [loadingVenta, setLoadingVenta] = useState(false);

  const handleConfirm = async () => {
    setLoadingVenta(true);
    if (!clienteSeleccionado) {
      setSnackbar({ open: true, message: "Selecciona un cliente", severity: "warning" });
      setLoadingVenta(false);
      return;
    }

    if (!metodoPago) {
      setSnackbar({ open: true, message: "Selecciona un método de pago", severity: "warning" });
      setLoadingVenta(false);
      return;
    }

    if (items.length === 0) {
      setSnackbar({ open: true, message: "Carrito vacío", severity: "warning" });
      setLoadingVenta(false);
      return;
    }
    if (loadingVenta) return;  // evita doble clic

    if (metodoPago === "EFECTIVO" && Number(montoRecibido) < total) {
      setSnackbar({
        open: true,
        message: "El monto recibido es insuficiente",
        severity: "warning"
      });
      setLoadingVenta(false);
      return;
    }

    const idUsuario = localStorage.getItem("id_usuario");

    const body = {
      cliente: { idCliente: clienteSeleccionado.idCliente },
      usuario: { idUsuario: Number(idUsuario) },
      metodoPago,
      observaciones,
      montoRecibido: metodoPago === "EFECTIVO" ? Number(montoRecibido) : null,
      items: items.map(i => ({ producto: { idProducto: i.idProducto }, cantidad: i.cantidad }))
    };

    try {
      await registrarVenta(body);
      setSnackbar({
      open: true,
      message: "✔ Venta registrada correctamente",
      severity: "success"
      });
      clearCart();
      setClienteSeleccionado(null); // Limpia el cliente
      setMetodoPago("");        // Reset del método de pago
      setMontoRecibido("");     // Limpia el input de efectivo
      setObservaciones("");     // Limpia las notas
      await reloadProductos();
    } catch (error) { 
      //extrae el mensaje de error real
      const mensajeReal = error.response?.data?.message || error.message || "Error desconocido";
        if (mensajeReal.includes("caja abierta")) {
          setSnackbar({
            open: true,
            message: "⚠️ Debes abrir una caja antes de vender",
            severity: "error"
          });
        } else {
          setSnackbar({
            open: true,
            message: `Error: ${mensajeReal}`,
            severity: "error"
          });
        }
    }finally {
    setLoadingVenta(false);
    setOpenResumen(false);
  }
  };

  const [openCliente, setOpenCliente] = useState(false);
  const [clienteDetalle, setClienteDetalle] = useState(null);
  const getClientName = (c) =>
  c?.razonSocial ?? `${c?.primerNombre ?? ""} ${c?.primerApellido ?? ""}`.trim();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });


  const [openResumen, setOpenResumen] = useState(false);


  return (
  <Paper
    elevation={3}
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      borderRadius: 2,
      overflow: "hidden",
    }}
  >
    {/* HEADER */}
    <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
      <Typography variant="h6">Checkout</Typography>
      {cajaActiva && (
        <Typography variant="body2" color="text.secondary">
          Caja #{cajaActiva.idCaja} — {cajaActiva.nombreCajero}
        </Typography>
      )}
    </Box>

    {/* SCROLLABLE CONTENT */}
    <Box sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>

      {/* CLIENTE */}
      <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
        <Typography fontWeight={600} mb={1}>Cliente</Typography>

        <Autocomplete
          options={clientes}
          value={clienteSeleccionado}
          isOptionEqualToValue={(o,v)=>o.idCliente===v?.idCliente}
          onChange={(e,val)=>setClienteSeleccionado(val)}
          getOptionLabel={(c)=> `${getClientName(c)} | ${c?.documento ?? ""}`}
          renderInput={(params)=> <TextField {...params} size="small" />}
        />
      </Box>

      {/* PAGO */}
      <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
        <Typography fontWeight={600} mb={1}>Método de pago</Typography>

        <FormControl fullWidth size="small">
          <Select
            value={metodoPago}
            onChange={e=>setMetodoPago(e.target.value)}
          >
            <MenuItem value="EFECTIVO">Efectivo</MenuItem>
            <MenuItem value="TRANSFERENCIA">Transferencia</MenuItem>
          </Select>
        </FormControl>

        {metodoPago === "EFECTIVO" && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Monto recibido"
              type="number"
              value={montoRecibido}
              onChange={(e)=>setMontoRecibido(e.target.value)}
            />
            <Typography mt={1} fontWeight={600}>
              Cambio: ${cambio.toLocaleString("es-CO")}
            </Typography>
          </Box>
        )}
      </Box>

      {/* OBSERVACIONES */}
      <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
        <Typography fontWeight={600} mb={1}>Observaciones</Typography>
        <TextField
          fullWidth
          multiline
          minRows={2}
          size="small"
          value={observaciones}
          onChange={e => setObservaciones(e.target.value)}
        />
      </Box>
    </Box>

    {/* FOOTER TOTAL */}
    <Box
      sx={{
        p: 2,
        borderTop: "1px solid #e0e0e0",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h4" fontWeight="bold" color="primary">
          ${total.toLocaleString("es-CO")}
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="success"
        fullWidth
        size="large"
        onClick={() => setOpenResumen(true)}
        disabled={
          loadingVenta || 
          !clienteSeleccionado || 
          items.length===0 ||
          !metodoPago || 
          (metodoPago === "EFECTIVO" && (!montoRecibido || Number(montoRecibido) < total))
        }
      >
        {loadingVenta
          ? <CircularProgress size={24} color="inherit" />
          : "Ver resumen y cobrar"}
      </Button>
    </Box>


      <CheckoutResumenDialog
        open={openResumen}
        onClose={() => setOpenResumen(false)}
        cliente={clienteSeleccionado}
        metodoPago={metodoPago}
        observaciones={observaciones}
        items={items}
        total={total}
        totalIVA={totalIVA}
        totalSinIVA={totalSinIVA}
        montoRecibido={montoRecibido}
        cambio={cambio}
        loadingVenta={loadingVenta}
        onConfirm={() => {
          handleConfirm();
        }}
      />

  
      <Snackbar
      open={snackbar.open}
      autoHideDuration={2500}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
    >
      <Alert
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity}
        variant="filled"
      >
        {snackbar.message}
      </Alert>
    </Snackbar>

    </Paper>
    
  );
};

export default CheckoutPanel;
