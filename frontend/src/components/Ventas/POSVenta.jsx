import React, { useState } from "react";
import {
  Box, TextField, Button, Typography, Divider,
  Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Autocomplete, Dialog, DialogTitle, DialogContent, DialogActions, 
  IconButton, FormControl, MenuItem, InputLabel, Select
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ventaSchema } from "../../validation/validationSchema";
import { useNavigate } from "react-router-dom";

/* Helpers */
const getClientId = (c) => c?.idCliente ?? null;

const getClientName = (c) => {
  if (!c) return "";
  if (c.razonSocial) return c.razonSocial;
  return [c.primerNombre, c.segundoNombre, c.primerApellido, c.segundoApellido]
    .filter(Boolean)
    .join(" ");
};

const POSVenta = ({ productos = [], clientes = [], registrarVenta }) => {

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [items, setItems] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [openCliente, setOpenCliente] = useState(false);
  const [clienteDetalle, setClienteDetalle] = useState(null);

  const [observaciones, setObservaciones] = useState("");
  const [metodoPago, setMetodoPago] = useState("");

  const navigate = useNavigate();


  /*───────────────────── AGREGAR PRODUCTO ─────────────────────*/
  const addItem = (prod) => {
    const idProducto = prod?.idProducto;
    if (!idProducto) return;

    const existe = items.find(i => i.idProducto === idProducto);

    if (existe) {
      setItems(items.map(i =>
        i.idProducto === idProducto ? { ...i, cantidad: i.cantidad + 1 } : i
      ));
    } else {
      setItems(prev => [
        ...prev, {
          idProducto,
          nombre: prod.nombre,
          precio: Number(prod.precio ?? 0),   // ← precio usado correctamente
          cantidad: 1
        }
      ]);
    }
  };

  /*───────────────────── EDITAR / QUITAR ─────────────────────*/
  const cambiarCantidad = (id, cant) => {
    const c = Number(cant);
    if (c < 1 || isNaN(c)) return;
    setItems(items.map(i => i.idProducto === id ? { ...i, cantidad:c } : i));
  };

  const removeItem = (id) => setItems(items.filter(i => i.idProducto !== id));

  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  /*───────────────────── CONFIRMAR VENTA ─────────────────────*/
  const confirmarVenta = async () => {

    const venta = {
      cliente: { idCliente: clienteSeleccionado.idCliente },
      metodoPago,
      observaciones,
      items: items.map(i => ({
        producto: { idProducto: i.idProducto }, // ← SE ENVÍA COMO OBJETO
        cantidad: i.cantidad
      }))
    };


    try {
      await registrarVenta(venta);
      alert("✔ Venta registrada con éxito!");
      setItems([]);
      setClienteSeleccionado(null);
      setMetodoPago("");
      setObservaciones("");
      
    } catch (error) {
      console.error("❌ Error al registrar:", error);
      alert("Error en el registro: " + error.message);
    }
  };


  /*───────────────────── UI ─────────────────────*/
  return (
    <Box p={3} display="flex" gap={3}>
      
      {/* 📌 LISTA DE PRODUCTOS */}
      <Box flex={2}>
        <TextField fullWidth label="Buscar producto..." size="small"
          value={busqueda} onChange={e=>setBusqueda(e.target.value)} />

        <Paper sx={{mt:2,maxHeight:"70vh",overflow:"auto"}}>
          {productos
            .filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
            .map(p =>
              <Box key={p.idProducto} p={1} sx={{cursor:"pointer"}}
                onClick={()=>addItem(p)} borderBottom="1px solid #ddd">
                  <b>{p.nombre}</b><br/>
                  <small>Precio: ${p.precio}</small>
              </Box>
            )
          }
        </Paper>
      </Box>



      {/* 📌 FACTURACIÓN */}
      <Box flex={3}>
        <Typography variant="h6">Venta actual</Typography>
        <Divider sx={{my:2}}/>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell><TableCell>Cant.</TableCell>
              <TableCell>Precio</TableCell><TableCell>Subt.</TableCell><TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length===0 && <TableRow><TableCell colSpan={5}>🛒 Vacío</TableCell></TableRow>}
            {items.map(i=>{
              const sub = i.precio*i.cantidad;
              return(
                <TableRow key={i.idProducto}>
                  <TableCell>{i.nombre}</TableCell>
                  <TableCell>
                    <input type="number" min="1" value={i.cantidad}
                      style={{width:55}} onChange={(e)=>cambiarCantidad(i.idProducto,e.target.value)} />
                  </TableCell>
                  <TableCell>${i.precio}</TableCell>
                  <TableCell>${sub}</TableCell>
                  <TableCell><Button color="error" size="small" onClick={()=>removeItem(i.idProducto)}>X</Button></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <Typography variant="h4" mt={2}>TOTAL: <b>${total}</b></Typography>


        {/* 🔍 CLIENTE */}
        <Autocomplete sx={{mt:2}} options={clientes}
          value={clienteSeleccionado}
          onChange={(e,val)=>setClienteSeleccionado(val)}
          getOptionLabel={(c)=> `${getClientName(c)} | ${c.documento ?? ""}`}
          isOptionEqualToValue={(o,v)=>o.idCliente===v.idCliente}
          renderOption={(props,c)=>(
            <li {...props}>
              {getClientName(c)} — {c.documento}
              <IconButton onClick={(e)=>{e.stopPropagation(); setClienteDetalle(c); setOpenCliente(true);}}>
                <VisibilityIcon/>
              </IconButton>
            </li>
          )}
          renderInput={p=><TextField {...p} label="Cliente" required/>}
        />

        <TextField label="Observaciones" fullWidth multiline minRows={2} sx={{mt:2}}
          value={observaciones} onChange={e=>setObservaciones(e.target.value)} />

        <FormControl fullWidth sx={{mt:2}} required>
          <InputLabel>Método de Pago</InputLabel>
          <Select value={metodoPago} label="Metodo" onChange={e=>setMetodoPago(e.target.value)}>
            <MenuItem value="EFECTIVO">Efectivo</MenuItem>
            <MenuItem value="TRANSFERENCIA">Transferencia</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" fullWidth sx={{mt:2}}
          disabled={!clienteSeleccionado || items.length===0}
          onClick={confirmarVenta}>
          Confirmar Venta
        </Button>
      </Box>



      {/* 🔍 DIALOGO CLIENTE */}
      <Dialog open={openCliente} onClose={()=>setOpenCliente(false)}>
        <DialogTitle>Datos del Cliente</DialogTitle>
        <DialogContent>
          <p><b>Nombre:</b> {getClientName(clienteDetalle)}</p>
          <p><b>Documento:</b> {clienteDetalle?.documento}</p>
          <p><b>Teléfono:</b> {clienteDetalle?.telefono || "N/A"}</p>
          <p><b>Email:</b> {clienteDetalle?.email || "N/A"}</p>
          <p><b>Dirección:</b> {clienteDetalle?.direccion || "N/A"}</p>
        </DialogContent>
        <DialogActions><Button onClick={()=>setOpenCliente(false)}>Cerrar</Button></DialogActions>
      </Dialog>

    </Box>
  );
};

export default POSVenta;
