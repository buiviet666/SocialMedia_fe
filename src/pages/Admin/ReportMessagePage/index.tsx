import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Modal, Tooltip, message, Popconfirm } from "antd";
import adminApi from "../../../apis/api/adminApi";
import moment from "moment";

const ReportMessagePage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchReportedMessages = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getReportedMessages();
      setData(res.data);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách báo cáo tin nhắn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedMessages();
  }, []);

  const handleBan = async (id: string) => {
    try {
      await adminApi.banMessage(id);
      message.success("Đã ẩn tin nhắn.");
      fetchReportedMessages();
    } catch (err) {
      message.error("Không thể ẩn tin nhắn.");
    }
  };

  const handleUnban = async (id: string) => {
    try {
      await adminApi.unbanMessage(id);
      message.success("Đã mở lại tin nhắn.");
      fetchReportedMessages();
    } catch (err) {
      message.error("Không thể mở lại tin nhắn.");
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await adminApi.resolveMessageReports(id);
      message.success("Đã gỡ tất cả báo cáo.");
      fetchReportedMessages();
    } catch (err) {
      message.error("Không thể gỡ báo cáo.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.deleteMessage(id);
      message.success("Đã xóa tin nhắn và báo cáo.");
      fetchReportedMessages();
    } catch (err) {
      message.error("Không thể xóa.");
    }
  };

  const columns = [
    {
      title: "Người gửi",
      key: "sender",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          <img src={record.sender?.avatar || "/default-avatar.png"} className="w-6 h-6 rounded-full" />
          <span>{record.sender?.nameDisplay || record.sender?.userName}</span>
        </div>
      )
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (text: string, record: any) => (
        <Tooltip title={text}>
          <span
            className="text-blue-600 hover:underline cursor-pointer max-w-[300px] truncate inline-block"
            onClick={() => {
              setSelected(record);
              setShowModal(true);
            }}
          >
            {text}
          </span>
        </Tooltip>
      )
    },
    {
      title: "Lượt báo cáo",
      dataIndex: "reportCount",
      key: "reportCount",
      render: (count: number) => <Tag color={count >= 5 ? "red" : "orange"}>{count}</Tag>
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "HIDDEN" ? "volcano" : "green"}>
          {status === "HIDDEN" ? "Đã bị ẩn" : "Bình thường"}
        </Tag>
      )
    },
    {
      title: "Thời gian gần nhất",
      dataIndex: "lastReportedAt",
      key: "lastReportedAt",
      render: (val: string) => moment(val).format("DD/MM/YYYY HH:mm")
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: any) => {
        const hasPending = record.reportDetails?.some((r: any) => r.status === "PENDING");
        return (
          <div className="flex gap-2">
            {record.status === "HIDDEN" ? (
              <Button size="small" onClick={() => handleUnban(record.messageId)}>
                Mở lại
              </Button>
            ) : (
              <Popconfirm
                title="Ẩn tin nhắn này?"
                onConfirm={() => handleBan(record.messageId)}
                okText="Ẩn"
                cancelText="Hủy"
              >
                <Button size="small" danger>
                  Ẩn
                </Button>
              </Popconfirm>
            )}
            {hasPending && (
              <Button size="small" onClick={() => handleResolve(record.messageId)}>
                Gỡ báo cáo
              </Button>
            )}
            <Popconfirm
              title="Xóa vĩnh viễn?"
              onConfirm={() => handleDelete(record.messageId)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button size="small" type="dashed">
                Xóa
              </Button>
            </Popconfirm>
          </div>
        );
      }
    }
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Quản lý báo cáo tin nhắn</h2>
      <Table columns={columns} dataSource={data} rowKey="messageId" loading={loading} />

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        title="Chi tiết tin nhắn"
      >
        {selected && (
          <div className="space-y-4">
            <p className="text-gray-700">{selected.content}</p>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Chi tiết báo cáo:</p>
              <div className="space-y-2 max-h-60 overflow-auto">
                {selected.reportDetails?.map((report: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 border-b pb-2">
                    <img
                      src={report.reporterAvatar || "/default-avatar.png"}
                      className="w-8 h-8 rounded-full border object-cover"
                      alt="avatar"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{report.reporterName}</span>
                        <Tag
                          color={report.status === "PENDING" ? "orange" : "green"}
                          className="text-xs"
                        >
                          {report.status === "PENDING" ? "Chờ xử lý" : "Đã xử lý"}
                        </Tag>
                      </div>
                      <p className="text-sm italic">{report.reason}</p>
                      <p className="text-xs text-gray-500">
                        {moment(report.reportedAt).format("DD/MM/YYYY HH:mm")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReportMessagePage;
