/* eslint-disable @typescript-eslint/no-explicit-any */
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
import toast from "react-hot-toast";
import userApi from "../../apis/api/userApi";

export default function Home() {
  const cartPostRef = useRef<HTMLDivElement>(null!);
  const { events } = useDraggable(cartPostRef);
  const [data, setData] = useState<any[]>([]);
  const [infoUser, setInfoUser] = useState<any>(null);
  const [keyFilter, setKeyFilter] = useState('1');
  const [nameFilter, setNameFilter] = useState('For You')
  
  const loadDataByFilter = useCallback(async (key: string) => {
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
      if (res.data) {
        setData(res.data);
      } else {
        toast.error("Error loading data");
      }
    } catch (error: any) {
      toast.error(error?.message || "Error loading data");
    }
  }, []);

  const handleFilterChange = (key: string, label: string) => {
    loadDataByFilter(key);
    setNameFilter(label);
    setKeyFilter(key);
  };

  const refreshPosts = async () => {
    await loadDataByFilter(keyFilter);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res: any = await userApi.getCurrentUser();
        if (res?.statusCode === 200) {
          setInfoUser(res?.data);
        } else {
          toast.error(res?.message || "Error");
        }
      } catch (error) {
        console.error("Không thể lấy thông tin người dùng:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    loadDataByFilter("1");
  }, [loadDataByFilter]);

  return (
    <StyleHome>
      <div className="home_content-container">
        <FilterPost 
          onChangeFilter={handleFilterChange} 
          nameFilter={nameFilter}/>
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
              renderItem={(item: any) => {
                const isHiddenByAdmin = item.status === "HIDDEN";
                const isMyHiddenPost = infoUser?.blockedUsers.includes(item.userId?._id);

                if (isHiddenByAdmin || isMyHiddenPost) {
                  return (
                    <div
                      key={item._id}
                      className="bg-gray-100 text-gray-500 italic text-center p-4 rounded-md mb-4"
                    >
                      This post has been hidden {isHiddenByAdmin && "By admin"} {isMyHiddenPost && "By block"}
                    </div>
                  );
                }
                return (
                  <Post
                    data={item}
                    key={item._id}
                    infoUser={infoUser}
                    refreshPosts={refreshPosts}
                  />
                );
              }}
            />
          </InfiniteScroll>
        </div>
      </div>
      <SideBarRight data={infoUser}/>
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
