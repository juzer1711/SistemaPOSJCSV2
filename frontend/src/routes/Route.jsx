import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginContainer from "../containers/LoginContainer";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import AdminDashboard from "../pages/AdminDashboard";
import CajeroDashboard from "../pages/CajeroDashboard";
import UserManagement from "../pages/UserManagement"; // tu CRUD de usuarios

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
            <PrivateRoute rol="ADMINISTRADOR">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/cajero"
          element={
            <PrivateRoute rol="CAJERO">
              <CajeroDashboard />
            </PrivateRoute>
          }
        />

        {/* 🔹 Ruta CRUD usuarios (solo para administradores) */}
        <Route
          path="/usuarios"
          element={
            <PrivateRoute rol="ADMINISTRADOR">
              <UserManagement />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
