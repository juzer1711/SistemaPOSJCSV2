import React, { useMemo } from "react";
import {
  Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const CartPanel = ({ items = [], onChangeQty = () => {}, onRemove = () => {} }) => {

  const total = useMemo(() => items.reduce((acc,i) => acc + (Number(i.precioUnitario) * Number(i.cantidad)), 0), [items]);

  return (
    <Paper elevation={3} sx={{ p:2 }}>
      <Typography variant="h6">Carrito</Typography>

      <Table size="small" sx={{ mt:1 }}>
        <TableHead>
          <TableRow>
            <TableCell>Producto</TableCell>
            <TableCell align="center">Cant</TableCell>
            <TableCell align="right">Precio</TableCell>
            <TableCell align="right">Subtotal</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.length === 0 && (
            <TableRow><TableCell colSpan={5}>🛒 Carrito vacío</TableCell></TableRow>
          )}
          {items.map(i => (
            <TableRow key={i.idProducto}>
              <TableCell sx={{ maxWidth: 280 }}>{i.nombre}</TableCell>
              <TableCell align="center">
                <Box sx={{ display:"flex", alignItems:"center", gap:1, justifyContent:"center" }}>
                  <IconButton size="small" onClick={()=> onChangeQty(i.idProducto, Math.max(1, i.cantidad - 1)) }><RemoveIcon fontSize="small"/></IconButton>
                  <Typography>{i.cantidad}</Typography>
                  <IconButton size="small" onClick={()=> onChangeQty(i.idProducto, i.cantidad + 1)}><AddIcon fontSize="small"/></IconButton>
                </Box>
              </TableCell>
              <TableCell align="right">${Number(i.precioUnitario).toLocaleString("es-CO")}</TableCell>
              <TableCell align="right">${(i.precioUnitario * i.cantidad).toLocaleString()}</TableCell>
              <TableCell align="center"><IconButton color="error" onClick={()=>onRemove(i.idProducto)}><DeleteIcon/></IconButton></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center", mt:2 }}>
        <Typography variant="h6">TOTAL</Typography>
        <Typography variant="h4">${total.toLocaleString()}</Typography>
      </Box>
    </Paper>
  );
};

export default CartPanel;
