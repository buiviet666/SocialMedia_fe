import React, { useEffect, useState } from "react";
import { Button, Tag, Space, Popconfirm, message, Tooltip, Modal } from "antd";
import AdminTable from "../components/AdminTable";
import adminApi from "../../../apis/api/adminApi";
import moment from "moment";

const ReportCommentPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedComment, setSelectedComment] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchReportedComments = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getReportedComments();
      setData(res.data);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách báo cáo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedComments();
  }, []);

  const handleView = (record) => {
    setSelectedComment(record);
    setShowModal(true);
  };

  const handleDelete = async (record) => {
    try {
      await adminApi.deleteComment(record.commentId);
      message.success("Đã xóa bình luận.");
      fetchReportedComments();
    } catch (err) {
      console.error(err);
      message.error("Không thể xóa bình luận.");
    }
  };

  const handleDismiss = async (record) => {
    try {
      await adminApi.resolveCommentReports(record.commentId);
      message.success("Đã gỡ báo cáo.");
      fetchReportedComments();
    } catch (err) {
      console.error(err);
      message.error("Không thể gỡ báo cáo.");
    }
  };

  const columns = [
    {
      title: "Người bình luận",
      key: "commentAuthor",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <img
            src={record.user.avatar || "/default-avatar.png"}
            alt="avatar"
            className="w-6 h-6 rounded-full object-cover"
          />
          <span>{record.user.nameDisplay || record.user.userName}</span>
        </div>
      ),
    },
    {
      title: "Nội dung bình luận",
      dataIndex: "content",
      key: "content",
      render: (text) => (
        <Tooltip title={text}>
          <span className="inline-block max-w-[250px] truncate">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Bài viết liên quan",
      dataIndex: "postId",
      key: "postId",
      render: (id) => <Tag color="blue">{id}</Tag>,
    },
    {
      title: "Số lượt báo cáo",
      dataIndex: "reportCount",
      key: "reportCount",
      render: (count) => (
        <Tag color={count >= 5 ? "red" : "orange"}>{count}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "HIDDEN" ? "volcano" : "green"}>
          {status === "HIDDEN" ? "Đã bị ẩn" : "Hiển thị"}
        </Tag>
      ),
    },
    {
      title: "Ngày báo cáo gần nhất",
      dataIndex: "lastReportedAt",
      key: "lastReportedAt",
      render: (val) => moment(val).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => {
        const hasPending = record.reportDetails?.some((r) => r.status === "PENDING");

        return (
          <Space>
            <Button size="small" onClick={() => handleView(record)}>
              Chi tiết báo cáo
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
            {hasPending && (
              <Button size="small" type="dashed" onClick={() => handleDismiss(record)}>
                Gỡ báo cáo
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="px-4">
      <h2 className="text-lg font-semibold mb-4">Báo cáo bình luận</h2>
      <AdminTable
        columns={columns}
        data={data}
        loading={loading}
        pageSize={10}
        scrollX={1000}
      />

      <Modal
        title="Chi tiết báo cáo bình luận"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        centered
        width={600}
      >
        {selectedComment && (
          <div className="space-y-4">
            <div className="text-sm text-gray-800">
              <p><strong>Bình luận:</strong> {selectedComment.content}</p>
              <p><strong>Người bình luận:</strong> {selectedComment.user?.nameDisplay || selectedComment.user?.userName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Chi tiết các báo cáo:</p>
              {selectedComment.reportDetails?.map((report, idx) => (
                <div key={idx} className="flex items-start gap-3 border-b pb-2">
                  <img
                    src={report.reporterAvatar || "/default-avatar.png"}
                    className="w-8 h-8 rounded-full object-cover border"
                    alt="reporter-avatar"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{report.reporterName || "Ẩn danh"}</span>
                      <Tag color={report.status === "PENDING" ? "orange" : "green"} className="text-xs">
                        {report.status === "PENDING" ? "Chờ xử lý" : "Đã xử lý"}
                      </Tag>
                    </div>
                    <p className="text-sm text-gray-600 italic">"{report.reason}"</p>
                    <p className="text-xs text-gray-500">
                      {moment(report.reportedAt).format("DD/MM/YYYY HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
              {selectedComment.reportDetails?.length === 0 && (
                <p className="text-gray-500 text-sm italic">Không có dữ liệu.</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReportCommentPage;
