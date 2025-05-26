import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import MainLayout from "../layouts/Main";
import AuthLayout from "../layouts/Auth";
import Register from "../pages/Auth/Register";
import ProtectedRoute from "./protectedRoute";
import ForgotPage from "../pages/Auth/ForgotPassword/ForgotPage";
import ResetPassword from "../pages/Auth/ForgotPassword/ResetPassword";
import Profile from "../pages/Profile";
import LikedPage from "../pages/Profile/LikedPage";
import EditPage from "../pages/Profile/EditPage";
import SuggestFriend from "../pages/SuggestFriend";
import PostInfo from "../pages/PostInfo";
import InboxMessage from "../pages/InboxMessage";

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
      { path: "/profile/", element: <Profile /> },
      { path: "/profile/liked", element: <LikedPage />},
      { path: "/profile/edit", element: <EditPage />},
      { path: "/suggest-friend", element: <SuggestFriend />},
      { path: "/post/:id?", element: <PostInfo />},
      { path: "/inbox/:id?", element: <InboxMessage />},

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
