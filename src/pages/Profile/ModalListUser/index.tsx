/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import imgNotFound from "../../../assets/notFound.svg";
import userApi from '../../../apis/api/userApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type Props = {
  dataUser?: any;
  currentUser?: any;
  followList?: any[];
  checkUser?: boolean;
  popupType?: 'followers' | 'following';
  refreshCurrentUser: () => void;
  setShowPopup: (state: boolean) => void;
};

const ModalListUser = ({
  dataUser,
  currentUser,
  followList: initialFollowList = [],
  checkUser,
  popupType,
  refreshCurrentUser,
  setShowPopup
}: Props) => {
    
    const [followingIds, setFollowingIds] = useState<string[]>([]);
    const [loadingIds, setLoadingIds] = useState<string[]>([]);
    const [followList, setFollowList] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        setFollowList(initialFollowList);
    }, [initialFollowList]);

    useEffect(() => {
        if (currentUser) {
        const ids = currentUser.following?.map((item: any) => item._id) || [];
        setFollowingIds(ids);
        }
    }, [currentUser]);

    const reloadFollowList = async () => {
        if (!popupType) return;

        const listIds = dataUser?.[popupType]?.map((item: any) => item._id || item) || [];
        if (listIds.length === 0) {
            setFollowList([]);
            return;
        }

        try {
            const res: any = await userApi.getUsersByIds(listIds);
            if (res?.statusCode === 200) {
            setFollowList(res.data);
            }
        } catch (err) {
            toast.error("Failed to reload list");
            console.error(err);
        }
        };

    const handleToggleFollowClick = async (userId: string, isFollowing: boolean) => {
        setLoadingIds((prev) => [...prev, userId]);
        try {
        if (isFollowing) {
            await userApi.unfollowUser(userId);
            toast.success("Unfollowed successfully");
            setFollowingIds((prev) => prev.filter((id) => id !== userId));
        } else {
            await userApi.followUser(userId);
            toast.success("Followed successfully");
            setFollowingIds((prev) => [...prev, userId]);
        }

        await refreshCurrentUser();      // cập nhật lại currentUser
        await reloadFollowList();        // cập nhật lại danh sách modal
        } catch (err: any) {
        console.error(err);
        // toast.error(err?.response?.data?.message || "Failed to perform follow action");
        } finally {
        setLoadingIds((prev) => prev.filter((id) => id !== userId));
        }
    };

    const handleClickName = (id: any) => {
        const targetPath = id?._id ? `/profile/${id._id}` : '/profile';
        if (window.location.pathname === targetPath) {
            // Nếu đã ở cùng profile → reload hoặc gọi fetchAll()
            window.location.reload(); // hoặc bạn có thể dùng state để trigger useEffect
        } else {
            navigate(targetPath);
        }
        setShowPopup(false);
    };



  return (
    <div className="max-h-[400px] overflow-y-auto space-y-4 px-2">
      {followList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
          <img src={imgNotFound} alt="empty" className="w-40 h-40 mb-4 opacity-70" />
          <p>
            {popupType === "followers"
              ? checkUser
                ? "No one is following you yet"
                : "This user has no followers yet"
              : checkUser
                ? "You are not following anyone"
                : "This user is not following anyone"}
          </p>
        </div>
      ) : (
        followList.map((user: any) => {
          const isCurrentUser = currentUser?._id === user._id;
          const isFollowing =
            popupType === "following" || followingIds.includes(user._id);

          const userFollowsMe = user.following?.some(
            (u: any) => u._id === currentUser?._id
          );
          const isFriend = isFollowing && userFollowsMe;
          const isLoading = loadingIds.includes(user._id);

          return (
            <div
              key={user._id}
              className="flex items-center justify-between px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <Avatar src={user.avatar} size={48} />
                <span 
                    className="font-medium text-gray-800" 
                    onClick={() => handleClickName(user)}>
                  {user.nameDisplay || user.userName}
                </span>
              </div>
              {!isCurrentUser && (
                <Button
                  type={isFollowing ? "default" : "primary"}
                  loading={isLoading}
                  className="!h-8 !px-3 !text-sm"
                  onClick={() => handleToggleFollowClick(user._id, isFollowing)}
                >
                  {isFriend
                    ? "Unfriend"
                    : isFollowing
                      ? "Unfollow"
                      : "Follow"}
                </Button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ModalListUser;
