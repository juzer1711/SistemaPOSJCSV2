import React from "react";
import { Box, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import HistoryIcon from "@mui/icons-material/History";
import { useNavigate } from "react-router-dom";

const CajeroDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Nueva Venta",
      description: "Realiza una nueva transacción de venta.",
      icon: <PointOfSaleIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      action: () => navigate("/nueva-venta"),
    },
    {
      title: "Inventario",
      description: "Consulta productos y existencias disponibles.",
      icon: <Inventory2Icon sx={{ fontSize: 40, color: "primary.main" }} />,
      action: () => navigate("/inventario"),
    },
    {
      title: "Historial de Ventas",
      description: "Revisa tus ventas realizadas y detalles.",
      icon: <HistoryIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      action: () => navigate("/historial"),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Panel del Cajero
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

export default CajeroDashboard;
