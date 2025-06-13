/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import userApi from "../../apis/api/userApi";
import Footer from "../Footer";
import CartUser from "../CartUser";

interface Props {
  data?: any;
}

export default function SideBarRight({ data }: Props) {
  const navigate = useNavigate();
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [avatarError, setAvatarError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        setLoading(true);
        const res = await userApi.getRecommendedUsers();
        const rawUsers = res?.data || [];
        const topFive = rawUsers.slice(0, 5).map((user: any) => ({
          _id: user._id || user.id,
          avatar: typeof user.avatar === "string" ? user.avatar : "",
          name: user.nameDisplay || user.userName,
          des: "",
          isFollowing: user.isFollowing || false,
          bio: user?.bio,
        }));
        setSuggestedUsers(topFive);
      } catch (error) {
        toast.error("Error while getting user suggestion");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  return (
    <div className="mt-9 pl-8 max-w-sm w-full flex flex-col gap-6">
      <div className="flex items-center gap-4 px-4">
        <Avatar
          size="large"
          src={!avatarError && data?.avatar ? data.avatar : undefined}
          icon={<UserOutlined />}
          onError={() => {
            setAvatarError(true);
            return false;
          }}
        />
        <div className="flex flex-col">
          <span
            className="font-semibold text-sm text-gray-800 cursor-pointer hover:underline"
            onClick={() => navigate("/profile")}
          >
            {data?.nameDisplay || data?.userName || "Người dùng"}
          </span>
          <span className="text-xs text-gray-500">
            {data?.createdAt
              ? `Member since ${moment(data.createdAt).format("MMMM YYYY")}`
              : "Loading information..."}
          </span>
        </div>
      </div>

      <div className="px-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500 font-semibold">
            Suggestions for you
          </span>
          <button
            className="cursor-pointer text-xs text-blue-500 hover:underline"
            onClick={() => navigate("/suggest-friend")}
          >
            View all
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {loading ? (
            <Spin />
          ) : suggestedUsers.length > 0 ? (
            suggestedUsers.map((user) => (
              <CartUser dataItem={user} key={user._id} size="medium" />
            ))
          ) : (
            <div className="text-sm text-gray-400 text-center py-3">
              No suggestions
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
