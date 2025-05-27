import React from "react";
import { Button, Tag, Space, Popconfirm, message, Tooltip } from "antd";
import AdminTable from "../components/AdminTable";

const mockData = [
  {
    id: 1,
    username: "user_angrycat",
    fullName: "Angry Cat",
    email: "angrycat@example.com",
    reportCount: 8,
    lastReason: "Ngôn từ thô tục với người khác",
    lastReportedAt: "2025-05-26",
  },
  {
    id: 2,
    username: "user_fakeacc",
    fullName: "Nguyễn Văn A",
    email: "fakeacc@example.com",
    reportCount: 3,
    lastReason: "Tài khoản giả mạo người nổi tiếng",
    lastReportedAt: "2025-05-24",
  },
  {
    id: 3,
    username: "user_harass",
    fullName: "Trần Thị B",
    email: "harass99@example.com",
    reportCount: 12,
    lastReason: "Quấy rối trong tin nhắn riêng tư",
    lastReportedAt: "2025-05-23",
  },
];

const ReportUserPage = () => {
  const handleViewProfile = (record: any) => {
    message.info(`Xem hồ sơ người dùng: ${record.username}`);
  };

  const handleWarn = (record: any) => {
    message.warning(`Đã gửi cảnh cáo đến: ${record.username}`);
  };

  const handleBan = (record: any) => {
    message.success(`Đã khóa tài khoản: ${record.username}`);
  };

  const handleDismissReport = (record: any) => {
    message.info(`Đã gỡ báo cáo cho: ${record.username}`);
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
      render: (count: number) => (
        <Tag color={count >= 5 ? "red" : "orange"}>{count}</Tag>
      ),
    },
    {
      title: "Lý do gần nhất",
      dataIndex: "lastReason",
      key: "lastReason",
      render: (text: string) => (
        <Tooltip title={text}>
          <span style={{ maxWidth: 200, display: "inline-block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Ngày báo cáo gần nhất",
      dataIndex: "lastReportedAt",
      key: "lastReportedAt",
      sorter: (a: any, b: any) =>
        new Date(a.lastReportedAt).getTime() - new Date(b.lastReportedAt).getTime(),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: any) => (
        <Space direction="horizontal">
          <Button size="small" onClick={() => handleViewProfile(record)}>
            Xem hồ sơ
          </Button>
          <Button size="small" type="dashed" onClick={() => handleWarn(record)}>
            Cảnh cáo
          </Button>
          <Popconfirm
            title="Khóa tài khoản này?"
            onConfirm={() => handleBan(record)}
            okText="Khóa"
            cancelText="Hủy"
          >
            <Button size="small" danger>
              Khóa
            </Button>
          </Popconfirm>
          <Button size="small" type="link" onClick={() => handleDismissReport(record)}>
            Gỡ báo cáo
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2>Báo cáo người dùng</h2>
      <AdminTable
        columns={columns}
        data={mockData}
        pageSize={5}
        scrollX={1000}
      />
    </>
  );
};

export default ReportUserPage;
