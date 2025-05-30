import * as React from "react";
import styled from "styled-components";
import Footer from "../Footer";
import CartUser from "../CartUser";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { dataSuggested } from "../../utils/mockdata";

export default function SideBarRight() {
  const navigate = useNavigate();

  return (
    <StyleSideBarRight>
      <div className="user_profile">
        <Avatar size="large" icon={<UserOutlined />} />
        <div className="user_info">
          <span className="user_name">Buiviet</span>
          <span className="user_location">Thành viên từ 2024</span>
        </div>
      </div>

      <div className="suggest_list">
        <div className="suggest_header">
          <span>Gợi ý cho bạn</span>
          <button onClick={() => navigate("/suggest-friend")}>Xem tất cả</button>
        </div>

        <div className="suggest_users">
          {dataSuggested.map((item, idx) => (
            <CartUser dataItem={item} key={idx} isFollow size="small" />
          ))}
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
`;
