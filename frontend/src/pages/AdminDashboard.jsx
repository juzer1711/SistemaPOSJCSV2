import React from "react";
import { Box, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Gestión de Usuarios",
      description: "Administra y gestiona los usuarios del sistema.",
      icon: <PeopleIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      action: () => navigate("/gestion-usuarios"),
    },
    {
      title: "Gestión de Productos",
      description: "Administra y gestiona todos los productos.",
      icon: <PeopleIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      action: () => navigate("/gestion-productos"),
    },
    {
      title: "Gestión de Clientes",  // Nueva tarjeta para gestionar clientes
      description: "Administra y gestiona los clientes del sistema.",
      icon: <PeopleIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      action: () => navigate("/gestion-clientes"),  // Redirige a la nueva página
    },
    {
      title: "Gestión de Ventas",  // Nueva tarjeta para gestionar clientes
      description: "Administra y gestiona las ventas del sistema.",
      icon: <PeopleIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      action: () => navigate("/mostrar-ventas"),  // Redirige a la nueva página
    },
    {
      title: "Nueva Venta",  // Nueva tarjeta para gestionar clientes
      description: "Registra una nueva venta al sistema.",
      icon: <ShoppingBagOutlinedIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      action: () => navigate("/nueva-venta"),  // Redirige a la nueva página
    },
    {
      title: "Reportes",
      description: "Consulta reportes detallados de ventas y actividades.",
      icon: <BarChartIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      action: () => navigate("/reportes"),
    },
    {
      title: "Configuración del Sistema",
      description: "Ajustes generales y parámetros de operación.",
      icon: <SettingsIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      action: () => navigate("/configuracion"),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Panel del Administrador
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": { boxShadow: 6, transform: "scale(1.03)" },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  {card.icon}
                </Box>
                <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                  {card.title}
                </Typography>
                <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                  {card.description}
                </Typography>
                <Box sx={{ textAlign: "center" }}>
                  <Button variant="contained" onClick={card.action}>
                    Ir
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
