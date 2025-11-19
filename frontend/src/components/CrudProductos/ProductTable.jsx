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
  Button,
  Chip
} from "@mui/material";
import { Edit, CheckCircle, Cancel} from "@mui/icons-material";

const ProductTable = ({ products, onEdit, onDelete, onActivate, loading }) => (
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
        </TableRow>
      </TableHead>

      <TableBody>
        {products.length > 0 ? (
          products.map((p) => {
            const active = p.estado === 1 || p.estado === true;
            return (
            <TableRow key={p.idProducto}>
              <TableCell>{p.idProducto}</TableCell>
              <TableCell>{p.nombre}</TableCell>
              <TableCell>{p.categoria}</TableCell>
              <TableCell>${p.precioventa}</TableCell>
              <TableCell>${p.costo}</TableCell>
              <TableCell>
                  <Chip
                    icon={active ? <CheckCircle /> : <Cancel />}
                    label={active ? "ACTIVO" : "INACTIVO"}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderRadius: "6px",
                      fontWeight: "bold",
                      animation: "fadeIn 0.3s ease-in-out",
                      bgcolor: active ? "rgba(46, 125, 50, 0.1)" : "rgba(158, 158, 158, 0.1)",
                      color: active ? "success.main" : "text.secondary",
                      borderColor: active ? "success.main" : "text.secondary",
                    }}
                  />
              </TableCell>

              <TableCell align="center">
                {/* EDITAR */}
                <IconButton size="small" onClick={() => onEdit(p)}>
                  <Edit />
                </IconButton>

                {/* ACTIVAR / DESACTIVAR */}
                {active? (
                  <Button variant="outlined" color="error" onClick={() => onDelete(p.idProducto)} sx={{ ml: 1 }}>
                    Desactivar
                  </Button>
                ) : (
                  <Button variant="outlined" color="primary" onClick={() => onActivate(p.idProducto)} sx={{ ml: 1 }}>
                    Activar
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        }) 
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
