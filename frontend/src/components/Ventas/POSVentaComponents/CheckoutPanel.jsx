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
  registrarVenta, clearCart
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
      setOpenResumen(false);
      clearCart();
      setClienteSeleccionado(null); // Limpia el cliente
      setMetodoPago("");        // Reset del método de pago
      setMontoRecibido("");     // Limpia el input de efectivo
      setObservaciones("");     // Limpia las notas
      setLoadingVenta(false);
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
          p:2, 
          height: "calc(100vh - 48px)", 
          position: "sticky", 
          top: 24,
          pointerEvents: loadingVenta ? "none" : "auto",
          opacity: loadingVenta ? 0.7 : 1
        }}
      >
      <Typography variant="h6">Pago</Typography>

      <Autocomplete
        sx={{ mt:2 }}
        options={clientes}
        value={clienteSeleccionado}
        isOptionEqualToValue={(o,v)=>o.idCliente===v?.idCliente}
        onChange={(e,val)=>setClienteSeleccionado(val)}
        getOptionLabel={(c)=> `${getClientName(c)} | ${c?.documento ?? ""}`}
        renderOption={(props,c)=>{
        const { key, ...rest } = props;
        return (
          <li key={key} {...rest} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span>{getClientName(c)} — {c.documento}</span>

            <IconButton
              size="small"
              onClick={(e)=>{
                e.stopPropagation();
                setClienteDetalle(c);
                setOpenCliente(true);
              }}
            >
              <VisibilityIcon fontSize="small"/>
            </IconButton>
          </li>
        );
        }}
        renderInput={(params)=> <TextField {...params} label="Cliente" size="small" />}
      />

      <TextField label="Observaciones" fullWidth multiline minRows={2} sx={{ mt:2 }} value={observaciones} onChange={e => setObservaciones(e.target.value)} />

      <FormControl fullWidth sx={{ mt:2 }}>
        <InputLabel>Método de pago</InputLabel>
        <Select value={metodoPago} label="Metodo de pago" onChange={e=>setMetodoPago(e.target.value)}>
          <MenuItem value="EFECTIVO">Efectivo</MenuItem>
          <MenuItem value="TRANSFERENCIA">Transferencia</MenuItem>
        </Select>
      </FormControl>

      {metodoPago === "EFECTIVO" && (
        <Box sx={{ mt:2 }}>
          <TextField
            fullWidth
            label="Monto recibido"
            type="number"
            value={montoRecibido}
            onChange={(e)=>setMontoRecibido(e.target.value)}
          />

          <Typography variant="h6" sx={{ mt:1 }}>
            Cambio: ${cambio.toLocaleString("es-CO")}
          </Typography>
        </Box>
      )}

      <hr style={{ margin: "12px 0" }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="subtitle1">Total</Typography>
        <Typography variant="h5">${total.toLocaleString()}</Typography>
      </Box>


      <Button
        variant="contained"
        color="success"
        fullWidth
        sx={{ mt:3 }}
        onClick={() => setOpenResumen(true)}
        disabled={
          loadingVenta || 
          !clienteSeleccionado || items.length===0 ||
        !metodoPago || (metodoPago === "EFECTIVO" && (!montoRecibido || Number(montoRecibido) < total))}
      >
        {loadingVenta ? <CircularProgress size={24} color="inherit" /> : "Ver Resumen & Cobrar"}
      </Button>


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
