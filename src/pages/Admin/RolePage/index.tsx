import React, { useState } from "react";
import { Select, Button, Space, Tag, Popconfirm, message } from "antd";
import AdminTable from "../components/AdminTable";

const { Option } = Select;

const initialData = [
  { id: 1, fullName: "Nguyễn Văn A", username: "admin1", role: "admin" },
  { id: 2, fullName: "Trần Thị B", username: "mod99", role: "moderator" },
  { id: 3, fullName: "Lê Văn C", username: "user123", role: "user" },
];

const roleColors: Record<string, string> = {
  admin: "red",
  moderator: "blue",
  user: "green",
};

const RolePage = () => {
  const [data, setData] = useState(initialData);

  const handleChangeRole = (userId: number, newRole: string) => {
    setData((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    message.success(`Đã cập nhật role: ${newRole}`);
  };

  const handleResetRole = (userId: number) => {
    setData((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: "user" } : user
      )
    );
    message.info(`Đã gỡ role, đặt lại là "user"`);
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a: any, b: any) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a: any, b: any) => a.username.localeCompare(b.username),
    },
    {
      title: "Vai trò hiện tại",
      dataIndex: "role",
      key: "role",
      sorter: (a: any, b: any) => a.role.localeCompare(b.role),
      render: (role: string) => (
        <Tag color={roleColors[role]}>{role.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Thay đổi vai trò",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Select
            value={record.role}
            onChange={(value) => handleChangeRole(record.id, value)}
            style={{ width: 140 }}
          >
            <Option value="user">User</Option>
            <Option value="moderator">Moderator</Option>
            <Option value="admin">Admin</Option>
          </Select>
          {record.role !== "user" && (
            <Popconfirm
              title="Bạn có chắc muốn gỡ vai trò này?"
              onConfirm={() => handleResetRole(record.id)}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <Button type="link">Gỡ vai trò</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2>Cài đặt phân quyền</h2>
      <AdminTable
        columns={columns}
        data={data}
        pageSize={5}
        scrollX={800}
      />
    </>
  );
};

export default RolePage;
