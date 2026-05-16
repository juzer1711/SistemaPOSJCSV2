import React, { useState } from "react";
import {
  AppBar, Toolbar, Typography, Button, Box,
  IconButton, Menu, MenuItem, Drawer, List,
  ListItemButton, ListItemIcon, ListItemText,
  Divider, Avatar, Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Storefront as StorefrontIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Inventory2 as Inventory2Icon,
  ReceiptLong as ReceiptLongIcon,
  PointOfSale as PointOfSaleIcon,
  Warehouse as WarehouseIcon,
  BarChart as BarChartIcon,
  ShoppingCart as ShoppingCartIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

// ── Rutas por rol ────────────────────────────────────────────────────
const NAV_ADMIN = [
  { label: "Inicio",      path: "/admin-dashboard",   icon: HomeIcon },
  { label: "Usuarios",    path: "/gestion-usuarios",  icon: PeopleIcon },
  { label: "Clientes",    path: "/gestion-clientes",  icon: PersonIcon },
  { label: "Productos",   path: "/gestion-productos", icon: Inventory2Icon },
  { label: "Ventas",      path: "/mostrar-ventas",    icon: ReceiptLongIcon },
  { label: "Cajas",       path: "/gestion-cajas",     icon: PointOfSaleIcon },
  { label: "Inventario",  path: "/inventario",        icon: WarehouseIcon },
  { label: "Reportes",    path: "/reportes",          icon: BarChartIcon },
];

const NAV_CAJERO = [
  { label: "Inicio",    path: "/cajero-dashboard",  icon: HomeIcon },
  { label: "Ventas",    path: "/nueva-venta",        icon: ShoppingCartIcon },
  { label: "Clientes",  path: "/gestion-clientes",  icon: PersonIcon },
];

// ── Helper: iniciales del usuario ────────────────────────────────────
const getInitials = (name = "") =>
  name.trim().split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

// ── Helper: color del avatar desde el nombre ─────────────────────────
const AVATAR_COLORS = [
  "#1565c0","#6a1b9a","#2e7d32","#e65100","#00695c","#880e4f","#283593",
];
const getAvatarColor = (name = "") => {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx] ?? "#1565c0";
};

const Navbar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const theme     = useTheme();

  const role     = localStorage.getItem("role");
  const username = localStorage.getItem("username") || "";

  const navItems = role === "ADMINISTRADOR" ? NAV_ADMIN : NAV_CAJERO;
  const initials = getInitials(username);
  const avatarBg = getAvatarColor(username);

  // ── Estado del menú de perfil (desktop) ──
  const [anchorEl, setAnchorEl]       = useState(null);
  const handleMenuOpen  = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = ()  => setAnchorEl(null);

  // ── Estado del Drawer (móvil) ──
  const [drawerOpen, setDrawerOpen]   = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setDrawerOpen(false); // cierra el drawer al navegar
  };

  // ── ¿Está activa esta ruta? ──────────────────────────────────────
  const isActive = (path) => location.pathname === path;

  // ── Estilos del botón de nav activo/inactivo ────────────────────
  const navBtnSx = (path) => ({
    color: "inherit",
    fontSize: 13,
    fontWeight: isActive(path) ? 700 : 500,
    px: 1.4,
    py: 0.6,
    borderRadius: 1.5,
    opacity: isActive(path) ? 1 : 0.82,
    backgroundColor: isActive(path) ? "rgba(255,255,255,0.18)" : "transparent",
    borderBottom: isActive(path) ? "2px solid rgba(255,255,255,0.9)" : "2px solid transparent",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.12)",
      opacity: 1,
    },
    transition: "all 0.15s ease",
  });

  return (
    <>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar sx={{ gap: 0.5, minHeight: 56 }}>

          {/* ── Branding ── */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
            <StorefrontIcon sx={{ fontSize: 22, opacity: 0.9 }} />
            <Typography variant="h6" fontWeight={700} letterSpacing={-0.3} noWrap>
              POS JCS
            </Typography>
          </Box>

          {/* ── Links de navegación — solo desktop ── */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, flexGrow: 1, flexWrap: "nowrap" }}>
            {navItems.map(({ label, path }) => (
              <Button key={path} sx={navBtnSx(path)} onClick={() => navigate(path)}>
                {label}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

          {/* ── Avatar con menú de perfil — desktop ── */}
          <Tooltip title={username} arrow>
            <Avatar
              onClick={handleMenuOpen}
              sx={{
                width: 34,
                height: 34,
                fontSize: 13,
                fontWeight: 700,
                bgcolor: avatarBg,
                border: "2px solid rgba(255,255,255,0.4)",
                cursor: "pointer",
                display: { xs: "none", md: "flex" },
                ml: 1,
              }}
            >
              {initials}
            </Avatar>
          </Tooltip>

          {/* Menú desplegable del perfil */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              elevation: 4,
              sx: { minWidth: 210, borderRadius: 2, mt: 0.5 },
            }}
          >
            {/* Header del menú */}
            <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ width: 36, height: 36, fontSize: 13, fontWeight: 700, bgcolor: avatarBg }}>
                  {initials}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} noWrap>
                    {username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {role}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <MenuItem
              onClick={() => { handleMenuClose(); handleLogout(); }}
              sx={{ mt: 0.5, color: "error.main", gap: 1.5 }}
            >
              <LogoutIcon fontSize="small" />
              Cerrar sesión
            </MenuItem>
          </Menu>

          {/* ── Avatar + Hamburguesa — solo móvil ── */}
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 30, height: 30, fontSize: 11, fontWeight: 700, bgcolor: avatarBg }}>
              {initials}
            </Avatar>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)} aria-label="Abrir menú">
              <MenuIcon />
            </IconButton>
          </Box>

        </Toolbar>
      </AppBar>

      {/* ── Drawer lateral — móvil ───────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 260, borderRadius: "12px 0 0 12px" } }}
      >
        {/* Header del drawer */}
        <Box
          sx={{
            px: 2.5,
            py: 2,
            backgroundColor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Avatar sx={{ width: 40, height: 40, fontSize: 14, fontWeight: 700, bgcolor: avatarBg, border: "2px solid rgba(255,255,255,0.4)" }}>
            {initials}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={700} noWrap>
              {username}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {role}
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* Items de navegación */}
        <List sx={{ pt: 1 }}>
          {navItems.map(({ label, path, icon: Icon }) => (
            <ListItemButton
              key={path}
              onClick={() => handleNavigate(path)}
              selected={isActive(path)}
              sx={{
                borderRadius: 2,
                mx: 1,
                mb: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "primary.light",
                  color: "primary.dark",
                  "& .MuiListItemIcon-root": { color: "primary.dark" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{ fontSize: 14, fontWeight: isActive(path) ? 700 : 400 }}
              />
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ mt: "auto" }} />

        {/* Cerrar sesión al fondo del drawer */}
        <ListItemButton
          onClick={handleLogout}
          sx={{ color: "error.main", mx: 1, mb: 1, borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "error.main" }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Cerrar sesión"
            primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
          />
        </ListItemButton>
      </Drawer>
    </>
  );
};

export default Navbar;