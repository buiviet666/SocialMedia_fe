import * as React from "react";
import authApi from "../../apis/api/authApi";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      console.log(refreshToken);

      await authApi.logoutApi({ refreshToken });
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      dispatch(logoutAction());
      navigate("/login");
    }
  };

  return (
    <div>
      homepagee
      <span onClick={handleLogout}>dang xuat de</span>
    </div>
  );
}
