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
import ReportPostPage from "../pages/Admin/ReportPostPage";
import ReportUserPage from "../pages/Admin/ReportUserPage";
import ReportCommentPage from "../pages/Admin/ReportCommentPage";
import StatisticsPage from "../pages/Admin/StatisticsPage";
import UserManagementPage from "../pages/Admin/UserManagementPage";
import PostManagementPage from "../pages/Admin/PostManagementPage";
import VerifyEmail from "../pages/VerifyEmail";
import ReportMessagePage from "../pages/Admin/ReportMessagePage";
import RedirectIfAdmin from "./RedirectIfAdmin";
import ProfileAdmin from "../pages/Admin/ProfileAdmin";
import ChangePasswordPage from "../pages/Admin/ChangePasswordPage";

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
    element: <RedirectIfAdmin>
      <AdminLogin />
    </RedirectIfAdmin>,
  },
  {
    path: "/admin",
    element: (
      <ProtectedAdminRoute>
        <AdminLayout />
      </ProtectedAdminRoute>
    ),
    children: [
      { index: true, element: <AdminPage /> },
      { path: "report-users", element: <ReportUserPage /> },
      { path: "report-posts", element: <ReportPostPage /> },
      { path: "report-comments", element: <ReportCommentPage /> },
      { path: "report-messages", element: <ReportMessagePage /> },
      { path: "users", element: <UserManagementPage /> },
      { path: "posts", element: <PostManagementPage /> },
      { path: "statistics", element: <StatisticsPage /> },
      { path: "profile", element: <ProfileAdmin /> },
      { path: "change-password", element: <ChangePasswordPage /> },
    ]
  },
]);

export default RoutesList;
