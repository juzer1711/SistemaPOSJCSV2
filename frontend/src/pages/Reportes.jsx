import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";

import {
  getReporteResumen,
  getVentasPorMetodoPago,
  getTopProductos,
  getVentasPorCajero,
  getStock,
} from "../services/reportesService";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const Reportes = () => {
  // ── Estados ─────────────────────────────────────
  const navigate = useNavigate();

  const [resumen, setResumen] = useState(null);
  const [metodos, setMetodos] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [cajeros, setCajeros] = useState([]);
  const [stock, setStock] = useState([]);

  const [tipoStock, setTipoStock] = useState("bajo");
  const [loading, setLoading] = useState(true);
  const [filtroStock, setFiltroStock] = useState("BAJO");

  const stockFiltrado = stock.filter((p) => {
    if (filtroStock === "CRITICO") return p.stockActual <= 0;

    if (filtroStock === "BAJO")
      return p.stockActual > 0 && p.stockActual <= p.stockMinimo;

    if (filtroStock === "NORMAL")
      return p.stockMinimo > 0 && p.stockActual > p.stockMinimo;

    return true;
  });

  // ── Cargar datos ───────────────────────────────
  const loadData = async () => {
    setLoading(true);
    try {
      const [resResumen, resMetodos, resTop, resCajeros, resStock] =
        await Promise.all([
          getReporteResumen(),
          getVentasPorMetodoPago(),
          getTopProductos(),
          getVentasPorCajero(),
          getStock("TODOS"),
        ]);

      setResumen(resResumen.data);
      setMetodos(resMetodos.data);
      setTopProductos(resTop.data);
      setCajeros(resCajeros.data);
      setStock(resStock.data);
    } catch (error) {
      console.log("Error cargando reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tipoStock]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  const COLORS = {
    EFECTIVO: "#2e7d32",     
    TRANSFERENCIA: "#1976d2", 
  };

  const fecha = new Date();

  const fechafull = fecha.toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const horafull = fecha.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Box sx={{ p: 3 }}>

      {/* ── HEADER ── */}
      <Typography variant="h5" fontWeight={700}>
        📊 Reportes del sistema
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Análisis general del negocio
      </Typography>

      {/* ── RESUMEN CARDS ── */}
      <Grid container spacing={2} mb={3}>

        {/* VENTAS HOY */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              border: "1px solid #eee",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
              },
            }}
          >
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Ventas hoy
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {resumen?.ventasHoy?.toLocaleString("es-CO") || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* VENTAS MES */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              border: "1px solid #eee",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
              },
            }}
          >
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Ventas mes
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {resumen?.ventasMes?.toLocaleString("es-CO") || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* TOTAL FACTURADO */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              border: "1px solid #eee",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
              },
            }}
          >
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Total facturado
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                ${resumen?.totalFacturado?.toLocaleString("es-CO") || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* IVA */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              border: "1px solid #eee",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
              },
            }}
          >
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                IVA recaudado
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                ${resumen?.ivaRecaudado?.toLocaleString("es-CO") || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 🕒 FECHA Y HORA */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              border: "1px solid #eee",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
              },
            }}
          >
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Fecha actual
              </Typography>

              <Typography variant="body1" fontWeight={600}>
                {fechafull}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {horafull}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* ── STOCK PRODUCTOS ── */}
      <Typography fontWeight={700} mb={1}>
         Stock de productos
      </Typography>

      {/* BOTONES FILTRO */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button
          variant={filtroStock === "CRITICO" ? "contained" : "outlined"}
          color="error"
          onClick={() => setFiltroStock("CRITICO")}
        >
          🔴 Crítico
        </Button>

        <Button
          variant={filtroStock === "BAJO" ? "contained" : "outlined"}
          color="warning"
          onClick={() => setFiltroStock("BAJO")}
        >
          🟡 Bajo
        </Button>

        <Button
          variant={filtroStock === "NORMAL" ? "contained" : "outlined"}
          color="success"
          onClick={() => setFiltroStock("NORMAL")}
        >
          🟢 Normal
        </Button>
      </Box>
        {filtroStock === "CRITICO" && (
          <Box sx={{ mb: 2 }}>
            
            <Typography variant="body2" color="error" sx={{ mb: 1 }}>
              Estos productos necesitan reposición inmediata
            </Typography>

          </Box>
        )}

      

      {/* LISTA FILTRADA */}
      {stockFiltrado.map((p, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            py: 1,
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography>{p.producto}</Typography>

          <Typography fontWeight={700}>
            {p.stockActual} / {p.stockMinimo}
          </Typography>
        </Box>
      ))}

      {/* BOTÓN FINAL */}
      {filtroStock === "CRITICO" && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-start" }}>
          <Button
            variant="contained"
            onClick={() => navigate("/inventario")}
            sx={{
              backgroundColor: "#f9a825",
              color: "#ffffff",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#f57f17",
              },
            }}
          >
            Ir a inventario
          </Button>
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      {/* ── TOP PRODUCTOS ── */}
      <Typography fontWeight={700} mb={1}>
         Top productos
      </Typography>

      {topProductos?.length > 0 && (() => {
        const maxValue = Math.max(...topProductos.map(p => p.cantidad || 0));

        return topProductos.map((p, i) => {
          const percent = maxValue ? (p.cantidad / maxValue) * 100 : 0;

          return (
            <Box key={i} sx={{ mb: 2 }}>

              {/* Nombre + valor */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography fontSize={14}>
                  {p.producto}
                </Typography>

                <Typography fontWeight={700} fontSize={14}>
                  {p.cantidad}
                </Typography>
              </Box>

              {/* Barra de fondo */}
              <Box
                sx={{
                  height: 10,
                  backgroundColor: "#e0e0e0",
                  borderRadius: 5,
                  overflow: "hidden",
                }}
              >
                {/* Barra activa */}
                <Box
                  sx={{
                    height: "100%",
                    width: `${percent}%`,
                    backgroundColor: "#1976d2",
                    borderRadius: 5,
                    transition: "width 0.5s ease",
                  }}
                />
              </Box>

            </Box>
          );
        });
      })()}

      <Divider sx={{ my: 3 }} />

      {/* ── MÉTODOS DE PAGO ── */}
      <Typography fontWeight={700} mt={4} mb={1}>
         Métodos de pago
      </Typography>

      <Box sx={{ width: "100%", height: 320, backgroundColor: "background.paper", p: 2, borderRadius: 3, boxShadow: 1 }}>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>

            <Pie
              data={metodos}
              dataKey="total"
              nameKey="metodoPago"
              outerRadius={110}
              label
            >
              {metodos.map((entry) => (
                <Cell
                  key={entry.metodoPago}
                  fill={COLORS[entry.metodoPago]}
                />
              ))}
            </Pie>

          </PieChart>
        </ResponsiveContainer>

        <Box sx={{ display: "flex", gap: 3, justifyContent: "center", mt: 2 }}>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#2e7d32" }} />
            <span>Efectivo</span>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#1976d2" }} />
            <span>Transferencia</span>
          </Box>

        </Box>

      </Box>

      <Divider sx={{ my: 3 }} />

      {/* ── CAJEROS ── */}
      <Typography fontWeight={700} mt={4} mb={1}>
         Ventas por cajero
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
        {cajeros.map((c, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.5,
              borderRadius: 2,
              backgroundColor: "background.paper",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              border: "1px solid",
              borderColor: "divider",
              transition: "0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              },
            }}
          >
            {/* IZQUIERDA: ranking + nombre */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  backgroundColor: i === 0 ? "#ffd700" : i === 1 ? "#c0c0c0" : i === 2 ? "#cd7f32" : "primary.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {i + 1}
              </Box>

              <Typography fontWeight={600}>
                {c.cajero}
              </Typography>
            </Box>

            {/* DERECHA: ventas */}
            <Typography fontWeight={700} color="primary.main">
              ${Number(c.ventas).toLocaleString("es-CO")}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Reportes;