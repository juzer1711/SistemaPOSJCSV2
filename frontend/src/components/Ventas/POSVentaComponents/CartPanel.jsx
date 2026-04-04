import React, { useMemo } from "react";
import {
  Paper,
  Typography,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const CartItem = ({ i, onChangeQty, onRemove }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 2,
      mb: 1.5,
      border: "1px solid #e0e0e0",
      backgroundColor: "#fafafa",
    }}
  >
    <Typography fontWeight={600} noWrap>
      {i.nombre}
    </Typography>

    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mt: 1,
      }}
    >
      {/* Precio unitario */}
      <Typography variant="body2" color="text.secondary">
        ${Number(i.precioUnitario).toLocaleString("es-CO")}
      </Typography>

      {/* Cantidad */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          size="small"
          onClick={() =>
            onChangeQty(i.idProducto, Math.max(1, i.cantidad - 1))
          }
        >
          <RemoveIcon fontSize="small" />
        </IconButton>

        <Typography fontWeight={600}>{i.cantidad}</Typography>

        <IconButton
          size="small"
          onClick={() =>
            onChangeQty(i.idProducto, i.cantidad + 1)
          }
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Subtotal */}
      <Typography fontWeight="bold">
        ${(i.precioUnitario * i.cantidad).toLocaleString("es-CO")}
      </Typography>

      {/* Eliminar */}
      <IconButton color="error" onClick={() => onRemove(i.idProducto)}>
        <DeleteIcon />
      </IconButton>
    </Box>
  </Box>
);

const CartPanel = ({ items = [], onChangeQty = () => {}, onRemove = () => {} }) => {
  const total = useMemo(
    () =>
      items.reduce(
        (acc, i) => acc + Number(i.precioUnitario) * Number(i.cantidad),
        0
      ),
    [items]
  );

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
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
        <Typography variant="h6">Carrito de compra</Typography>
      </Box>

      {/* Lista con scroll */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {items.length === 0 ? (
          <Typography color="text.secondary">
            🛒 Aún no hay productos en el carrito
          </Typography>
        ) : (
          items.map((i) => (
            <CartItem
              key={i.idProducto}
              i={i}
              onChangeQty={onChangeQty}
              onRemove={onRemove}
            />
          ))
        )}
      </Box>

      <Divider />

      {/* Total fijo abajo tipo POS */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "#f5f5f5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">TOTAL</Typography>
        <Typography variant="h4" fontWeight="bold" color="primary">
          ${total.toLocaleString("es-CO")}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CartPanel;