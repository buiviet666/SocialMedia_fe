import React from "react";
import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isAdmin = user?.role === "admin";

  if (!token || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
