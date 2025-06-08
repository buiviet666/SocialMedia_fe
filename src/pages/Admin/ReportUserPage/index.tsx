/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Button, Tag, Space, Popconfirm, message, Tooltip, Modal } from "antd";
import AdminTable from "../components/AdminTable";
import adminApi from "../../../apis/api/adminApi";
import moment from "moment";

const ReportUserPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banDays, setBanDays] = useState<number | null>(null);

  const banDurations = [
    { label: "1 day", value: 1 },
    { label: "3 days", value: 3 },
    { label: "7 days", value: 7 },
    { label: "30 days", value: 30 },
    { label: "Forever", value: -1 },
  ];


  const getDataListReport = async () => {
    try {
      setLoading(true);
      const res: any = await adminApi.getListReportUsers();
      setData(res.data);
    } catch (error) {
      console.log(error);
      message.error("Không thể tải danh sách báo cáo.");
    } finally {
      setLoading(false);
    }
  };

  const confirmBan = async () => {
    if (!banDays || !banReason.trim()) {
      return message.warning("Vui lòng chọn thời gian và nhập lý do.");
    }

    try {
      await adminApi.banUser(selectedUser.userId, {
        reason: banReason,
        banDurationDays: banDays,
      });

      message.success("Đã khóa tài khoản.");
      setBanModalOpen(false);
      setBanDays(null);
      setBanReason("");
      getDataListReport(); // reload list
    } catch (err) {
      console.log(err);
      message.error("Khóa tài khoản thất bại.");
    }
  };


  useEffect(() => {
    getDataListReport();
  }, []);

  const handleViewProfile = (record: any) => {
    setSelectedUser(record);
    setShowProfileModal(true);
  };


  const handleWarn = (record: any) => {
    message.warning(`Đã gửi cảnh cáo đến: ${record.userName}`);
  };

  const handleBan = (record: any) => {
    setSelectedUser(record);
    setBanModalOpen(true);
  };

  const handleUnban = async (record: any) => {
    try {
      await adminApi.unbanUser(record.userId);
      message.success("Đã bỏ khóa tài khoản.");
      getDataListReport();
    } catch (error) {
      console.log(error);
      message.error("Bỏ khóa thất bại.");
    }
  };

  const handleDismissReport = async (record: any) => {
    try {
      await adminApi.deleteUserReports(record.userId);
      message.success("Đã xóa tất cả báo cáo của người dùng.");
      getDataListReport(); // reload list
    } catch (err) {
      console.log(err);
      message.error("Xóa báo cáo thất bại.");
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
      sorter: (a: any, b: any) => a.userName.localeCompare(b.userName),
    },
    {
      title: "Số lượt báo cáo",
      dataIndex: "reportCount",
      key: "reportCount",
      render: (count: number) => (
        <Tag color={count >= 5 ? "red" : "orange"}>{count}</Tag>
      ),
      sorter: (a: any, b: any) => a.reportCount - b.reportCount,
    },
    {
      title: "Lý do gần nhất",
      dataIndex: "lastReason",
      key: "lastReason",
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="line-clamp-1 max-w-[200px] inline-block overflow-hidden text-ellipsis whitespace-nowrap">
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Ngày báo cáo gần nhất",
      dataIndex: "lastReportedAt",
      key: "lastReportedAt",
      render: (val: string) => (val ? moment(val).format("DD/MM/YYYY HH:mm") : "-"),
      sorter: (a: any, b: any) =>
        new Date(a.lastReportedAt || 0).getTime() - new Date(b.lastReportedAt || 0).getTime(),
    },
    {
      title: "Trạng thái",
      key: "isBanned",
      render: (_: any, record: any) => {
        if (!record.isBanned) return <Tag color="green">Hoạt động</Tag>;

        const expiredAt = record.banExpiresAt
          ? moment(record.banExpiresAt).format("DD/MM/YYYY HH:mm")
          : "Vĩnh viễn";

        return (
          <Tooltip title={`Bị khóa đến: ${expiredAt}`}>
            <Tag color="volcano">Bị khóa</Tag>
          </Tooltip>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: any) => (
        <Space direction="horizontal">
          <Button size="small" onClick={() => handleViewProfile(record)}>
            Xem hồ sơ
          </Button>
          {/* <Button size="small" type="dashed" onClick={() => handleWarn(record)}>
            Cảnh cáo
          </Button> */}
          {!record.isBanned ? (
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
          ) : (
            <Popconfirm
              title="Bỏ khóa tài khoản này?"
              onConfirm={() => handleUnban(record)}
              okText="Bỏ khóa"
              cancelText="Hủy"
            >
              <Button size="small" type="default">
                Bỏ khóa
              </Button>
            </Popconfirm>
          )}
          <Button size="small" type="link" onClick={() => handleDismissReport(record)}>
            Gỡ báo cáo
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Báo cáo người dùng</h2>
      <AdminTable
        columns={columns}
        data={data}
        loading={loading}
        pageSize={10}
        scrollX={1000}
      />
      <Modal
        open={showProfileModal}
        onCancel={() => setShowProfileModal(false)}
        footer={null}
        title={null}
        centered
        width={600}
      >
        {selectedUser && (
          <div className="p-4 rounded-lg space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={selectedUser.avatar || "/default-avatar.png"}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border border-gray-300"
              />
              <div>
                <p className="text-xl font-semibold">
                  {selectedUser.nameDisplay || "(Chưa đặt tên hiển thị)"}
                </p>
                <p className="text-gray-500 text-sm">@{selectedUser.userName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">Email:</p>
                <p>{selectedUser.email}</p>
              </div>

              <div>
                <p className="font-medium text-gray-700">Số lượt báo cáo:</p>
                <p>
                  <Tag color={selectedUser.reportCount >= 5 ? "red" : "orange"}>
                    {selectedUser.reportCount}
                  </Tag>
                </p>
              </div>

              <div className="col-span-2">
                <p className="font-medium text-gray-700">Lý do gần nhất:</p>
                <p className="text-gray-800">{selectedUser.lastReason || "-"}</p>
              </div>

              <div>
                <p className="font-medium text-gray-700">Trạng thái tài khoản:</p>
                <p>
                  {selectedUser.isBanned ? (
                    <Tag color="volcano">Đang bị khóa</Tag>
                  ) : (
                    <Tag color="green">Hoạt động</Tag>
                  )}
                </p>
              </div>

              {selectedUser.isBanned && (
                <>
                  <div>
                    <p className="font-medium text-gray-700">Ngày bị khóa:</p>
                    <p>{moment(selectedUser.bannedAt).format("DD/MM/YYYY HH:mm")}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Hết hạn khóa:</p>
                    <p>
                      {selectedUser.banExpiresAt
                        ? moment(selectedUser.banExpiresAt).format("DD/MM/YYYY HH:mm")
                        : "Vĩnh viễn"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-medium text-gray-700">Lý do khóa:</p>
                    <p>{selectedUser.banReason || "-"}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={banModalOpen}
        onCancel={() => {
          setBanModalOpen(false);
          setBanDays(null);
          setBanReason("");
        }}
        onOk={confirmBan}
        okText="Khóa"
        cancelText="Hủy"
        title={`Khóa tài khoản ${selectedUser?.userName || ""}`}
        centered
      >
        <div className="space-y-4">
          <div>
            <p className="font-medium">Chọn thời gian khóa:</p>
            <div className="flex gap-2 flex-wrap mt-2">
              {banDurations.map((d) => (
                <Button
                  key={d.value}
                  type={banDays === d.value ? "primary" : "default"}
                  onClick={() => setBanDays(d.value)}
                  size="small"
                >
                  {d.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium">Lý do khóa:</p>
            <textarea
              className="w-full border rounded p-2 mt-1 min-h-[80px] outline-none focus:ring"
              placeholder="Nhập lý do..."
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
            />
          </div>
        </div>
      </Modal>

    </>
  );
};

export default ReportUserPage;
