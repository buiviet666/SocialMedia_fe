import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserSwitchOutlined,
  FileTextOutlined,
  MessageOutlined,
  BarChartOutlined,
  WarningOutlined,
  UserOutlined,
  CrownOutlined
} from "@ant-design/icons";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import AdminBreadcrumbs from "../../pages/Admin/components/AdminBreadcrumbs";

const { Sider, Content, Header } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: "/admin", icon: <DashboardOutlined />, label: "Quản lý tổng hợp" },
    { key: "/admin/report-accounts", icon: <UserSwitchOutlined />, label: "Báo cáo tài khoản" },
    { key: "/admin/report-posts", icon: <FileTextOutlined />, label: "Báo cáo bài viết" },
    { key: "/admin/report-users", icon: <WarningOutlined />, label: "Báo cáo người dùng" },
    { key: "/admin/report-comments", icon: <MessageOutlined />, label: "Báo cáo bình luận" },
    { key: "/admin/statistics", icon: <BarChartOutlined />, label: "Thống kê bài viết" },
    { key: "/admin/users", icon: <UserOutlined />, label: "Quản lý người dùng" },
    { key: "/admin/posts", icon: <FileTextOutlined />, label: "Quản lý bài viết" },
    { key: "/admin/roles", icon: <CrownOutlined />, label: "Cài đặt phân quyền" },

  ];

  return (
    <StyledLayout>
      <Sider theme="light" breakpoint="lg" collapsedWidth="0">
        <div style={{ padding: 16, fontWeight: "bold", fontSize: 18, textAlign: "center" }}>
          Admin Panel
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname === "/admin" ? "/admin" : location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: "0 20px", fontWeight: "bold" }}>
          Quản trị hệ thống
        </Header>
        <Content style={{ margin: 16, padding: 16, background: "#fff", minHeight: 360 }}>
            <AdminBreadcrumbs />
            <Outlet />
        </Content>
      </Layout>
    </StyledLayout>
  );
};

export default AdminLayout;
