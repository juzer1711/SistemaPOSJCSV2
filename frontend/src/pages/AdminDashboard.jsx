import React from "react";
import { Box, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import PersonIcon from "@mui/icons-material/Person";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Gestión de Usuarios",
      description: "Administra y gestiona los usuarios del sistema.",
      icon: <PeopleIcon sx={{ fontSize: 60, color: "primary.main" }} />,
      action: () => navigate("/gestion-usuarios"),
    },
    {
      title: "Gestión de Productos",
      description: "Administra y gestiona todos los productos.",
      icon: <InventoryIcon sx={{ fontSize: 60, color: "primary.main" }} />,
      action: () => navigate("/gestion-productos"),
    },
    {
      title: "Gestión de Clientes",
      description: "Administra y gestiona los clientes del sistema.",
      icon: <PersonIcon sx={{ fontSize: 60, color: "primary.main" }} />,
      action: () => navigate("/gestion-clientes"),
    },
    {
      title: "Gestión de Ventas",
      description: "Administra y gestiona las ventas del sistema.",
      icon: <PointOfSaleIcon sx={{ fontSize: 60, color: "primary.main" }} />,
      action: () => navigate("/mostrar-ventas"),
    },
    {
      title: "Gestión de Cajas",
      description: "Administra y gestiona las cajas en activo del sistema.",
      icon: <PointOfSaleIcon sx={{ fontSize: 60, color: "primary.main" }} />,
      action: () => navigate("/gestion-cajas"),
    },
    {
      title: "Inventario",
      description: "Administra y gestiona el stock de tus productos.",
      icon: <InventoryIcon sx={{ fontSize: 60, color: "primary.main" }} />,
      action: () => navigate("/inventario"),
    },
    {
      title: "Nueva Venta",
      description: "Registra una nueva venta al sistema.",
      icon: <ShoppingCartIcon sx={{ fontSize: 60, color: "primary.main" }} />,
      action: () => navigate("/nueva-venta"),
    },
    {
      title: "Reportes",
      description: "Consulta reportes detallados de ventas y actividades.",
      icon: <BarChartIcon sx={{ fontSize: 60, color: "primary.main" }} />,
      action: () => navigate("/reportes"),
    },
    {
      title: "Configuración del Sistema",
      description: "Ajustes generales y parámetros de operación.",
      icon: <SettingsIcon sx={{ fontSize: 60, color: "primary.main" }} />,
      action: () => navigate("/configuracion"),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Panel del Administrador
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {cards.map((card, index) => (
          <Grid
            size={{xs:4, sm:6, md:4}}
            key={index}
            sx={{
              display: "flex",
              justifyContent: index === 6 ? "center" : "flex-start",
            }}
          >
            <Card
              sx={{
                width: "100%",
                height: 260,
                borderRadius: 4,
                boxShadow: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "center",
                p: 3,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 8,
                },
              }}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>{card.icon}</Box>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {card.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mb: 3, color: "text.secondary" }}
                >
                  {card.description}
                </Typography>

                <Button variant="contained" onClick={card.action}>
                  Ir
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;