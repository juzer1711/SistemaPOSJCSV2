import React, { useState } from "react";
import {
  Paper, Typography, Autocomplete, TextField, Button, MenuItem, Select, FormControl, InputLabel, Box
} from "@mui/material";

const CheckoutPanel = ({
  clientes = [],
  items = [],
  clienteSeleccionado, setClienteSeleccionado,
  metodoPago, setMetodoPago,
  observaciones, setObservaciones,
  registrarVenta, clearCart
}) => {
  const total = items.reduce((acc,i) => acc + (Number(i.precio) * Number(i.cantidad)), 0);

  const handleConfirm = async () => {
    if (!clienteSeleccionado) return alert("Selecciona un cliente");
    if (!metodoPago) return alert("Selecciona método de pago");
    if (items.length === 0) return alert("Carrito vacío");

    const body = {
      cliente: { idCliente: clienteSeleccionado.idCliente },
      metodoPago,
      observaciones,
      items: items.map(i => ({ producto: { idProducto: i.idProducto }, cantidad: i.cantidad }))
    };

    try {
      await registrarVenta(body);
      alert("✔ Venta registrada");
      clearCart();
    } catch (e) {
      console.error(e);
      alert("Error al registrar venta");
    }
  };

  return (
    <Paper elevation={3} sx={{ p:2, height: "calc(100vh - 48px)", position: "sticky", top: 24 }}>
      <Typography variant="h6">Pago</Typography>

      <Autocomplete
        sx={{ mt:2 }}
        options={clientes}
        getOptionLabel={(c) => `${c.razonSocial ?? (c.primerNombre + " " + (c.primerApellido ?? ""))} | ${c.documento ?? ""}`}
        value={clienteSeleccionado}
        onChange={(e,val)=>setClienteSeleccionado(val)}
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

      <Box sx={{ mt:3, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <Typography variant="subtitle1">Total</Typography>
        <Typography variant="h5">${total.toLocaleString()}</Typography>
      </Box>

      <Button variant="contained" color="success" fullWidth sx={{ mt:3 }} onClick={handleConfirm} disabled={!clienteSeleccionado || items.length===0 || !metodoPago}>
        Confirmar y Cobrar
      </Button>
    </Paper>
  );
};

export default CheckoutPanel;
