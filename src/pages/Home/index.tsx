import * as React from "react";
import authApi from "../../apis/api/authApi";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import FilterPost from "../../components/FilterPost/FilterPost";
import SideBarRight from "../../components/SideBarRight/SideBarRight";
import InfiniteScroll from "react-infinite-scroll-component";
import { List, Skeleton } from "antd";
import Footer from "../../components/Footer";
import Post from "../../components/Post";

export default function Home() {
  const [data, setData] = React.useState([
    {
      name: "1",
      img: ["d11", "d22", "d33"],
    },
    { name: "2", text: "text2" },
    // { name: "3", text: "text3", linkimg: imgtest },
    { name: "4", text: "text4" },
    { name: "5", text: "text5" },
    { name: "6", text: "text6" },
    { name: "1", text: "text1" },
    { name: "2", text: "text2" },
    { name: "3", text: "text3" },
    { name: "4", text: "text4" },
    { name: "5", text: "text5" },
    { name: "6", text: "text6" },
    { name: "1", text: "text1" },
    { name: "2", text: "text2" },
    { name: "3", text: "text3" },
    { name: "4", text: "text4" },
    { name: "5", text: "text5" },
    { name: "6", text: "text6" },
    { name: "1", text: "text1" },
    { name: "2", text: "text2" },
    { name: "3", text: "text3" },
    { name: "4", text: "text4" },
    { name: "5", text: "text5" },
    { name: "6", text: "text6" },
    { name: "1", text: "text1" },
    { name: "2", text: "text2" },
    { name: "3", text: "text3" },
    { name: "4", text: "text4" },
    { name: "5", text: "text5" },
    { name: "6", text: "text6" },
  ]);

  const loadMoreData = () => {
    const newItems = Array.from({ length: 15 }, (_, index) => ({
      name: `${data.length + index + 1}`,
      img: `img${data.length + index + 1}`,
    }));
    setData((prevData: any) => [...prevData, ...newItems]);
  };

  return (
    <StyleHome>
      <div className="home_content-container">
        <FilterPost />
        <div id="scrollableDiv" className="cartPost_main">
          <InfiniteScroll
            dataLength={data.length}
            next={loadMoreData}
            hasMore={data.length < 50}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            endMessage={<Footer />}
            scrollableTarget="scrollableDiv"
          >
            <List
              dataSource={data}
              renderItem={(item, idx) => <Post data={item} key={idx} />}
            />
          </InfiniteScroll>
        </div>
      </div>
      <SideBarRight />
    </StyleHome>
  );
}

const StyleHome = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;

  .home_content-container {
    max-width: 630px;
    width: 100%;
    height: 100vh;
  }

  .cartPost_main {
    /* height: 90%; */
    height: 90vh;
    overflow: auto;
    /* padding: 0px 16px; */
    max-width: 100%;
    /* width: min(470px, 100vw); */
    width: 470px;
    scrollbar-width: none;
    overflow-x: hidden;
    -ms-overflow-style: none;
  }

  .infinite-scroll-component {
    overflow-x: hidden !important;
  }

  .cartPost_main::-webkit-scrollbar {
    display: none;
  }

  .forrell {
    height: 10%;
  }

  .ant-list {
    overflow: hidden;
  }
`;
