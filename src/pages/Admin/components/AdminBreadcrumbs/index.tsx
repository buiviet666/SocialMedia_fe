import { Breadcrumb } from "antd";
import { useLocation, Link } from "react-router-dom";

// Map đường dẫn tới tên hiển thị
const breadcrumbNameMap: Record<string, string> = {
  "/admin": "Tổng quan",
  "/admin/users": "Quản lý người dùng",
  "/admin/posts": "Quản lý bài viết",
  "/admin/report-accounts": "Báo cáo tài khoản",
  "/admin/report-posts": "Báo cáo bài viết",
  "/admin/report-users": "Báo cáo người dùng",
  "/admin/report-comments": "Báo cáo bình luận",
  "/admin/report-messages": "Báo cáo tin nhắn",
  "/admin/statistics": "Thống kê",
  "/admin/roles": "Cài đặt phân quyền",
  "/admin/profile": "Hồ sơ cá nhân",
  "/admin/change-password": "Đổi mật khẩu",
};

const AdminBreadcrumbs = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    const label = breadcrumbNameMap[url] || url;
    return {
      key: url,
      title: <Link to={url}>{label}</Link>,
    };
  });

  return (
    <Breadcrumb style={{ marginBottom: 16 }}>
      <Breadcrumb.Item key="/admin">
        <Link to="/admin">Trang chủ</Link>
      </Breadcrumb.Item>
      {breadcrumbItems.map((item) => (
        <Breadcrumb.Item key={item.key}>{item.title}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default AdminBreadcrumbs;
