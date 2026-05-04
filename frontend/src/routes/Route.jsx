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
import CajaManagement from "../pages/CajaManagement";
import InventarioManagement from "../pages/InventarioManagament";

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
            <PrivateRoute roles={["ADMINISTRADOR"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/cajero-dashboard"
          element={
            <PrivateRoute roles={["CAJERO"]}>
              <CajeroDashboard />
            </PrivateRoute>
          }
        />

        {/* 🔹 Ruta CRUD usuarios (solo para administradores) */}
        <Route
          path="/gestion-usuarios"
          element={
            <PrivateRoute roles={["ADMINISTRADOR"]}>
              <UserManagement />
            </PrivateRoute>
          }
        />
        
        {/* 🔹 Ruta CRUD productos (solo para administradores) */}
        <Route
          path="/gestion-productos"
          element={
            <PrivateRoute roles={["ADMINISTRADOR"]}>
              <ProductManagement />
            </PrivateRoute>
          }
        />

        {/* 🔹 Ruta CRUD clientes (solo para administradores) */}
        <Route
          path="/gestion-clientes"
          element={
            <PrivateRoute roles={["ADMINISTRADOR"]}>
              <ClientManagement />
            </PrivateRoute>
          }
        />
        {/* 🔹 Ruta para ver las ventas */}
        <Route
          path="/mostrar-ventas"
          element={
            <PrivateRoute roles={["ADMINISTRADOR"]}>
              <VentaManagement/>
            </PrivateRoute>
          }
        />
        {/* 🔹 Ruta para nueva venta */}
        <Route
          path="/nueva-venta"
          element={
            <PrivateRoute roles={["ADMINISTRADOR","CAJERO"]}>
              <VentaPOS/>
            </PrivateRoute>
          }
        /> 
        {/* 🔹 Ruta gestion de cajas (solo para administradores)  */}
        <Route
          path="/gestion-cajas"
          element={
            <PrivateRoute roles={["ADMINISTRADOR"]}>
              <CajaManagement/>
            </PrivateRoute>
          }
        />
        {/* 🔹 Ruta modulo inventario (solo para administradores)  */}
        <Route
          path="/inventario"
          element={
            <PrivateRoute roles={["ADMINISTRADOR"]}>
              <InventarioManagement/>
            </PrivateRoute>
          }
        />  
      </Routes>
    </Router>
  );
}

export default AppRoutes;
