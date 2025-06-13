/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar, Button, Dropdown, Modal, Tabs, TabsProps } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { MoreOutlined, UserOutlined } from "@ant-design/icons";
import TabContentProfile from "./TabContentProfile";
import Footer from "../../components/Footer";
import postApi from "../../apis/api/postApi";
import userApi from "../../apis/api/userApi";
import toast from "react-hot-toast";
import EmptyTab from "./TabContentProfile/EmtyTab";
import reportApi from "../../apis/api/reportApi";
import ModalListUser from "./ModalListUser";
import ModalReport from "../../components/Modal/ModalReport";

const reasonReport = [
    "Fake account",
    "Spam or scam",
    "Hate speech or abusive language",
    "Inappropriate content",
    "Other",
  ]

const Profile = () => {
  const { id } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState<"followers" | "following">("followers");

  const [inforCurrentUser, setInforCurrentUser] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [sharedPosts, setSharedPosts] = useState([]);

  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [followList, setFollowList] = useState<any[]>([]);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const navigate = useNavigate();
  const isMe = !id;
  
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Posts",
      children: posts.length > 0 ? (
        <TabContentProfile data={posts} />
      ) : (
        <EmptyTab message={isMe ? "You have not posted any posts" : "This person has not posted any posts"} />
      ),
    },
    {
      key: "2",
      label: "Saved",
      children: savedPosts.length > 0 ? (
        <TabContentProfile data={savedPosts} />
      ) : (
        <EmptyTab message="No posts saved yet" />
      ),
    },
    {
      key: "3",
      label: "Liked",
      children: likedPosts.length > 0 ? (
        <TabContentProfile data={likedPosts} />
      ) : (
        <EmptyTab message="No posts have been liked yet" />
      ),
    },
    {
      key: "4",
      label: "Shared",
      children: sharedPosts.length > 0 ? (
        <TabContentProfile data={sharedPosts} type="shared" />
      ) : (
        <EmptyTab message="No posts have been shared yet" />
      ),
    },
  ];

  const itemsRender: TabsProps["items"] = isMe
  ? items
  : items.filter((item) => item.key !== "2" && item.key !== "3");

  const handleOpenModal = async (type: "followers" | "following") => {
    setPopupType(type);
    setShowPopup(true);

    const list = (isMe ? inforCurrentUser : userInfo)?.[type] || [];

    if (list.length > 0) {
      try {
        const res: any = await userApi.getUsersByIds(list);
        if (res?.statusCode === 200) {
          setFollowList(res.data);
        }
      } catch (err) {
        toast.error("Unable to load user list");
        console.log(err);
      }
    } else {
      setFollowList([]);
    }
  };

  const refreshCurrentUser = async () => {
    try {
      const res: any = await userApi.getCurrentUser();
      if (res?.statusCode === 200) {
        setInforCurrentUser(res?.data);
      }
    } catch (error) {
      toast.error("Error when getting current user");
      console.log(error);
    }
  };

  const handleToggleFollow = async () => {
    try {
      if (isFollowing) {
        await userApi.unfollowUser(userInfo._id);
        toast.success("Unfollowed");
        setIsFollowing(false);
      } else {
        await userApi.followUser(userInfo._id);
        toast.success("Followed");
        setIsFollowing(true);
      }
      const res = await userApi.getUserById(userInfo._id);
      setUserInfo(res?.data);
    } catch {
      toast.error("Unable to perform tracking operation");
    }
  };

  const handleToggleBlock = async (targetId: string) => {
    try {
      if (isBlocked) {
        await userApi.unblockUser(targetId);
        toast.success("Unblocked user");
        setIsBlocked(false);
        fetchAll();
      } else {
        await userApi.blockUser(targetId);
        toast.success("Blocked user");
        setIsBlocked(true);
      }
      const res = await userApi.getUserById(targetId);
      setUserInfo(res?.data);
      const current: any = await refreshCurrentUser();
      if (current) {
        setIsBlocked(current.blockedUsers?.includes(targetId));
      }
    } catch {
      toast.error("Unable to perform block operation");
    }
  };

  const handleReportUser = async (data: { targetId: string; reason: string }) => {
    try {
      const { targetId, reason } = data;
      if (!reason.trim()) {
        return toast.error("Please enter reason for reporting!");
      }

      await reportApi.reportUser({ targetUserId: targetId, reason });
      toast.success("User report sent");
      setIsReportModalOpen(false);
    } catch (error: any) {
      console.log(error);
      toast.error("Unable to operation");
    }
  };

  const fetchAll = async () => {
    try {
      refreshCurrentUser();
      if (isMe) {
        const [resDataPostsAll, resDataLikedPosts, resDataSavedPosts, resDataSharedPosts] = await Promise.all([
          postApi.getMyPosts(),
          postApi.getLikedPosts(),
          postApi.getSavedPosts(),
          postApi.getSharedPosts(),
        ]);
        setPosts(resDataPostsAll?.data);
        setLikedPosts(resDataLikedPosts?.data);
        setSavedPosts(resDataSavedPosts?.data);
        setSharedPosts(resDataSharedPosts?.data);
      } else if (!isMe) {
        const [resDataUser, resDataPosts, resDataSharedPosts] = await Promise.all([
          userApi.getUserById(id!),
          postApi.getPostsByUserId(id!),
          postApi.getSharesByUserId(id!)
        ]);
        setUserInfo(resDataUser?.data);
        setPosts(resDataPosts?.data);
        setSharedPosts(resDataSharedPosts?.data);
      };
    } catch (error) {
      toast.error("Unable to load profile data");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [id]);

  useEffect(() => {
    if (inforCurrentUser && userInfo) {
      const blocked = inforCurrentUser?.blockedUsers?.includes(userInfo._id);
      const following = userInfo?.followers?.some((f: any) => f._id === inforCurrentUser._id);

      setIsBlocked(blocked);
      setIsFollowing(following);

      if (blocked) {
        toast.error("This user has been blocked");
        setPosts([]);
        setSharedPosts([]);
      }
    }
  }, [inforCurrentUser, userInfo]);

  return (
    <StyleProfile>
      <div className="profile-wrapper">
        <div className="profile-header">
          <Avatar
            size={100}
            src={
              isMe
                ? inforCurrentUser?.avatar || undefined
                : userInfo?.avatar || undefined
            }
            icon={
              (isMe && !inforCurrentUser?.avatar) || (!isMe && !userInfo?.avatar)
                ? <UserOutlined />
                : undefined
            }
            className="profile-avatar"
          />
          <div className="profile-info">
            <div className="profile-actions">
              <h2 className="username">{isMe ? inforCurrentUser?.nameDisplay || inforCurrentUser?.userName || "" : userInfo?.nameDisplay || userInfo?.userName || ""}</h2>

              {isMe ? (
                <>
                  <Button onClick={() => navigate("/profile/edit")}>Edit profile</Button>
                  {/* <Button onClick={() => navigate("/profile/liked")}>View liked inventory</Button> */}
                </>
              ) : 
              inforCurrentUser?._id !== id ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Button
                    type={isFollowing ? "default" : "primary"}
                    onClick={() => handleToggleFollow()}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>

                  <Dropdown
                    trigger={["click"]}
                    menu={{
                      items: [
                        {
                          key: "report",
                          label: "Report",
                        },
                        {
                          key: "block",
                          label: isBlocked ? "UnBlock" : "Block",
                        },
                      ],
                      onClick: ({ key }) => {
                        if (key === "block") handleToggleBlock(userInfo._id);
                        else if (key === "report") setIsReportModalOpen(true);
                      },
                    }}
                  >
                    <Button icon={<MoreOutlined />} />
                  </Dropdown>
                </div>
              ) : null}
            </div>

            <div className="profile-stats">
              <p>{posts.length} Post</p>
              <p onClick={() => handleOpenModal("followers")}>
                {isMe ? inforCurrentUser?.followers?.length || 0 : userInfo?.followers?.length || 0} followers
              </p>
              <p onClick={() => handleOpenModal("following")}>
                Following {isMe ? inforCurrentUser?.following?.length || 0 : userInfo?.following?.length || 0}
              </p>
            </div>

            <div className="profile-bio">
              <span>{isMe ? inforCurrentUser?.bio : userInfo?.bio || "No introduction yet."}</span>
            </div>
          </div>
        </div>
        <div className="profile-tabs">
          <Tabs centered defaultActiveKey="1" items={itemsRender} />
        </div>
        <Footer />
      </div>

      <Modal
        open={showPopup}
        onCancel={() => setShowPopup(false)}
        footer={null}
        title={
          <div className="text-xl font-semibold text-center">
            {popupType === "followers"
              ? isMe ? "Your followers" : "Their followers"
              : isMe ? "You are following" : "They are following"}
          </div>
        }
        centered
      >
        <ModalListUser
          dataUser={isMe? inforCurrentUser : userInfo}
          followList={followList}
          checkUser={isMe} 
          popupType={popupType}
          currentUser={inforCurrentUser}
          refreshCurrentUser={refreshCurrentUser}
          setShowPopup={setShowPopup}
        />
      </Modal>

      <ModalReport
        open={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={({targetId, reason}) => {
          handleReportUser({targetId, reason})
        }}
        targetId={id!}
        targetType="USER"
        reportReasons={reasonReport}
        title="Report Post"
      />
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

    p:first-child {
      cursor: unset;
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