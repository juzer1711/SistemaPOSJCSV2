import React, { useMemo, useState } from "react";
import {
  Paper,
  TextField,
  Grid,
  Card,
  Typography,
  CardActionArea,
  Box,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const ProductCard = ({ p, onAdd }) => (
  <Card
    sx={{
      borderRadius: 2,
      height: 120,
      display: "flex",
    }}
  >
    <CardActionArea
      onClick={() => onAdd(p)}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="subtitle2" noWrap fontWeight={600}>
        {p.nombre}
      </Typography>

      <Typography variant="h6" color="primary" fontWeight="bold">
        ${Number(p.precioventa).toLocaleString("es-CO")}
      </Typography>

      <Typography variant="caption" color="text.secondary">
        Stock: {p.stock ?? "-"}
      </Typography>
    </CardActionArea>
  </Card>
);

const ProductSidebar = ({ productos, onAdd = () => {} }) => {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return productos;
    return productos.filter(
      (p) =>
        p.nombre?.toLowerCase().includes(t) ||
        p.codigoBarras?.toString().includes(t)
    );
  }, [productos, q]);

  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      {/* Buscador fijo */}
      <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
        <TextField
          fullWidth
          placeholder="Buscar producto o escanear código..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Lista con scroll REAL */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
        }}
      >
        <Grid container spacing={2}>
          {filtered.map((p) => (
            <Grid key={p.idProducto} item xs={12}>
              <ProductCard p={p} onAdd={onAdd} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default ProductSidebar;