import React from "react";
import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
  const userRaw = localStorage.getItem("user") || sessionStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  const isAdmin = user?.role === "ADMIN";

  if (!token || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
