import styled from "styled-components";
import FilterPost from "../../components/FilterPost/FilterPost";
import SideBarRight from "../../components/SideBarRight/SideBarRight";
import InfiniteScroll from "react-infinite-scroll-component";
import { List, Skeleton } from "antd";
import Footer from "../../components/Footer";
import Post from "../../components/Post";
import { useDraggable } from "react-use-draggable-scroll";
import { useCallback, useEffect, useRef, useState } from "react";
import postApi from "../../apis/api/postApi";

export default function Home() {
  const cartPostRef = useRef<HTMLDivElement>(null!);
  const [loading, setLoading] = useState(false);
  const { events } = useDraggable(cartPostRef);
  const [data, setData] = useState<any[]>([]);
  
  
  // console.log("isLiked", isLiked);
  // console.log("animateLike", animateLike);
  // console.log("likesCount", likesCount);
  
  

  const loadDataByFilter = useCallback(async (key: string) => {
    setLoading(true);
    try {
      let res;
      switch (key) {
        case "1":
          res = await postApi.getPostsByPrivacy("PUBLIC");
          break;
        case "2":
          res = await postApi.getFriendPosts();
          break;
        case "3":
          res = await postApi.getLikedPosts();
          break;
        case "4":
          res = await postApi.getSavedPosts();
          break;
        default:
          res = { data: [] };
      }
      setData(res.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
    setLoading(false);
  }, []);

  const handleFilterChange = (key: string) => {
    loadDataByFilter(key);
  };

  // const toggleLike = async (idPost: string) => {
  //   if (isLiking) return;
  //   setIsLiking(true);
  //   try {
  //     const res: any = await postApi.toggleLike({ postId: idPost });
      
  //     if (res?.message === "Like") {
  //       setIsLiked(true);
  //       setAnimateLike(true);
  //     } else if (res?.message === "unLike") {
  //       setIsLiked(false);
  //     }
  //     setLikesCount(res?.totalLikes);
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setIsLiking(false);
  //   }
  // };

  useEffect(() => {
    loadDataByFilter("1");
  }, []);

  return (
    <StyleHome>
      <div className="home_content-container">
        <FilterPost onChangeFilter={handleFilterChange} />
        <div
          id="scrollableDiv"
          className="cartPost_main"
          ref={cartPostRef}
          {...events}
        >
          <InfiniteScroll
            dataLength={data.length}
            next={() => {}}
            hasMore={false}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            endMessage={<Footer />}
            scrollableTarget="scrollableDiv"
          >
            <List
              dataSource={data}
              renderItem={(item: any) => <Post data={item} key={item._id} 
              // callData={toggleLike} isLiked={isLiked} animateLike={animateLike} likesCount={likesCount}
              />}
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
