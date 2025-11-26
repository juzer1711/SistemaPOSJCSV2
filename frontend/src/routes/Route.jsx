// AppRoutes.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginContainer from "../containers/LoginContainer";
import AdminDashboard from "../pages/AdminDashboard";
import CajeroDashboard from "../pages/CajeroDashboard";
import UserManagement from "../pages/UserManagement"; // CRUD de usuarios
import ProductManagement from "../pages/ProductManagement"; // CRUD de productos
import ClientManagement from "../pages/ClientManagement"; // CRUD de clientes
import PrivateRoute from "./PrivateRoute"; // Componente para proteger rutas
import VentaManagement from "../pages/VentaManagement";
import VentaPOS from "../components/Ventas/POSVenta";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* 🔹 Ruta pública (login) */}
        <Route path="/" element={<LoginContainer />} />

        {/* 🔹 Rutas específicas según tipo de usuario */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute rol="ADMINISTRADOR">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/cajero-dashboard"
          element={
            <PrivateRoute rol="CAJERO">
              <CajeroDashboard />
            </PrivateRoute>
          }
        />

        {/* 🔹 Ruta CRUD usuarios (solo para administradores) */}
        <Route
          path="/gestion-usuarios"
          element={
            <PrivateRoute rol="ADMINISTRADOR">
              <UserManagement />
            </PrivateRoute>
          }
        />
        
        {/* 🔹 Ruta CRUD productos (solo para administradores) */}
        <Route
          path="/gestion-productos"
          element={
            <PrivateRoute rol="ADMINISTRADOR">
              <ProductManagement />
            </PrivateRoute>
          }
        />

        {/* 🔹 Ruta CRUD clientes (solo para administradores) */}
        <Route
          path="/gestion-clientes"
          element={
            <PrivateRoute rol="ADMINISTRADOR">
              <ClientManagement />
            </PrivateRoute>
          }
        />
        {/* 🔹 Ruta para ver las ventas */}
        <Route
          path="/mostrar-ventas"
          element={
              <VentaManagement/>
          }
        />
        {/* 🔹 Ruta para nueva venta */}
        <Route
          path="/nueva-venta"
          element={
          <PrivateRoute rol="ADMINISTRADOR">
              <VentaPOS/>
          </PrivateRoute>
          }
        />          
      </Routes>
    </Router>
  );
}

export default AppRoutes;
