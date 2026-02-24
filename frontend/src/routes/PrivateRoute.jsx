import React from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/NavBar";

const PrivateRoute = ({ children, roles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/" replace />;

  if (roles && !roles.includes(role)) {
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
