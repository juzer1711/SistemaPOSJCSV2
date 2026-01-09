import React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Button, Chip
} from "@mui/material";
import { Edit, CheckCircle, Cancel} from "@mui/icons-material";

const ProductTable = ({ products, onEdit, onDelete, onActivate, loading, visibleColumns }) => {
  const formatIVA = (iva) => {
  if (!iva) return "—";

  // Extrae solo el número del enum (19, 5, 0)
  const number = iva.replace("IVA_", "");

  return `${number} %`;
};
return (
  <TableContainer component={Paper} sx={{ maxHeight: 500, overflowX: "auto" }}>
    <Table sx={{ minWidth: 1200 }} size="small">
      <TableHead>
        <TableRow>
          {visibleColumns.idProducto && <TableCell>ID</TableCell>}
          {visibleColumns.nombre && <TableCell>Nombre</TableCell>}
          {visibleColumns.categoria && <TableCell>Categoria</TableCell>}
          {visibleColumns.codigoBarras && <TableCell>Codigo de Barras</TableCell>}
          {visibleColumns.descripcion && <TableCell>Descripcion</TableCell>}
          {visibleColumns.costo && <TableCell>Costo</TableCell>}
          {visibleColumns.precioventa && <TableCell>Precio de Venta</TableCell>}
          {visibleColumns.iva && <TableCell>IVA</TableCell>}
          {visibleColumns.precioSinIva && <TableCell>Precio sin IVA</TableCell>}
          {visibleColumns.estado && <TableCell>Estado</TableCell>}
          {visibleColumns.acciones && <TableCell align="center">Acciones</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {products.length > 0 ? (
          products.map((p) => {
            const active = p.estado === 1 || p.estado === true;
            return (
            <TableRow key={p.idProducto}>
              {visibleColumns.idProducto && <TableCell>{p.idProducto}</TableCell>}
              {visibleColumns.nombre && <TableCell>{p.nombre}</TableCell>}
              {visibleColumns.categoria && <TableCell>{p.categoria.nombre}</TableCell>}
              {visibleColumns.codigoBarras && <TableCell>{p.codigoBarras}</TableCell>}
              {visibleColumns.descripcion && <TableCell>{p.descripcion}</TableCell>}
              {visibleColumns.costo && <TableCell>{p.costo}</TableCell>}
              {visibleColumns.precioventa && <TableCell>{p.precioventa}</TableCell>}
              {visibleColumns.iva && <TableCell>{formatIVA(p.iva)}</TableCell>}
              {visibleColumns.precioSinIva && <TableCell>{p.precioSinIva}</TableCell>}
              {visibleColumns.estado &&(
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
              )}
              {visibleColumns.acciones && (
              <TableCell align="center">
                <IconButton size="small" onClick={() => onEdit(p)}>
                  <Edit />
                </IconButton>

                {active ? (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => onDelete(p.idProducto)}
                      sx={{ ml: 1 }}
                    >
                      Desactivar
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => onActivate(p.idProducto)}
                      sx={{ ml: 1 }}
                    >
                      Activar
                    </Button>
                  )}
              </TableCell>
              )}
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
};
export default ProductTable;
