import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar, Button, Dropdown, Modal, Tabs, TabsProps, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { MoreOutlined, UserOutlined } from "@ant-design/icons";
import TabContentProfile from "./TabContentProfile";
import Footer from "../../components/Footer";
import postApi from "../../apis/api/postApi";
import userApi from "../../apis/api/userApi";
import toast from "react-hot-toast";
import imgNotFound from "../../assets/notFound.svg";
import EmptyTab from "./TabContentProfile/EmtyTab";

const Profile = () => {
  const { id } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState<"followers" | "following">("followers");

  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [sharedPosts, setSharedPosts] = useState([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [followList, setFollowList] = useState<any[]>([]);


  const navigate = useNavigate();

  const isMe = !id;

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Posts",
      children: posts.length > 0 ? (
        <TabContentProfile data={posts} />
      ) : (
        <EmptyTab message={isMe ? "Bạn chưa đăng bài viết nào" : "Người này chưa có bài viết nào"} />
      ),
    },
    {
      key: "2",
      label: "Saved",
      children: savedPosts.length > 0 ? (
        <TabContentProfile data={savedPosts} />
      ) : (
        <EmptyTab message="Chưa có bài viết nào được lưu" />
      ),
    },
    {
      key: "3",
      label: "Liked",
      children: likedPosts.length > 0 ? (
        <TabContentProfile data={likedPosts} />
      ) : (
        <EmptyTab message="Chưa có bài viết nào được thích" />
      ),
    },
    {
      key: "4",
      label: "Shared",
      children: sharedPosts.length > 0 ? (
        <TabContentProfile data={sharedPosts} type="shared" />
      ) : (
        <EmptyTab message="Chưa có bài viết nào được chia sẻ" />
      ),
    },
  ];

  const itemsRender: TabsProps["items"] = isMe
  ? items
  : items.filter((item) => item.key !== "2" && item.key !== "3");

  const handleOpenModal = async (type: "followers" | "following") => {
    setPopupType(type);
    setShowPopup(true);

    const ids = userInfo?.[type] || [];

    if (ids.length > 0) {
      try {
        const res = await userApi.getUsersByIds(ids);
        setFollowList(res.data);
      } catch (err) {
        toast.error("Không thể tải danh sách người dùng");
      }
    } else {
      setFollowList([]);
    }
  };

  const refreshCurrentUser = async () => {
    try {
      const res = await userApi.getCurrentUser();
      setCurrentUserId(res.data._id);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi lấy current user:", error);
      return null;
    }
  };

  const handleToggleFollow = async (targetId: string, isFollow: boolean) => {
    try {
      if (isFollow) {
        await userApi.unfollowUser(targetId);
        message.success("Đã hủy theo dõi");
      } else {
        await userApi.followUser(targetId);
        message.success("Đã theo dõi");
      }

      const updated = await refreshCurrentUser();
      setIsFollowing(updated?.following?.some((u: any) => u._id === targetId));

      if (!isMe) {
        const res = await userApi.getUserById(id!);
        setUserInfo(res.data);
      }
    } catch {
      message.error("Không thể thực hiện thao tác theo dõi");
    }
  };

  const handleToggleBlock = async (targetId: string, isBlock: boolean) => {
    try {
      if (isBlock) {
        await userApi.unblockUser(targetId);
        message.success("Đã bỏ chặn người dùng");
      } else {
        await userApi.blockUser(targetId);
        message.success("Đã chặn người dùng");
      }

      const updated = await refreshCurrentUser();
      setIsBlocked(updated?.blockedUsers?.includes(targetId));
    } catch {
      message.error("Không thể thực hiện thao tác chặn");
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [currentUserRes, profileRes, postRes, likeRes, saveRes, shareRes] =
          await Promise.all([
            userApi.getCurrentUser(),
            isMe ? userApi.getCurrentUser() : userApi.getUserById(id!),
            isMe ? postApi.getMyPosts() : postApi.getPostsByUserId(id!),
            isMe ? postApi.getLikedPosts() : Promise.resolve({ data: [] }),
            isMe ? postApi.getSavedPosts() : Promise.resolve({ data: [] }),
            isMe ? postApi.getSharedPosts() : Promise.resolve({ data: [] }),
          ]);

        const currentId = currentUserRes.data._id;
        setCurrentUserId(currentId);

        const currentUser = currentUserRes.data;
        if (!isMe) {
          setIsFollowing(currentUser.following?.some((u: any) => u._id === id));
          setIsBlocked(currentUser.blockedUsers?.includes(id));
        }

        setUserInfo(profileRes.data);
        setPosts(postRes.data);
        setLikedPosts(likeRes.data);
        setSavedPosts(saveRes.data);
        setSharedPosts(shareRes.data);
      } catch (err) {
        message.error("Không thể tải dữ liệu hồ sơ");
      }
    };

    fetchAll();
  }, [id]);

  return (
    <StyleProfile>
      <div className="profile-wrapper">
        <div className="profile-header">
          <Avatar
            size={100}
            src={userInfo?.avatar}
            icon={!userInfo?.avatar && <UserOutlined />}
            className="profile-avatar"
          />
          <div className="profile-info">
            <div className="profile-actions">
              <h2 className="username">{userInfo?.nameDisplay || userInfo?.userName || ""}</h2>

              {isMe ? (
                <>
                  <Button onClick={() => navigate("/profile/edit")}>Chỉnh sửa hồ sơ</Button>
                  <Button onClick={() => navigate("/profile/liked")}>Xem kho đã thích</Button>
                </>
              ) : currentUserId !== id ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Button
                    type={isFollowing ? "default" : "primary"}
                    onClick={() => handleToggleFollow(id!, isFollowing)}
                  >
                    {isFollowing ? "Hủy theo dõi" : "Theo dõi"}
                  </Button>

                  <Dropdown
                    trigger={["click"]}
                    menu={{
                      items: [
                        {
                          key: "report",
                          label: "Báo cáo",
                        },
                        {
                          key: "block",
                          label: isBlocked ? "Bỏ chặn" : "Chặn",
                        },
                      ],
                      onClick: ({ key }) => {
                        if (key === "block") handleToggleBlock(id!, isBlocked);
                        else if (key === "report") message.info("Chức năng báo cáo đang phát triển");
                      },
                    }}
                  >
                    <Button icon={<MoreOutlined />} />
                  </Dropdown>
                </div>
              ) : null}
            </div>

            <div className="profile-stats">
              <p>{posts.length} bài viết</p>
              <p onClick={() => handleOpenModal("followers")}>
                {userInfo?.followers?.length || 0} người theo dõi
              </p>
              <p onClick={() => handleOpenModal("following")}>
                Đang theo dõi {userInfo?.following?.length || 0} người
              </p>
            </div>

            <div className="profile-bio">
              <span>{userInfo?.bio || "Chưa có giới thiệu."}</span>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          <Tabs centered defaultActiveKey="1" items={itemsRender} />
        </div>

        <Footer />
      </div>

      {/* Modal hiển thị danh sách followers/following */}
      <Modal
        open={showPopup}
        onCancel={() => setShowPopup(false)}
        footer={null}
        title={
          <div className="text-xl font-semibold text-center">
            {popupType === "followers"
              ? isMe
                ? "Người theo dõi bạn"
                : "Người theo dõi họ"
              : isMe
                ? "Bạn đang theo dõi"
                : "Họ đang theo dõi"}
          </div>
        }
        centered
      >
        <div className="max-h-[400px] overflow-y-auto space-y-4 px-2">
          {followList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
              <img src={imgNotFound} alt="empty" className="w-40 h-40 mb-4 opacity-70" />
              <p>
                {popupType === "followers"
                  ? isMe
                    ? "Chưa có ai theo dõi bạn"
                    : "Người này chưa có người theo dõi"
                  : isMe
                    ? "Bạn chưa theo dõi ai"
                    : "Người này chưa theo dõi ai"}
              </p>
            </div>
          ) : (
            followList.map((user: any) => {
              const isFollowing = userInfo?.following?.includes(user._id);
              const isCurrentUser = currentUserId === user._id;

              return (
                <div
                  key={user._id}
                  className="flex items-center justify-between px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={user.avatar} size={48} />
                    <span className="font-medium text-gray-800">
                      {user.nameDisplay || user.userName}
                    </span>
                  </div>
                  {!isCurrentUser && (
                    <Button
                      type="default"
                      className="!h-8 !px-3 !text-sm"
                      onClick={() => handleToggleFollow(user._id, isFollowing)}
                    >
                      {isFollowing ? "Hủy theo dõi" : "Theo dõi"}
                    </Button>
                  )}
                </div>
              );
            })
          )}
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
      margin: 0;
      font-size: 14px;
      cursor: pointer;
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