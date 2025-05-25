import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../../constants";

const AuthLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
    if (token) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
