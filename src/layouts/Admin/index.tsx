import { Layout, Menu, Dropdown, Avatar, Space } from "antd";
import {
  DashboardOutlined,
  UserSwitchOutlined,
  FileTextOutlined,
  MessageOutlined,
  BarChartOutlined,
  UserOutlined,
  CommentOutlined,
  LogoutOutlined,
  SettingOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import AdminBreadcrumbs from "../../pages/Admin/components/AdminBreadcrumbs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import authApi from "../../apis/api/authApi";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

const { Sider, Content, Header } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const userRaw =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userRaw) {
      try {
        const parsed = JSON.parse(userRaw);
        setAdminUser(parsed);
      } catch {
        setAdminUser(null);
      }
    }
  }, []);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN) || sessionStorage.getItem(REFRESH_TOKEN);

    if (!refreshToken) {
      toast.error("Token not found, already logged out?");
      return;
    }

    try {
      if (refreshToken) {
        await authApi.logoutApi({ refreshToken });
        toast.success("Logout successful!");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Logout error");
    } finally {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      sessionStorage.removeItem(ACCESS_TOKEN);
      sessionStorage.removeItem(REFRESH_TOKEN);
      localStorage.removeItem("userId");
      
      navigate("/admin/login");
    }
  };

  const handleMenuClick = async ({ key }: { key: string }) => {
    if (key === "logout") {
      handleLogout();
    } else if (key === "profile") {
      navigate("/admin/profile");
    } else if (key === "change-password") {
      navigate("/admin/change-password");
    }
  };

  const menuItems = [
    { key: "/admin", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/admin/report-users", icon: <UserSwitchOutlined />, label: "Report Users" },
    { key: "/admin/report-posts", icon: <FileTextOutlined />, label: "Report Posts" },
    { key: "/admin/report-messages", icon: <MessageOutlined />, label: "Report Messages" },
    { key: "/admin/report-comments", icon: <CommentOutlined />, label: "Report Comments" },
    { key: "/admin/users", icon: <UserOutlined />, label: "User Management" },
    { key: "/admin/posts", icon: <FileTextOutlined />, label: "Post Management" },
    // { key: "/admin/statistics", icon: <BarChartOutlined />, label: "Statistics" },
  ];

  return (
    <StyledLayout>
      <Sider theme="light" breakpoint="lg" collapsedWidth="0">
        <div className="text-center font-bold text-lg p-4">Admin Panel</div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname === "/admin" ? "/admin" : location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header className="customheader bg-white px-5 flex justify-between items-center font-bold">
          <span>System Administration</span>
          <Dropdown 
            menu={{ items: [
              { key: "profile", icon: <UserOutlined />, label: "Profile" },
              { key: "change-password", icon: <LockOutlined />, label: "Change Password" },
              { type: "divider" },
              { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
            ], onClick: handleMenuClick }} placement="bottomRight">
            <Space className="cursor-pointer">
              <Avatar src={adminUser?.avatar || "https://i.pravatar.cc/40"} />
              <span className="hidden sm:inline">
                {adminUser?.nameDisplay || adminUser?.userName || "Admin"}
              </span>
            </Space>
          </Dropdown>
        </Header>

        <Content className="m-4 p-4 bg-white min-h-[360px]">
          <AdminBreadcrumbs />
          <Outlet />
        </Content>
      </Layout>
    </StyledLayout>
  );
};

export default AdminLayout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;

  .customheader {
    background-color: #ffffff;
  }
`;
