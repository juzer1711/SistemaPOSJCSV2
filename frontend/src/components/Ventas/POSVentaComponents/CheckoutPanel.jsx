import React, { useState } from "react";
import {
  Paper, Typography, Autocomplete, TextField, Button, MenuItem, Select, FormControl, InputLabel, Box,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,  Snackbar, Alert
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";


const CheckoutPanel = ({
  clientes = [],
  items = [],
  clienteSeleccionado, setClienteSeleccionado,
  metodoPago, setMetodoPago,
  observaciones, setObservaciones,
  registrarVenta, clearCart
}) => {
  const total = items.reduce((acc,i) => acc + (Number(i.precio) * Number(i.cantidad)), 0);

  const [loadingVenta, setLoadingVenta] = useState(false);

  const handleConfirm = async () => {
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
    setLoadingVenta(true);

    const body = {
      cliente: { idCliente: clienteSeleccionado.idCliente },
      metodoPago,
      observaciones,
      items: items.map(i => ({ producto: { idProducto: i.idProducto }, cantidad: i.cantidad }))
    };

    console.log("BODY QUE ENVÍO:", body);

    try {
      await registrarVenta(body);
      setSnackbar({
      open: true,
      message: "✔ Venta registrada correctamente",
      severity: "success"
      });
      clearCart();
    } catch (error) { 
      //extrae el mensaje de error real
      const mensajeReal = error.response?.data?.message || error.message || "Error desconocido";
      setSnackbar({
        open: true,
        message: `Error al registrar venta: ${mensajeReal}`,
        severity: "error"
      });
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
    <Paper elevation={3} sx={{ p:2, height: "calc(100vh - 48px)", position: "sticky", top: 24 }}>
      <Typography variant="h6">Pago</Typography>

      <Autocomplete
        sx={{ mt:2 }}
        options={clientes}
        value={clienteSeleccionado}
        isOptionEqualToValue={(o,v)=>o.idCliente===v?.idCliente}
        onChange={(e,val)=>setClienteSeleccionado(val)}
        getOptionLabel={(c)=> `${getClientName(c)} | ${c?.documento ?? ""}`}
        renderOption={(props,c)=>(
          <li {...props} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
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
        )}
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
        disabled={!clienteSeleccionado || items.length===0 || !metodoPago}
      >
        Ver Resumen & Cobrar
      </Button>


      <Dialog open={openCliente} onClose={()=>setOpenCliente(false)}>
        <DialogTitle>Datos del Cliente</DialogTitle>

        <DialogContent>
          <p><b>Nombre:</b> {getClientName(clienteDetalle)}</p>
          <p><b>Documento:</b> {clienteDetalle?.documento}</p>
          <p><b>Teléfono:</b> {clienteDetalle?.telefono || "N/A"}</p>
          <p><b>Email:</b> {clienteDetalle?.email || "N/A"}</p>
          <p><b>Dirección:</b> {clienteDetalle?.direccion || "N/A"}</p>
        </DialogContent>

        <DialogActions>
          <Button onClick={()=>setOpenCliente(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openResumen} onClose={() => setOpenResumen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Resumen de Venta</DialogTitle>

        <DialogContent dividers>

          <Typography variant="subtitle1"><b>Cliente:</b> {getClientName(clienteSeleccionado)}</Typography>
          <Typography variant="subtitle1"><b>Documento:</b> {clienteSeleccionado?.documento}</Typography>
          <Typography variant="subtitle1"><b>Método de Pago:</b> {metodoPago}</Typography>
          <Typography variant="subtitle1"><b>Observaciones:</b> {observaciones || "N/A"}</Typography>

          <hr style={{ margin: "12px 0" }} />

          <Typography variant="h6">Detalle de Productos</Typography>

          <Box sx={{ mt: 2, px: 1 }}>
            {items.map(i => (
              <Box
                key={i.idProducto}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 0.5,
                  borderBottom: "1px dashed #ccc"
                }}
              >
                <span>{i.nombre} (x{i.cantidad})</span>
                <b>${(i.precio * i.cantidad).toLocaleString()}</b>
              </Box>
            ))}
          </Box>

        <hr style={{ margin: "12px 0" }} />

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
        <Typography variant="subtitle1">Total</Typography>
        <Typography variant="h5">${total.toLocaleString()}</Typography>
        </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenResumen(false)}>Cancelar</Button>

          <Button
            onClick={() => {
              setOpenResumen(false);
              handleConfirm();
            }}
            variant="contained"
            color="success"
          >
            Confirmar Venta
          </Button>
        </DialogActions>
      </Dialog>
  
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
