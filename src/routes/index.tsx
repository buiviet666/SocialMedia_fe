import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import MainLayout from "../layouts/Main";
import AuthLayout from "../layouts/Auth";
import Register from "../pages/Auth/Register";
import ProtectedRoute from "./protectedRoute";
import ForgotPage from "../pages/Auth/ForgotPassword/ForgotPage";
import ResetPassword from "../pages/Auth/ForgotPassword/ResetPassword";

const RoutesList = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      //   { path: "login", element: <Login /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPage />},
      { path: "reset-password", element: <ResetPassword />},
    ],
  },
  // {
  //   path: "/login",
  //   element: <Login />,
  // },
  // {
  //   path: "/register",
  //   element: <Register />,
  // },
]);

export default RoutesList;
