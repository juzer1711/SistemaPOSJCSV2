import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip
} from "@mui/material";
import { Edit, Delete, CheckCircle, Block } from "@mui/icons-material";

const ProductTable = ({ products, onEdit, onToggleState, loading }) => (
  <TableContainer component={Paper}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Categoría</TableCell>
          <TableCell>Precio venta</TableCell>
          <TableCell>Costo</TableCell>
          <TableCell>Estado</TableCell>
          <TableCell align="center">Acciones</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {products.length > 0 ? (
          products.map((p) => (
            <TableRow key={p.idProducto}>
              <TableCell>{p.idProducto}</TableCell>
              <TableCell>{p.nombre}</TableCell>
              <TableCell>{p.categoria}</TableCell>
              <TableCell>${p.precioventa}</TableCell>
              <TableCell>${p.costo}</TableCell>

              <TableCell>
                <Chip
                  label={p.estado}
                  color={p.estado === "ACTIVO" ? "success" : "default"}
                  size="small"
                />
              </TableCell>

              <TableCell align="center">
                {/* EDITAR */}
                <IconButton size="small" onClick={() => onEdit(p)}>
                  <Edit />
                </IconButton>

                {/* ACTIVAR / DESACTIVAR */}
                <IconButton
                  size="small"
                  color={p.estado === "ACTIVO" ? "error" : "success"}
                  onClick={() => onToggleState(p)}
                >
                  {p.estado === "ACTIVO" ? <Block /> : <CheckCircle />}
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} align="center">
              {loading ? "Cargando..." : "No hay productos"}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default ProductTable;
