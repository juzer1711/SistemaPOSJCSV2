import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Sistema POS JCS
        </Typography>

        {/* 🔹 Opciones de navegación según el rol */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {role === "ADMINISTRADOR" && (
            <>
              <Button color="inherit" onClick={() => navigate("/admin-dashboard")}>
                Inicio
              </Button>
              <Button color="inherit" onClick={() => navigate("/gestion-usuarios")}>
                Usuarios
              </Button>
              <Button color="inherit" onClick={() => navigate("/gestion-clientes")}>
                Clientes
              </Button>
              <Button color="inherit" onClick={() => navigate("/gestion-productos")}>
                Productos
              </Button>
              <Button color="inherit" onClick={() => navigate("/mostrar-ventas")}>
                Ventas
              </Button>
              <Button color="inherit" onClick={() => navigate("/gestion-cajas")}>
                Cajas
              </Button>
              <Button color="inherit" onClick={() => navigate("/reportes")}>
                Reportes
              </Button>
            </>
          )}

          {role === "CAJERO" && (
            <>
              <Button color="inherit" onClick={() => navigate("/cajero-dashboard")}>
                Inicio
              </Button>
              <Button color="inherit" onClick={() => navigate("/ventas")}>
                Ventas
              </Button>
              <Button color="inherit" onClick={() => navigate("/inventario")}>
                Inventario
              </Button>
            </>
          )}
        </Box>

        {/* 🔹 Menú de usuario (perfil / logout) */}
        <div>
          <IconButton
            size="large"
            color="inherit"
            onClick={handleMenu}
            sx={{ ml: 2 }}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem disabled>Usuario: {username}</MenuItem>
            <MenuItem disabled>Rol: {role}</MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
