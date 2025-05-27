import React from "react";
import { Button, Tag, Space, Popconfirm, message } from "antd";
import AdminTable from "../components/AdminTable";

const mockData = [
  {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    reportCount: 5,
    lastReason: "Spam tin nhắn",
    lastReportedAt: "2025-05-25",
  },
  {
    id: 2,
    username: "jane_smith",
    email: "jane@example.com",
    reportCount: 3,
    lastReason: "Phát ngôn tiêu cực",
    lastReportedAt: "2025-05-24",
  },
  {
    id: 3,
    username: "toxic_user99",
    email: "toxic99@example.com",
    reportCount: 10,
    lastReason: "Quấy rối người dùng",
    lastReportedAt: "2025-05-26",
  },
];

const ReportAccountPage = () => {
  const handleView = (record: any) => {
    message.info(`Xem chi tiết tài khoản: ${record.username}`);
  };

  const handleBan = (record: any) => {
    message.success(`Đã khóa tài khoản: ${record.username}`);
  };

  const columns = [
    {
      title: "Tên tài khoản",
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
      title: "Số lượt báo cáo",
      dataIndex: "reportCount",
      key: "reportCount",
      sorter: (a: any, b: any) => a.reportCount - b.reportCount,
      render: (count: number) => <Tag color={count >= 5 ? "red" : "orange"}>{count}</Tag>,
    },
    {
      title: "Lý do gần nhất",
      dataIndex: "lastReason",
      key: "lastReason",
    },
    {
      title: "Ngày báo cáo gần nhất",
      dataIndex: "lastReportedAt",
      key: "lastReportedAt",
      sorter: (a: any, b: any) => new Date(a.lastReportedAt).getTime() - new Date(b.lastReportedAt).getTime(),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => handleView(record)}>
            Xem chi tiết
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn khóa tài khoản này?"
            onConfirm={() => handleBan(record)}
            okText="Khóa"
            cancelText="Hủy"
          >
            <Button danger type="link">
              Khóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2>Báo cáo tài khoản</h2>
      <AdminTable
        columns={columns}
        data={mockData}
        pageSize={5}
        scrollX={1000}
      />
    </>
  );
};

export default ReportAccountPage;
