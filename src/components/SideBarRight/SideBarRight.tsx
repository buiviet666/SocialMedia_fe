import styled from "styled-components";
import Footer from "../Footer";
import CartUser from "../CartUser";
import { Avatar, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import userApi from "../../apis/api/userApi";
import { useEffect, useState } from "react";
import moment from "moment";

const DEFAULT_AVATAR = "default-avatar.jpg";
const DEFAULT_AVATAR_URL = "/images/default-avatar.png"; // bạn có thể thay bằng URL CDN

export default function SideBarRight() {
  const navigate = useNavigate();
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        setLoading(true);
        const res = await userApi.getRecommendedUsers();
        const rawUsers = res?.data || [];

        const topFive = rawUsers.slice(0, 5).map((user: any) => ({
          _id: user._id || user.id,
          avatar:
            !user.avatar || user.avatar === DEFAULT_AVATAR
              ? DEFAULT_AVATAR_URL
              : user.avatar,
          name: user.nameDisplay || user.userName,
          des: '',
          isFollowing: user.isFollowing || false,
          bio: user?.bio
        }));

        setSuggestedUsers(topFive);
      } catch (error) {
        console.error("Lỗi khi lấy gợi ý người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await userApi.getCurrentUser(); // đã có rồi
        setCurrentUser(res?.data);
      } catch (error) {
        console.error("Không thể lấy thông tin người dùng:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <StyleSideBarRight>
      <div className="user_profile">
        <Avatar
          size="large"
          src={currentUser?.avatar}
          icon={!currentUser?.avatar && <UserOutlined />}
        />
        <div className="user_info">
          <span className="user_name" onClick={() => navigate("/profile")}>
            {currentUser?.nameDisplay || currentUser?.userName || 'Người dùng'}
          </span>
          <span className="user_location">
            {currentUser?.createdAt
              ? `Member from ${moment(currentUser.createdAt).format('MMMM YYYY')}`
              : 'Đang tải thông tin...'}
          </span>
        </div>
      </div>

      <div className="suggest_list">
        <div className="suggest_header">
          <span>Gợi ý cho bạn</span>
          <button onClick={() => navigate("/suggest-friend")}>Xem tất cả</button>
        </div>

        <div className="suggest_users">
          {loading ? (
            <Spin />
          ) : suggestedUsers.length > 0 ? (
            suggestedUsers.map((user) => (
              <CartUser dataItem={user} key={user._id} size="small" />
            ))
          ) : (
            <div className="no_suggestion">Không có gợi ý nào</div>
          )}
        </div>
      </div>

      <Footer />
    </StyleSideBarRight>
  );
}

const StyleSideBarRight = styled.div`
  margin-top: 36px;
  padding-left: 32px;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;

  .user_profile {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 16px;
  }

  .user_info {
    display: flex;
    flex-direction: column;
  }

  .user_name {
    font-weight: 600;
    font-size: 14px;
    color: #262626;
    cursor: pointer;
  }

  .user_name:hover {
    text-decoration: underline;
  }

  .user_location {
    font-size: 12px;
    color: #888;
  }

  .suggest_list {
    padding: 0 16px;
  }

  .suggest_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    span {
      font-size: 14px;
      color: #888;
      font-weight: 600;
    }

    button {
      font-size: 12px;
      color: #1890ff;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .suggest_users {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .no_suggestion {
    font-size: 13px;
    color: #999;
    text-align: center;
    padding: 12px 0;
  }

`;
