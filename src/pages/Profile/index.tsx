import React, { useState } from "react";
import styled from "styled-components";
import { Avatar, Button, Modal, Tabs, TabsProps } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import TabContentProfile from "./TabContentProfile";
import { mockPosts1, mockPosts2 } from "../../utils/mockdata";
import Footer from "../../components/Footer";

const Profile = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Bài đăng",
      children: <TabContentProfile data={mockPosts1} />,
    },
    {
      key: "2",
      label: "Bài lưu",
      children: <TabContentProfile data={mockPosts2} />,
    },
  ];

  return (
    <StyleProfile>
      <div className="profile-wrapper">
        <div className="profile-header">
          <Avatar
            size={100}
            icon={<UserOutlined />}
            className="profile-avatar"
          />
          <div className="profile-info">
            <div className="profile-actions">
              <h2 className="username">jacknguyen</h2>
              <Button onClick={() => navigate("/profile/edit")}>Chỉnh sửa hồ sơ</Button>
              <Button onClick={() => navigate("/profile/liked")}>Xem kho đã thích</Button>
            </div>
            <div className="profile-stats">
              <p onClick={() => setShowPopup(true)}>2 bài viết</p>
              <p>69 người theo dõi</p>
              <p>Đang theo dõi 111</p>
            </div>
            <div className="profile-bio">
              <span>Đây là phần giới thiệu bản thân.</span>
            </div>
          </div>
        </div>
        <div className="profile-tabs">
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
        <Footer />
      </div>
      <Modal
        open={showPopup}
        onOk={() => console.log("Confirm")}
        onCancel={() => setShowPopup(false)}
        okText="Ok"
        cancelText="Cancel"
        centered
      >
        <h3>Chi tiết bài viết</h3>
      </Modal>
    </StyleProfile>
  );
};

const StyleProfile = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 24px;

  .profile-wrapper {
    max-width: 935px;
    width: 100%;
  }

  .profile-header {
    display: flex;
    gap: 32px;
    align-items: center;
    padding-bottom: 24px;
    border-bottom: 1px solid #dbdbdb;
  }

  .profile-avatar {
    flex-shrink: 0;
  }

  .profile-info {
    flex: 1;
  }

  .profile-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    .username {
      font-size: 20px;
      font-weight: 600;
      margin-right: 16px;
    }
  }

  .profile-stats {
    display: flex;
    gap: 24px;
    margin-bottom: 12px;

    p {
      cursor: pointer;
      margin: 0;
      font-size: 14px;
    }
  }

  .profile-bio {
    font-size: 14px;
    color: #333;
  }

  .profile-tabs {
    margin-top: 32px;
  }
`;

export default Profile;
