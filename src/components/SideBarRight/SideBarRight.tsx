import * as React from "react";
import styled from "styled-components";
import Footer from "../Footer";
import CartUser from "../CartUser";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

// export interface SideBarRightProps {}

export default function SideBarRight(props: SideBarRightProps) {
  const dataFake = [
    { name: "user1", img: "anh1", des: "des1" },
    { name: "user2", img: "anh2", des: "des2" },
    { name: "user3", img: "anh3", des: "des3" },
    { name: "user4", img: "anh4", des: "des4" },
    { name: "user5", img: "anh5", des: "des5" },
    { name: "user6", img: "anh6", des: "des6" },
  ];
  return (
    <StyleSideBarRight>
      <div className="SideBarRight_title">
        <div className="SideBarRight_title-content">
          <div className="SideBarRight_title-avantar">
            <Avatar size="large" icon={<UserOutlined />} />
          </div>
          <div className="SideBarRight_title-container">
            <div className="SideBarRight_title-info">name - time</div>
            <div className="SideBarRight_title-location">location</div>
          </div>
        </div>
        <div className="SideBarRight_title-iconmore"></div>
      </div>
      <div className="SideBarRight_title-list">
        <div className="SideBarRight_title-recommend">
          <span>Gợi ý cho bạn</span>
          <a href="#">Xem tất cả</a>
        </div>
        {dataFake.map((item, idx) => (
          <CartUser dataItem={item} key={idx} />
        ))}
      </div>
      <Footer />
    </StyleSideBarRight>
  );
}

const StyleSideBarRight = styled.div`
  padding-left: 64px;
  margin-top: 36px;
  width: 100%;
  max-width: 382px;
  display: flex;
  flex-direction: column;

  .SideBarRight_title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
  }

  .SideBarRight_title-content {
    display: flex;
    flex-direction: row;
  }

  .SideBarRight_title-list {
    margin: 24px 16px 16px;
    display: flex;
    flex-direction: column;
  }

  .SideBarRight_title-recommend {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .SideBarRight_title-avantar {
    margin-right: 12px;
  }

  .SideBarRight_title-info {
    font-weight: bold;
    text-overflow: ellipsis;
    font-size: 14px;
  }

  .SideBarRight_title-location {
    color: #737373;
    font-size: 14px;
  }

  .SideBarRight_title-recommend span {
    color: #737373;
    font-size: 14px;
    font-weight: 600;
    line-height: 18px;
  }

  .SideBarRight_title-recommend a {
    color: #000000;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
  }
`;
