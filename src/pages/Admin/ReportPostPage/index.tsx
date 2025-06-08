/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Button, Tag, Space, Popconfirm, Tooltip, message, Modal } from "antd";
import AdminTable from "../components/AdminTable";
import adminApi from "../../../apis/api/adminApi";
import moment from "moment";
import postApi from "../../../apis/api/postApi";

const ReportPostPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postDetailModalOpen, setPostDetailModalOpen] = useState(false);
  const [postDetail, setPostDetail] = useState<any>(null);


  const getDataListReport = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getReportedPosts();
      setData(res.data);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách báo cáo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataListReport();
  }, []);


  const handleBanPost = async (record: any) => {
    try {
      await adminApi.banPost(record._id);
      message.success("Đã khóa bài viết.");
      getDataListReport();
    } catch (err) {
      console.error(err);
      message.error("Không thể khóa bài viết.");
    }
  };

  const handleUnbanPost = async (record: any) => {
    try {
      await adminApi.unbanPost(record._id);
      message.success("Đã mở khóa bài viết.");
      getDataListReport();
    } catch (err) {
      console.error(err);
      message.error("Không thể mở khóa bài viết.");
    }
  };

  const handleDeleteReports = async (record: any) => {
    try {
      await adminApi.deletePostReports(record._id);
      message.success("Đã xoá toàn bộ báo cáo bài viết.");
      getDataListReport();
    } catch (err) {
      console.error(err);
      message.error("Không thể xóa báo cáo.");
    }
  };

  const handleViewPostDetail = async (postId: string) => {
    try {
      setLoading(true);
      const res = await postApi.getPostById(postId);
      setPostDetail(res.data);
      setPostDetailModalOpen(true);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải chi tiết bài viết.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record: any) => {
    setSelectedPost(record);
    setShowPostModal(true);
  };

  const columns = [
    {
      title: "Người đăng",
      key: "author",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          <img src={record?.authorAvatar || "/default-avatar.png"} className="w-6 h-6 rounded-full" />
          <span>{record.authorName || ""}</span>
        </div>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (_: string, record: any) => (
        <Tooltip title={record.content}>
          <span
            className="inline-block max-w-[250px] truncate text-blue-600 hover:underline cursor-pointer"
            onClick={() => handleViewPostDetail(record.postId || record._id)}
          >
            {record.content}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Số lượt báo cáo",
      dataIndex: "reportCount",
      key: "reportCount",
      render: (count: number) => (
        <Tag color={count >= 5 ? "red" : "orange"}>{count}</Tag>
      ),
    },
    {
      title: "Ngày báo cáo gần nhất",
      dataIndex: "lastReportedAt",
      key: "lastReportedAt",
      render: (val: string) => (val ? moment(val).format("DD/MM/YYYY HH:mm") : "-"),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" type="link" onClick={() => handleView(record)}>
            Xem báo cáo
          </Button>
          {record.status === "HIDDEN" ? (
            <Popconfirm
              title="Mở khóa báo cáo bài viết?"
              onConfirm={() => handleUnbanPost(record)}
              okText="Mở"
              cancelText="Hủy"
            >
              <Button size="small">Mở khóa</Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Khóa bài viết này?"
              onConfirm={() => handleBanPost(record)}
              okText="Khóa"
              cancelText="Hủy"
            >
              <Button size="small" danger>
                Khóa
              </Button>
            </Popconfirm>
          )}
          <Popconfirm
            title="Xoá toàn bộ báo cáo của bài viết này?"
            onConfirm={() => handleDeleteReports(record)}
            okText="Xoá"
            cancelText="Hủy"
          >
            <Button size="small" type="dashed">
              Xoá báo cáo
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];


  return (
    <>
      <AdminTable
        columns={columns}
        data={data}
        loading={loading}
        pageSize={10}
        scrollX={1000}
      />
      <Modal
        open={showPostModal}
        onCancel={() => setShowPostModal(false)}
        footer={null}
        centered
        title="Chi tiết bài viết"
        width={600}
      >
        {selectedPost && (
          <div className="space-y-4">
            {/* Header: Avatar + Info */}
            <div className="flex items-center gap-3">
              <img
                src={selectedPost.authorAvatar || "/default-avatar.png"}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <p className="font-semibold text-base">
                  {selectedPost.authorName || "(Chưa đặt tên hiển thị)"}
                </p>
                <p className="text-sm text-gray-500">@{selectedPost.author?.userName}</p>
              </div>
            </div>

            {/* Nội dung bài viết */}
            <div className="text-gray-800 whitespace-pre-line">
              {selectedPost.content || "Không có nội dung"}
            </div>

            {/* Ảnh bài viết nếu có */}
            {selectedPost.photoUrls?.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {selectedPost.photoUrls.map((img: any, index: number) => (
                  <img
                    key={index}
                    src={img.url}
                    alt={`image-${index}`}
                    className="w-full h-40 object-cover rounded-md border"
                  />
                ))}
              </div>
            )}

            {/* Trạng thái bài viết */}
            <div>
              <p className="text-sm font-medium text-gray-600">Trạng thái bài viết:</p>
              <Tag color={selectedPost.status === "HIDDEN" ? "volcano" : "green"}>
                {selectedPost.status === "HIDDEN" ? "Đã bị khóa" : "Hoạt động"}
              </Tag>
            </div>

            {/* Số lượt báo cáo */}
            <div>
              <p className="text-sm font-medium text-gray-600">Số lượt báo cáo:</p>
              <Tag color={selectedPost.reportCount >= 5 ? "red" : "orange"}>{selectedPost.reportCount}</Tag>
            </div>

            {/* Danh sách người báo cáo */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Chi tiết các báo cáo:</p>
              {selectedPost.reportDetails?.map((report: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 border-b pb-2">
                  <img
                    src={report.reporterAvatar || "/default-avatar.png"}
                    className="w-8 h-8 rounded-full object-cover border"
                    alt="reporter-avatar"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{report.reporterName || "Ẩn danh"}</span>
                      <Tag
                        color={report.reportStatus === "PENDING" ? "orange" : "green"}
                        className="text-xs"
                      >
                        {report.reportStatus === "PENDING" ? "Chờ xử lý" : "Đã xử lý"}
                      </Tag>
                    </div>
                    <p className="text-sm text-gray-600 italic">"{report.reason}"</p>
                    <p className="text-xs text-gray-500">
                      {moment(report.reportedAt).format("DD/MM/YYYY HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
              {selectedPost.reportDetails?.length === 0 && (
                <p className="text-gray-500 text-sm italic">Không có dữ liệu.</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={postDetailModalOpen}
        onCancel={() => setPostDetailModalOpen(false)}
        footer={null}
        centered
        title="Nội dung đầy đủ của bài viết"
        width={700}
      >
        {postDetail && (
          <div className="space-y-4">
            {/* Người đăng */}
            <div className="flex items-center gap-3">
              <img
                src={postDetail.userId?.avatar || "/default-avatar.png"}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div>
                <p className="font-semibold text-base">
                  {postDetail.userId?.nameDisplay || postDetail.userId?.userName || "Không xác định"}
                </p>
              </div>
            </div>

            {/* Nội dung */}
            <div className="text-gray-800 whitespace-pre-line">
              {postDetail.content || "Không có nội dung"}
            </div>

            {/* Ảnh nếu có */}
            {postDetail.photoUrls?.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {postDetail.photoUrls.map((img: any, idx: number) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={`img-${idx}`}
                    className="w-full h-40 object-cover rounded-md border"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

    </>
  );
};

export default ReportPostPage;
