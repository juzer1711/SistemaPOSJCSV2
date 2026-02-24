import React, { useMemo, useState } from "react";
import {
  Paper, TextField, Grid, Card, CardContent, Typography, CardActionArea, Box
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const ProductCard = ({ p, onAdd }) => (
  <Card elevation={2}>
    <CardActionArea onClick={() => onAdd(p)}>
      <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" noWrap>{p.nombre}</Typography>
          <Typography variant="subtitle2">Stock: {p.stock ?? "-"}</Typography>
        </Box>
        <Typography variant="h6">${Number(p.precioventa).toLocaleString("es-CO")}</Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

const ProductSidebar = ({ productos, onAdd = () => {} }) => {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return productos;
    return productos.filter(p =>
      p.nombre?.toLowerCase().includes(t) ||
      p.codigoBarras?.toString().includes(t)
    );
  }, [productos, q]);

  return (
    <Paper elevation={3} sx={{ p: 2, height: "calc(100vh - 48px)", overflow: "auto" }}>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <SearchIcon color="action" />
        <TextField fullWidth size="small" placeholder="Buscar producto por nombre o código..." value={q} onChange={e=>setQ(e.target.value)} />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Grid container spacing={1}>
          {filtered.map(p => (
            <Grid key={p.idProducto} item xs={6}>
              <ProductCard p={p} onAdd={onAdd} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default ProductSidebar;
