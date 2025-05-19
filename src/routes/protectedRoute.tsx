import React from "react";
import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token =
    localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
