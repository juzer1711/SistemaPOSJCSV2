import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginContainer from "./containers/LoginContainer";
import AdminDashboard from "./pages/AdminDashboard";
import CajeroDashboard from "./pages/CajeroDashboard";
import PrivateRoute from "./routes/PrivateRoute";
import UserManagement from "./pages/UserManagement"; // ✅ importa tu nuevo CRUD

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página de login */}
        <Route path="/" element={<LoginContainer />} />

        {/* Dashboard del administrador */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute roleRequired="ADMINISTRADOR">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Dashboard del cajero */}
        <Route
          path="/cajero-dashboard"
          element={
            <PrivateRoute roleRequired="CAJERO">
              <CajeroDashboard />
            </PrivateRoute>
          }
        />

        {/*ruta para gestión de usuarios (solo admin) */}
        <Route
          path="/gestion-usuarios"
          element={
            <PrivateRoute roleRequired="ADMINISTRADOR">
              <UserManagement />
            </PrivateRoute>
          }
        />

        {/* Redirección si la ruta no existe */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
