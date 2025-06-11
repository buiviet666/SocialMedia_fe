import React, { useEffect, useState } from "react";
import notifyApi from "../../apis/api/notifyApi";
import { Tabs, Avatar, Tooltip, message as antMessage, Button } from "antd";
import { HeartOutlined, MessageOutlined, UserAddOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import moment from "moment";

const iconMap = {
  like: <HeartOutlined className="text-red-500" />,
  follow: <UserAddOutlined className="text-blue-500" />,
  comment: <MessageOutlined className="text-green-500" />,
};

const Notify = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const fetchNotifications = async () => {
    try {
      const res = await notifyApi.getAll();
      setNotifications(res.data);
    } catch (err) {
      antMessage.error("Lỗi tải thông báo");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  const handleMarkAsRead = async (id) => {
    try {
      await notifyApi.markAsRead(id);
      setNotifications((prev: any) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      antMessage.error("Không thể đánh dấu đã đọc");
    }
  };

  const handleDelete = async (id) => {
    try {
      await notifyApi.delete(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      antMessage.error("Không thể xoá thông báo");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await notifyApi.deleteAll();
      setNotifications([]);
    } catch (err) {
      antMessage.error("Không thể xoá tất cả thông báo");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notifyApi.markAllAsRead();
      setNotifications((prev: any) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      antMessage.error("Không thể đánh dấu tất cả đã đọc");
    }
  };

  return (
    <div className="p-4 max-h-[85vh] overflow-y-auto">
      <Tabs
        centered
        defaultActiveKey="all"
        onChange={(key) => setActiveTab(key)}
        items={[
          { key: "all", label: "Tất cả" },
          { key: "follow", label: "Người theo dõi" },
          { key: "like", label: "Lượt thích" },
          { key: "comment", label: "Bình luận" },
        ]}
      />

      <div className="flex justify-end gap-2 mb-2">
        <Button icon={<CheckOutlined />} onClick={handleMarkAllAsRead}>
          Đánh dấu tất cả đã đọc
        </Button>
        <Button danger icon={<DeleteOutlined />} onClick={handleDeleteAll}>
          Xoá tất cả
        </Button>
      </div>

      <ul className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <p className="text-center text-gray-500">Không có thông báo nào</p>
        ) : (
          filteredNotifications.map((item: any) => (
            <li
              key={item._id}
              className={`flex items-center justify-between p-3 rounded-lg shadow-md border hover:shadow-lg transition-all ${
                item.isRead ? "bg-white" : "bg-blue-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar src={item.sender?.avatar} />
                <div>
                  <p className="m-0 text-sm">
                    <b>{item.sender?.nameDisplay || item.sender?.userName}</b> {item.message}
                  </p>
                  <span className="text-xs text-gray-500">
                    {moment(item.createdAt).fromNow()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {iconMap[item.type]}
                {!item.isRead && (
                  <Tooltip title="Đánh dấu đã đọc">
                    <CheckOutlined
                      onClick={() => handleMarkAsRead(item._id)}
                      className="cursor-pointer text-green-600 hover:text-green-800"
                    />
                  </Tooltip>
                )}
                <Tooltip title="Xoá">
                  <DeleteOutlined
                    onClick={() => handleDelete(item._id)}
                    className="cursor-pointer text-red-500 hover:text-red-700"
                  />
                </Tooltip>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Notify;
