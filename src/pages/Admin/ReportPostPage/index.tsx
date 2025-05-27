import React from "react";
import { Button, Tag, Space, Popconfirm, Tooltip, message } from "antd";
import AdminTable from "../components/AdminTable";

const mockData = [
  {
    id: 1,
    author: "john_doe",
    content: "Chuyến đi Đà Lạt tuyệt vời cùng bạn bè...",
    reportCount: 7,
    lastReason: "Hình ảnh nhạy cảm",
    lastReportedAt: "2025-05-26",
  },
  {
    id: 2,
    author: "travel_blogger",
    content: "Tổng hợp các địa điểm đẹp tại Sapa",
    reportCount: 2,
    lastReason: "Spam quảng cáo",
    lastReportedAt: "2025-05-25",
  },
  {
    id: 3,
    author: "user_toxic",
    content: "Đăng bài với ngôn từ công kích...",
    reportCount: 12,
    lastReason: "Phát ngôn thù địch",
    lastReportedAt: "2025-05-24",
  },
];

const ReportPostPage = () => {
  const handleView = (record: any) => {
    message.info(`Xem bài viết ID: ${record.id}`);
  };

  const handleDelete = (record: any) => {
    message.success(`Đã xóa bài viết của ${record.author}`);
  };

  const columns = [
    {
      title: "Người đăng",
      dataIndex: "author",
      key: "author",
      sorter: (a: any, b: any) => a.author.localeCompare(b.author),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (text: string) => (
        <Tooltip title={text}>
          <span style={{ maxWidth: 250, display: "inline-block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{text}</span>
        </Tooltip>
      ),
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
        <Space>
          <Button size="small" type="link" onClick={() => handleView(record)}>
            Xem bài viết
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2>Báo cáo bài viết</h2>
      <AdminTable
        columns={columns}
        data={mockData}
        pageSize={5}
        scrollX={1000}
      />
    </>
  );
};

export default ReportPostPage;
