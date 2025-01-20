import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation(); // Dapatkan informasi lokasi saat ini

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

const NonProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export {NonProtectedRoute, ProtectedRoute};
