import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";

const RedirectIfAdmin = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
    const userRaw =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;

    if (token && user?.role === "ADMIN") {
      navigate("/admin", { replace: true });
    }
  }, []);

  return children;
};

export default RedirectIfAdmin;
