import React from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/NavBar";

const PrivateRoute = ({ children, rol }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/" replace />;

  if (rol && role !== rol) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
export default PrivateRoute;
