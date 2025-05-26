import styled from "styled-components";
import FilterPost from "../../components/FilterPost/FilterPost";
import SideBarRight from "../../components/SideBarRight/SideBarRight";
import InfiniteScroll from "react-infinite-scroll-component";
import { List, Skeleton } from "antd";
import Footer from "../../components/Footer";
import Post from "../../components/Post";
import { useDraggable } from "react-use-draggable-scroll";
import { useRef, useState } from "react";

export default function Home() {
  const cartPostRef = useRef<HTMLDivElement>(null!);
  const { events } = useDraggable(cartPostRef);
  const [data, setData] = useState([
  {
    id: "p1",
    name: "Jack Nguyen",
    avatar: "https://i.pravatar.cc/150?img=11",
    location: "Đà Lạt, Việt Nam",
    likes: 152,
    caption: "Sáng sớm đón nắng ở Đồi chè Cầu Đất 🍃",
    img: [
      "https://picsum.photos/id/1015/600/400",
      "https://picsum.photos/id/1016/600/400",
    ],
  },
  {
    id: "p2",
    name: "Linh Chi",
    avatar: "https://i.pravatar.cc/150?img=32",
    location: "Sa Pa, Lào Cai",
    likes: 300,
    caption: "Săn mây thành công rồi mọi người ơi ☁️",
    img: [
      "https://picsum.photos/id/1025/600/400",
      "https://picsum.photos/id/1026/600/400",
    ],
  },
  {
    id: "p3",
    name: "Minh Tuấn",
    avatar: "https://i.pravatar.cc/150?img=18",
    location: "Hội An, Quảng Nam",
    likes: 478,
    caption: "Chút cổ kính giữa lòng phố Hội ✨",
    img: [
      "https://picsum.photos/id/1033/600/400",
      "https://picsum.photos/id/1034/600/400",
    ],
  },
  {
    id: "p4",
    name: "Yến Nhi",
    avatar: "https://i.pravatar.cc/150?img=22",
    location: "Biển Mỹ Khê, Đà Nẵng",
    likes: 210,
    caption: "Tắm nắng, uống nước dừa và chill ☀️🥥",
    img: [
      "https://picsum.photos/id/1041/600/400",
      "https://picsum.photos/id/1042/600/400",
    ],
  },
  {
    id: "p5",
    name: "Hoàng Long",
    avatar: "https://i.pravatar.cc/150?img=45",
    location: "Thác Bản Giốc, Cao Bằng",
    likes: 125,
    caption: "Thiên nhiên hùng vĩ quá đỗi 💦",
    img: [
      "https://picsum.photos/id/1050/600/400",
      "https://picsum.photos/id/1052/600/400",
    ],
  },
  {
    id: "p6",
    name: "Trà My",
    avatar: "https://i.pravatar.cc/150?img=39",
    location: "Ninh Bình",
    likes: 382,
    caption: "Thuyền trôi giữa núi non xanh ngắt 🛶",
    img: [
      "https://picsum.photos/id/1065/600/400",
      "https://picsum.photos/id/1066/600/400",
    ],
  },
  {
    id: "p7",
    name: "Ngọc Hân",
    avatar: "https://i.pravatar.cc/150?img=52",
    location: "Hà Nội",
    likes: 89,
    caption: "Cà phê trứng sáng chủ nhật ☕️",
    img: [
      "https://picsum.photos/id/1070/600/400",
    ],
  },
  {
    id: "p8",
    name: "Khánh Duy",
    avatar: "https://i.pravatar.cc/150?img=57",
    location: "Cần Thơ",
    likes: 147,
    caption: "Chợ nổi rộn ràng, tấp nập 🌊",
    img: [
      "https://picsum.photos/id/1081/600/400",
      "https://picsum.photos/id/1082/600/400",
    ],
  },
  {
    id: "p9",
    name: "Bảo Anh",
    avatar: "https://i.pravatar.cc/150?img=28",
    location: "Thủ Đức, Sài Gòn",
    likes: 234,
    caption: "Chiều chill rooftop cùng bạn bè 🌇",
    img: [
      "https://picsum.photos/id/1091/600/400",
      "https://picsum.photos/id/1092/600/400",
    ],
  },
  {
    id: "p10",
    name: "Phúc Hưng",
    avatar: "https://i.pravatar.cc/150?img=16",
    location: "Phú Quốc",
    likes: 512,
    caption: "Hoàng hôn đẹp nhất là khi có em bên cạnh 🧡",
    img: [
      "https://picsum.photos/id/1100/600/400",
      "https://picsum.photos/id/1101/600/400",
      "https://picsum.photos/id/1102/600/400",
    ],
  },
]);

  const loadMoreData = () => {
    const newItems = Array.from({ length: 5 }, (_, index) => {
    const baseId = data.length + index + 100;
    return {
      id: `new-${baseId}`,
      name: `User ${baseId}`,
      avatar: `https://i.pravatar.cc/150?img=${(baseId % 70) + 1}`,
      location: `Địa điểm ${baseId}`,
      likes: Math.floor(Math.random() * 500),
      caption: `Caption ngẫu nhiên cho bài viết ${baseId}`,
      img: [
        `https://picsum.photos/id/${baseId}/600/400`,
        `https://picsum.photos/id/${baseId + 1}/600/400`,
      ],
    };
  });

    setData((prevData) => [...prevData, ...newItems]);
  };

  return (
    <StyleHome>
      <div className="home_content-container">
        <FilterPost />
        <div
          id="scrollableDiv"
          className="cartPost_main"
          ref={cartPostRef}
          {...events}
        >
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
              renderItem={(item) => <Post data={item} key={item.id} />}
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
    height: calc(100vh - 64px);
    overflow: auto;
    padding: 0 16px;
    width: 470px;
    scrollbar-width: none;
    overflow-x: hidden;
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
