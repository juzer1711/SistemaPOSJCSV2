import React from "react";
import {
  Box, Grid, Card, CardContent,
  Typography, Chip, Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

// Íconos — uno único por módulo, sin repetición
import PeopleIcon        from "@mui/icons-material/People";
import PersonIcon        from "@mui/icons-material/Person";
import Inventory2Icon    from "@mui/icons-material/Inventory2";
import ShoppingCartIcon  from "@mui/icons-material/ShoppingCart";
import PointOfSaleIcon   from "@mui/icons-material/PointOfSale";
import WarehouseIcon     from "@mui/icons-material/Warehouse";
import ReceiptLongIcon   from "@mui/icons-material/ReceiptLong";
import BarChartIcon      from "@mui/icons-material/BarChart";
import ArrowForwardIcon  from "@mui/icons-material/ArrowForward";

import { styles } from "../styles/dashboard/stylesAdminDashboard";

// ── Paleta semántica por categoría de módulo ──────────────────────────
// Usa colores de tu tema: alpha del primary/secondary/success/etc.
const MODULE_SECTIONS = [
  {
    label: "Gestión del sistema",
    items: [
      {
        title: "Usuarios",
        description: "Crea, edita y controla los accesos de cada persona al sistema.",
        icon: PeopleIcon,
        iconBg: "#e3f2fd",   // azul suave
        iconColor: "#1565c0",
        route: "/gestion-usuarios",
      },
      {
        title: "Clientes",
        description: "Administra personas naturales y empresas registradas.",
        icon: PersonIcon,
        iconBg: "#ede7f6",   // púrpura suave
        iconColor: "#6a1b9a",
        route: "/gestion-clientes",
      },
      {
        title: "Productos",
        description: "Catálogo completo de artículos, precios e IVA.",
        icon: Inventory2Icon,
        iconBg: "#fff3e0",   // naranja suave
        iconColor: "#e65100",
        route: "/gestion-productos",
      },
    ],
  },
  {
    label: "Operaciones",
    items: [
      {
        title: "Nueva Venta",
        description: "Registra una venta directamente en el punto de venta.",
        icon: ShoppingCartIcon,
        iconBg: "#e8f5e9",   // verde suave
        iconColor: "#2e7d32",
        route: "/nueva-venta",
      },
      {
        title: "Cajas",
        description: "Abre, cierra y monitorea las cajas activas del sistema.",
        icon: PointOfSaleIcon,
        iconBg: "#e0f2f1",   // teal suave
        iconColor: "#00695c",
        route: "/gestion-cajas",
      },
      {
        title: "Inventario",
        description: "Controla el stock y los movimientos de productos.",
        icon: WarehouseIcon,
        iconBg: "#fff8e1",   // ámbar suave
        iconColor: "#f57f17",
        route: "/inventario",
      },
    ],
  },
  {
    label: "Análisis",
    items: [
      {
        title: "Ventas",
        description: "Historial completo y detalle de todas las transacciones.",
        icon: ReceiptLongIcon,
        iconBg: "#fce4ec",   // rosa suave
        iconColor: "#880e4f",
        route: "/mostrar-ventas",
      },
      {
        title: "Reportes",
        description: "Estadísticas, gráficas y análisis de actividad del negocio.",
        icon: BarChartIcon,
        iconBg: "#e8eaf6",   // índigo suave
        iconColor: "#283593",
        route: "/reportes",
      },
    ],
  },
];

// ── Subcomponente: tarjeta de módulo ─────────────────────────────────
const ModuleCard = ({ item, onClick }) => {
  const IconComponent = item.icon;
  return (
    <Card sx={styles.card} onClick={onClick}>
      <CardContent sx={styles.cardContent}>
        {/* Ícono con fondo de color semántico */}
        <Box sx={styles.iconWrapper(item.iconBg)}>
          <IconComponent sx={{ fontSize: 26, color: item.iconColor }} />
        </Box>

        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {item.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, lineHeight: 1.6 }}>
          {item.description}
        </Typography>

        {/* Flecha al final — reemplaza el botón "Ir" */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 2, color: "primary.main" }}>
          <Typography variant="caption" fontWeight={600} sx={{ mr: 0.5 }}>
            Ir al módulo
          </Typography>
          <ArrowForwardIcon sx={{ fontSize: 14 }} />
        </Box>
      </CardContent>
    </Card>
  );
};

// ── Página principal ─────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate  = useNavigate();
  const theme     = useTheme();
  const username  = localStorage.getItem("username") || "Administrador";
  const role      = localStorage.getItem("role")     || "ADMINISTRADOR";

  // Saludo dinámico según la hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "¡Buenos días";
    if (hour < 18) return "¡Buenas tardes";
    return "¡Buenas noches";
  };

  const today = new Date().toLocaleDateString("es-CO", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <Box sx={styles.page}>

      {/* ── Barra de bienvenida ── */}
      <Box sx={styles.welcomeBar(theme)}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {getGreeting()}, {username}! 👋
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, textTransform: "capitalize" }}>
            {today}
          </Typography>
        </Box>
        <Chip
          label={role}
          size="small"
          sx={styles.roleBadge(theme)}
        />
      </Box>

      {/* ── Secciones de módulos ── */}
      {MODULE_SECTIONS.map((section) => (
        <Box key={section.label} sx={{ mb: 4 }}>

          {/* Etiqueta de sección */}
          <Typography sx={styles.sectionLabel}>
            {section.label}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2.5}>
            {section.items.map((item) => (
              <Grid
                key={item.title}
                size={{ xs: 12, sm: 6, md: 4 }}
              >
                <ModuleCard
                  item={item}
                  onClick={() => navigate(item.route)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default AdminDashboard;