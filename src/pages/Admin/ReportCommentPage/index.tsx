import React from "react";
import { Button, Tag, Space, Popconfirm, message, Tooltip } from "antd";
import AdminTable from "../components/AdminTable";

const mockData = [
  {
    id: 1,
    commentAuthor: "user_sunny",
    commentContent: "Đây là bình luận gây tranh cãi và xúc phạm.",
    relatedPostId: "p123",
    reportCount: 6,
    lastReason: "Ngôn từ thô tục",
    lastReportedAt: "2025-05-25",
  },
  {
    id: 2,
    commentAuthor: "user_travel",
    commentContent: "Click vào link này để nhận quà!",
    relatedPostId: "p456",
    reportCount: 3,
    lastReason: "Spam / link độc hại",
    lastReportedAt: "2025-05-24",
  },
  {
    id: 3,
    commentAuthor: "user_meme",
    commentContent: "Bình luận vui nhộn nhưng bị hiểu sai",
    relatedPostId: "p789",
    reportCount: 1,
    lastReason: "Hiểu nhầm",
    lastReportedAt: "2025-05-23",
  },
];

const ReportCommentPage = () => {
  const handleView = (record: any) => {
    message.info(`Xem bình luận trong bài viết: ${record.relatedPostId}`);
  };

  const handleDelete = (record: any) => {
    message.success(`Đã xóa bình luận của: ${record.commentAuthor}`);
  };

  const handleDismiss = (record: any) => {
    message.info(`Đã gỡ báo cáo cho bình luận ID: ${record.id}`);
  };

  const columns = [
    {
      title: "Người bình luận",
      dataIndex: "commentAuthor",
      key: "commentAuthor",
      sorter: (a: any, b: any) =>
        a.commentAuthor.localeCompare(b.commentAuthor),
    },
    {
      title: "Nội dung bình luận",
      dataIndex: "commentContent",
      key: "commentContent",
      render: (text: string) => (
        <Tooltip title={text}>
          <span
            style={{
              maxWidth: 250,
              display: "inline-block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Bài viết liên quan",
      dataIndex: "relatedPostId",
      key: "relatedPostId",
      render: (postId: string) => <Tag color="blue">{postId}</Tag>,
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
        new Date(a.lastReportedAt).getTime() -
        new Date(b.lastReportedAt).getTime(),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" onClick={() => handleView(record)}>
            Xem trong bài
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa bình luận này?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
          <Button
            size="small"
            type="link"
            onClick={() => handleDismiss(record)}
          >
            Gỡ báo cáo
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2>Báo cáo bình luận</h2>
      <AdminTable
        columns={columns}
        data={mockData}
        pageSize={5}
        scrollX={1000}
      />
    </>
  );
};

export default ReportCommentPage;
