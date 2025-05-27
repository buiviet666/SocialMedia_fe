import React, { useState } from "react";
import { Input, Button, Tag, Space, Popconfirm, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AdminTable from "../components/AdminTable";

const mockUsers = [
  {
    id: 1,
    fullName: "Nguyễn Văn A",
    username: "nguyenvana",
    email: "vana@example.com",
    status: "active",
  },
  {
    id: 2,
    fullName: "Trần Thị B",
    username: "tranb99",
    email: "tranb@example.com",
    status: "locked",
  },
  {
    id: 3,
    fullName: "Lê Văn C",
    username: "levanc",
    email: "levanc@example.com",
    status: "active",
  },
];

const statusColorMap = {
  active: "green",
  locked: "red",
};

const UserManagementPage = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(mockUsers);

  const handleLock = (user: any) => {
    setData((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, status: "locked" } : u
      )
    );
    message.success(`Đã khóa tài khoản: ${user.username}`);
  };

  const handleUnlock = (user: any) => {
    setData((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, status: "active" } : u
      )
    );
    message.success(`Đã mở khóa tài khoản: ${user.username}`);
  };

  const handleDelete = (user: any) => {
    setData((prev) => prev.filter((u) => u.id !== user.id));
    message.success(`Đã xóa tài khoản: ${user.username}`);
  };

  const filteredData = data.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "Tên đầy đủ",
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
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a: any, b: any) => a.email.localeCompare(b.email),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
      render: (status: string) => (
        <Tag color={statusColorMap[status]}>{status === "active" ? "Hoạt động" : "Bị khóa"}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" type="link">Xem hồ sơ</Button>
          {record.status === "active" ? (
            <Popconfirm
              title="Khóa tài khoản này?"
              onConfirm={() => handleLock(record)}
              okText="Khóa"
              cancelText="Hủy"
            >
              <Button size="small" danger>Khóa</Button>
            </Popconfirm>
          ) : (
            <Button size="small" type="primary" onClick={() => handleUnlock(record)}>Mở khóa</Button>
          )}
          <Popconfirm
            title="Xóa tài khoản này?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small" danger type="dashed">Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2>Quản lý người dùng</h2>
      <Input
        placeholder="Tìm kiếm theo tên hoặc email..."
        prefix={<SearchOutlined />}
        style={{ maxWidth: 300, marginBottom: 16 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <AdminTable
        columns={columns}
        data={filteredData}
        pageSize={5}
        scrollX={1000}
      />
    </>
  );
};

export default UserManagementPage;
