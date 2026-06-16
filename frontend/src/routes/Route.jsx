import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEmpresa } from "../context/EmpresaContext";
import { CircularProgress, Box } from "@mui/material";

// Pages
import LandingPage from "../pages/LandingPage";
import RegistroEmpresa from "../pages/RegistroEmpresa";
import EmpresaProfile from "../pages/EmpresaProfile";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import CajeroDashboard from "../pages/CajeroDashboard";
import UserManagement from "../pages/UserManagement";
import ProductManagement from "../pages/ProductManagement";
import ClientManagement from "../pages/ClientManagement";
import VentaManagement from "../pages/VentaManagement";
import AuditoriaManagement from "../pages/AuditoriaManagement";
import VentaPOS from "../pages/POSVenta";
import CajaManagement from "../pages/CajaManagement";
import InventarioManagement from "../pages/InventarioManagement";
import Reportes from "../pages/Reportes";
import PrivateRoute from "./PrivateRoute";

// Componente que decide la ruta raíz según estado del sistema
const RootRedirect = () => {
  const { empresa, empresaLoading } = useEmpresa();
  const token = localStorage.getItem("token");

  if (empresaLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  // 1. Sin empresa → mostrar landing para registrar
  if (!empresa) return <LandingPage />;

  // 2. Empresa existe pero no hay sesión → login
  if (!token) return <Navigate to="/login" replace />;

  // 3. Empresa y sesión → redirigir según rol
  const rol = localStorage.getItem("role");
  if (rol === "ADMINISTRADOR") return <Navigate to="/admin-dashboard" replace />;
  if (rol === "CAJERO") return <Navigate to="/cajero-dashboard" replace />;

  return <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>

        {/* Raíz inteligente */}
        <Route path="/" element={<RootRedirect />} />

        {/* Registro empresa — solo accesible si NO hay empresa */}
        <Route path="/registro-empresa" element={<RegistroEmpresa />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route path="/admin-dashboard" element={
          <PrivateRoute roles={["ADMINISTRADOR"]}><AdminDashboard /></PrivateRoute>
        } />

        <Route path="/cajero-dashboard" element={
          <PrivateRoute roles={["CAJERO"]}><CajeroDashboard /></PrivateRoute>
        } />

        <Route path="/gestion-usuarios" element={
          <PrivateRoute roles={["ADMINISTRADOR"]}><UserManagement /></PrivateRoute>
        } />

        <Route path="/gestion-productos" element={
          <PrivateRoute roles={["ADMINISTRADOR"]}><ProductManagement /></PrivateRoute>
        } />

        <Route path="/gestion-clientes" element={
          <PrivateRoute roles={["ADMINISTRADOR", "CAJERO"]}><ClientManagement /></PrivateRoute>
        } />

        <Route path="/mostrar-ventas" element={
          <PrivateRoute roles={["ADMINISTRADOR"]}><VentaManagement /></PrivateRoute>
        } />

        <Route path="/nueva-venta" element={
          <PrivateRoute roles={["ADMINISTRADOR", "CAJERO"]}><VentaPOS /></PrivateRoute>
        } />

        <Route path="/gestion-cajas" element={
          <PrivateRoute roles={["ADMINISTRADOR"]}><CajaManagement /></PrivateRoute>
        } />

        <Route path="/inventario" element={
          <PrivateRoute roles={["ADMINISTRADOR"]}><InventarioManagement /></PrivateRoute>
        } />

        <Route path="/reportes" element={
          <PrivateRoute roles={["ADMINISTRADOR"]}>
            <Reportes />
          </PrivateRoute>
        } />

        <Route path="/auditoria" element={
          <PrivateRoute roles={["ADMINISTRADOR"]}><AuditoriaManagement /></PrivateRoute>
        } />

        <Route path="/empresa" element={
          <PrivateRoute roles={["ADMINISTRADOR"]}><EmpresaProfile /></PrivateRoute>
        } />

      </Routes>
    </Router>
  );
}

export default AppRoutes;