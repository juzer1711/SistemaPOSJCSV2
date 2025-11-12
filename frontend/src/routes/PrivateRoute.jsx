import React from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/NavBar";

const PrivateRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <>
      <Navbar /> {/* ✅ Navbar visible en todas las páginas protegidas */}
      {children}
    </>
  );
};

export default PrivateRoute;
