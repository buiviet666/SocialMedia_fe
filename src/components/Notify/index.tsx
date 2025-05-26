import React, { useState } from "react";
import styled from "styled-components";
import { Avatar, List, Tabs } from "antd";
import { HeartOutlined, MessageOutlined, UserAddOutlined } from "@ant-design/icons";

const mockNotifications = [
  {
    id: 1,
    type: "like",
    user: "Linh Chi",
    avatar: "https://i.pravatar.cc/150?img=1",
    time: "2 giờ trước",
    message: "đã thích bài viết của bạn",
  },
  {
    id: 2,
    type: "follow",
    user: "Jack Nguyen",
    avatar: "https://i.pravatar.cc/150?img=2",
    time: "5 giờ trước",
    message: "đã bắt đầu theo dõi bạn",
  },
  {
    id: 3,
    type: "comment",
    user: "Trà My",
    avatar: "https://i.pravatar.cc/150?img=3",
    time: "1 ngày trước",
    message: "đã bình luận: Tuyệt vời quá!",
  },
  {
    id: 4,
    type: "like",
    user: "Minh Tuấn",
    avatar: "https://i.pravatar.cc/150?img=4",
    time: "2 ngày trước",
    message: "đã thích bài viết của bạn",
  },
];

const iconMap: Record<string, React.ReactNode> = {
  like: <HeartOutlined style={{ color: "red" }} />,
  follow: <UserAddOutlined style={{ color: "#1890ff" }} />,
  comment: <MessageOutlined style={{ color: "#52c41a" }} />,
};

const Notify = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredData =
    activeTab === "all"
      ? mockNotifications
      : mockNotifications.filter((item) => item.type === activeTab);

  return (
    <StyleNotify>
      <Tabs
        defaultActiveKey="all"
        onChange={(key) => setActiveTab(key)}
        centered
        items={[
          { key: "all", label: "Tất cả" },
          { key: "follow", label: "Người theo dõi" },
          { key: "like", label: "Lượt thích" },
          { key: "comment", label: "Bình luận" },
        ]}
      />
      <List
        itemLayout="horizontal"
        dataSource={filteredData}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={
                <span>
                  <b>{item.user}</b> {item.message}
                </span>
              }
              description={item.time}
            />
            <div>{iconMap[item.type]}</div>
          </List.Item>
        )}
      />
    </StyleNotify>
  );
};

export default Notify;

const StyleNotify = styled.div`
  padding: 8px;
  max-height: 80vh;
  overflow-y: auto;

  .ant-tabs-nav {
    margin-bottom: 8px;
  }

  .ant-list-item {
    align-items: center;
    padding: 8px 0;
  }
`;