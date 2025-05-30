import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar, Button, Modal, Tabs, TabsProps } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import TabContentProfile from "./TabContentProfile";
import Footer from "../../components/Footer";
import postApi from "../../apis/api/postApi";

const Profile = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState<"followers" | "following">("followers");

  const [myPosts, setMyPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [sharedPosts, setSharedPosts] = useState([]);
  const navigate = useNavigate();

  const mockFollowers = [
    {
      id: "u1",
      name: "Nguyễn Văn A",
      avatar: "https://i.pravatar.cc/150?img=1",
      isFollowingBack: true,
    },
    {
      id: "u2",
      name: "Trần Thị B",
      avatar: "https://i.pravatar.cc/150?img=2",
      isFollowingBack: false,
    },
    {
      id: "u3",
      name: "Lê Văn C",
      avatar: "https://i.pravatar.cc/150?img=3",
      isFollowingBack: true,
    },
  ];

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Posts",
      children: <TabContentProfile data={myPosts} />,
    },
    {
      key: "2",
      label: "Saved",
      children: <TabContentProfile data={savedPosts} />,
    },
    {
      key: "3",
      label: "Liked",
      children: <TabContentProfile data={likedPosts} />,
    },
    {
      key: "4",
      label: "Shared",
      children: <TabContentProfile data={sharedPosts} type="shared"/>,
    },
  ];

  const handleOpenModal = (type: "followers" | "following") => {
    setPopupType(type);
    setShowPopup(true);
  };

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const [myRes, likeRes, saveRes, shareRes] = await Promise.all([
          postApi.getMyPosts(),
          postApi.getLikedPosts(),
          postApi.getSavedPosts(),
          postApi.getSharedPosts(),
        ]);
        setMyPosts(myRes.data);
        setLikedPosts(likeRes.data);
        setSavedPosts(saveRes.data);
        setSharedPosts(shareRes.data);
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
      }
    };

    fetchAllPosts();
  }, []);

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
              <p>2 bài viết</p>
              <p onClick={() => handleOpenModal("followers")}>69 người theo dõi</p>
              <p onClick={() => handleOpenModal("following")}>Đang theo dõi 111</p>
            </div>
            <div className="profile-bio">
              <span>Đây là phần giới thiệu bản thân.</span>
            </div>
          </div>
        </div>
        <div className="profile-tabs">
          <Tabs centered defaultActiveKey="1" items={items} />
        </div>
        <Footer />
      </div>
      <Modal
        open={showPopup}
        onCancel={() => setShowPopup(false)}
        footer={null}
        title={
          <div className="text-xl font-semibold text-center">
            {popupType === "followers" ? "Người theo dõi bạn" : "Bạn đang theo dõi"}
          </div>
        }
        centered
      >
        <div className="max-h-[400px] overflow-y-auto space-y-4">
          {mockFollowers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <Avatar src={user.avatar} size={48} />
                <span className="font-medium text-gray-800">{user.name}</span>
              </div>
              {popupType === "followers" ? (
                <Button danger className="!h-8 !px-3 !text-sm">
                  Xóa theo dõi
                </Button>
              ) : (
                <Button type="default" className="!h-8 !px-3 !text-sm">
                  Hủy theo dõi
                </Button>
              )}
            </div>
          ))}
        </div>
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
