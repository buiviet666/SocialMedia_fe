import React, { useEffect, useState } from "react";
import { Input, Button, Tag, Space, Popconfirm, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AdminTable from "../components/AdminTable";
import adminApi from "../../../apis/api/adminApi";

const statusColorMap = {
  active: "green",
  locked: "red",
};

const UserManagementPage = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllUsers();
      setData(res.data);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (keyword) => {
    try {
      setLoading(true);
      if (!keyword.trim()) return fetchUsers();
      const res = await adminApi.searchUsers(keyword);
      setData(res.data);
    } catch (err) {
      console.error(err);
      message.error("Không thể tìm kiếm người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // const handleLock = async (user) => {
  //   try {
  //     await adminApi.lockUser(user._id);
  //     message.success("Đã khóa tài khoản");
  //     fetchUsers();
  //   } catch (err) {
  //     message.error("Không thể khóa tài khoản");
  //   }
  // };

  // const handleUnlock = async (user) => {
  //   try {
  //     await adminApi.unlockUser(user._id);
  //     message.success("Đã mở khóa tài khoản");
  //     fetchUsers();
  //   } catch (err) {
  //     message.error("Không thể mở khóa tài khoản");
  //   }
  // };

  // const handleDelete = async (user) => {
  //   try {
  //     await adminApi.deleteUser(user._id);
  //     message.success("Đã xóa tài khoản");
  //     fetchUsers();
  //   } catch (err) {
  //     message.error("Không thể xóa tài khoản");
  //   }
  // };

  const columns = [
    {
      title: "Tên hiển thị",
      dataIndex: "nameDisplay",
      key: "nameDisplay",
      sorter: (a, b) => a.nameDisplay.localeCompare(b.nameDisplay),
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },
    {
      title: "Email",
      dataIndex: "emailAddress",
      key: "emailAddress",
      sorter: (a, b) => a.emailAddress.localeCompare(b.emailAddress),
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   sorter: (a, b) => a.status.localeCompare(b.status),
    //   render: (status) => (
    //     <Tag color={statusColorMap[status]}>
    //       {status === "active" ? "Hoạt động" : "Bị khóa"}
    //     </Tag>
    //   ),
    // },
    // {
    //   title: "Hành động",
    //   key: "actions",
    //   render: (_, record) => (
    //     <Space>
    //       <Button size="small" type="link">Xem hồ sơ</Button>
    //       {record.status === "active" ? (
    //         <Popconfirm
    //           title="Khóa tài khoản này?"
    //           onConfirm={() => handleLock(record)}
    //           okText="Khóa"
    //           cancelText="Hủy"
    //         >
    //           <Button size="small" danger>Khóa</Button>
    //         </Popconfirm>
    //       ) : (
    //         <Button size="small" type="primary" onClick={() => handleUnlock(record)}>
    //           Mở khóa
    //         </Button>
    //       )}
    //       <Popconfirm
    //         title="Xóa tài khoản này?"
    //         onConfirm={() => handleDelete(record)}
    //         okText="Xóa"
    //         cancelText="Hủy"
    //       >
    //         <Button size="small" danger type="dashed">Xóa</Button>
    //       </Popconfirm>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <div className="px-4">
      <h2 className="text-lg font-semibold mb-4">Quản lý người dùng</h2>
      <Input
        placeholder="Tìm kiếm theo tên, username hoặc email..."
        prefix={<SearchOutlined />}
        style={{ maxWidth: 300, marginBottom: 16 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onPressEnter={() => handleSearch(search)}
        allowClear
      />
      <AdminTable
        columns={columns}
        data={data}
        loading={loading}
        pageSize={10}
        scrollX={1000}
      />
    </div>
  );
};

export default UserManagementPage;
