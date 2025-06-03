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
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import AdminLayout from "../layouts/Admin";
import AdminPage from "../pages/Admin";
import AdminLogin from "../pages/Admin/AdminLogin";
import ReportAccountPage from "../pages/Admin/ReportAccountPage";
import ReportPostPage from "../pages/Admin/ReportPostPage";
import ReportUserPage from "../pages/Admin/ReportUserPage";
import ReportCommentPage from "../pages/Admin/ReportCommentPage";
import StatisticsPage from "../pages/Admin/StatisticsPage";
import UserManagementPage from "../pages/Admin/UserManagementPage";
import PostManagementPage from "../pages/Admin/PostManagementPage";
import RolePage from "../pages/Admin/RolePage";
import VerifyEmail from "../pages/VerifyEmail";

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
      { path: "profile/:id?", element: <Profile /> },
      { path: "profile/liked", element: <LikedPage /> },
      { path: "profile/edit", element: <EditPage /> },
      { path: "suggest-friend", element: <SuggestFriend /> },
      { path: "post/:id?", element: <PostInfo /> },
      { path: "inbox/:id?", element: <InboxMessage /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPage /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "verify-email", element: <VerifyEmail />}
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: (
      // <ProtectedAdminRoute>
        <AdminLayout />
      // </ProtectedAdminRoute>
    ),
    children: [
      { index: true, element: <AdminPage /> },
      { path: "report-accounts", element: <ReportAccountPage /> },
      { path: "report-posts", element: <ReportPostPage /> },
      { path: "report-users", element: <ReportUserPage /> },
      { path: "report-comments", element: <ReportCommentPage /> },
      { path: "statistics", element: <StatisticsPage /> },
      { path: "users", element: <UserManagementPage /> },
      { path: "posts", element: <PostManagementPage /> },
      { path: "roles", element: <RolePage /> },
    ]
  },
]);

export default RoutesList;
