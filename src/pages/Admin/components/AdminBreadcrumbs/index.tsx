import React from "react";
import { Breadcrumb } from "antd";
import { useLocation } from "react-router-dom";

const breadcrumbNameMap: Record<string, string> = {
  "/admin": "Tổng quan",
  "/admin/users": "Quản lý người dùng",
  "/admin/posts": "Quản lý bài viết",
  "/admin/report-accounts": "Báo cáo tài khoản",
  "/admin/report-posts": "Báo cáo bài viết",
  "/admin/report-users": "Báo cáo người dùng",
  "/admin/report-comments": "Báo cáo bình luận",
  "/admin/statistics": "Thống kê",
  "/admin/roles": "Cài đặt phân quyền",
};

const AdminBreadcrumbs = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter(i => i);

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 2).join("/")}`;
    return {
      key: url,
      title: breadcrumbNameMap[url] || url,
    };
  });

  return (
    <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item key="home">Trang chủ</Breadcrumb.Item>
        {extraBreadcrumbItems.slice(0, -1).map((item) => (
            <Breadcrumb.Item key={item.key}>{item.title}</Breadcrumb.Item>
        ))}
    </Breadcrumb>
  );
};

export default AdminBreadcrumbs;
