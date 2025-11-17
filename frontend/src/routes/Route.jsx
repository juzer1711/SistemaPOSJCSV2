import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginContainer from "../containers/LoginContainer";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import AdminDashboard from "../pages/AdminDashboard";
import CajeroDashboard from "../pages/CajeroDashboard";
import UserManagement from "../pages/UserManagement"; // tu CRUD de usuarios
import ProductManagement from "../pages/ProductManagement"; // tu CRUD de productos


function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* 🔹 Ruta pública (login) */}
        <Route path="/" element={<LoginContainer />} />

        {/* 🔹 Ruta general protegida (acceso según rol) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* 🔹 Rutas específicas según tipo de usuario */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="ADMINISTRADOR">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/cajero"
          element={
            <PrivateRoute role="CAJERO">
              <CajeroDashboard />
            </PrivateRoute>
          }
        />

        {/* 🔹 Ruta CRUD usuarios (solo para administradores) */}
        <Route
          path="/usuarios"
          element={
            <PrivateRoute role="ADMINISTRADOR">
              <UserManagement />
            </PrivateRoute>
          }
        />
        
        {/* 🔹 Ruta CRUD productos (solo para administradores) */}
        <Route
          path="/productos"
          element={
            <PrivateRoute role="ADMINISTRADOR">
              <ProductManagement />
            </PrivateRoute>
          }
        />        
      </Routes>
    </Router>
  );
}

export default AppRoutes;
