import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EmojiPicker from "emoji-picker-react";
import { Avatar, Dropdown, MenuProps, message } from "antd";
import {
  CloseOutlined,
  CommentOutlined,
  CrownOutlined,
  EllipsisOutlined,
  HeartFilled,
  HeartOutlined,
  SendOutlined,
  SmileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { settingsCart } from "../../constants/sliderSetting";
import { useNavigate } from "react-router-dom";
import InfoPostPopup from "./InfoPostPopup";
import postApi from "../../apis/api/postApi";
import SharePost from "./SharePost";
import LikeListModal from "./LikeListModal";
import ReportPostModal from "./ReportPostModal";
import { Modal } from "antd";
import EditPostModal from "./EditPostModal";

interface Props {
  data?: any;
}

const Post = ({ data }: Props) => {
  const [valueInput, setValueInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const currentUserId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(data?.likes?.length || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [animateLike, setAnimateLike] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);



  const isOwnPost = currentUserId === data?.userId?._id;

  const mockLikedUsers = [
    { username: "an.nguyen", avatar: "https://i.pravatar.cc/150?img=1" },
    { username: "bao.tran", avatar: "https://i.pravatar.cc/150?img=2" },
    { username: "linh.le", avatar: "https://i.pravatar.cc/150?img=3" },
  ];


  useEffect(() => {
    if (data?.likes && currentUserId) {
      setIsLiked(data.likes.includes(currentUserId));
    }
  }, [data?.likes, currentUserId]);

  useEffect(() => {
    if (data?.saves && currentUserId) {
      setIsSaved(data.saves.includes(currentUserId));
    }
  }, [data?.saves, currentUserId]);


  const items: MenuProps["items"] = isOwnPost
  ? [
    { label: "Xem chi tiết", key: "view" },
    { type: "divider" },
    { label: "Sửa bài viết", key: "edit" },
    { type: "divider" },
    { label: "Xóa bài viết", key: "delete" },
    { type: "divider" },
    { label: "Hủy", key: "cancel" },
  ]
: [
    { label: "Báo cáo", key: "report" },
    { type: "divider" },
    { label: "Bỏ theo dõi", key: "unfollow" },
    { type: "divider" },
    { label: "Lưu bài viết", key: "save" },
    { type: "divider" },
    { label: "Xem toàn bộ bài viết", key: "view" },
    { type: "divider" },
    { label: "Hủy", key: "cancel" },
  ];

  const handleClick: MenuProps["onClick"] = ({ key }) => {
    console.log("Click menu item:", key);

    switch (key) {
      case "report":
        setIsReportOpen(true);
        break;
      case "unfollow":
        console.log("Bỏ theo dõi");
        break;
      case "save":
        toggleSave();
        break;
      case "view":
        navigate(`/post/${data?._id}`);
        break;
      case "edit":
        setIsEditOpen(true);
        break;
      case "delete":
        setIsDeleteConfirmOpen(true);
        break;
      case "cancel":
      default:
        break;
    }
  };

  const onEmojiClick = (emojiObject: any) => {
    const { emoji } = emojiObject;
    const start = valueInput.substring(0, cursorPosition || 0);
    const end = valueInput.substring(cursorPosition || 0);
    const newValue = start + emoji + end;
    setValueInput(newValue);
    setCursorPosition((start + emoji).length);
    setShowEmojiPicker(false);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(newValue.length, newValue.length);
    }, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueInput(e.target.value);
  };

  const deleteInput = () => {
    setValueInput("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const toggleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res: any = await postApi.toggleLike({ postId: data._id });

      if (res?.message === "Like") {
        setIsLiked(true);
        setAnimateLike(true);
      } else if (res?.message === "unLike") {
        setIsLiked(false);
      }

      setLikesCount(res?.totalLikes || 0);
    } catch (err) {
      message.error("Không thể thực hiện thích/bỏ thích.");
      console.log("err", err);
    } finally {
      setIsLiking(false);
    }
  };

  const toggleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const res: any = await postApi.toggleSave({ postId: data._id });

      if (res?.message === "Save") {
        setIsSaved(true);
        message.success("Đã lưu bài viết.");
      } else if (res?.message === "unSave") {
        setIsSaved(false);
        message.info("Đã bỏ lưu bài viết.");
      }
    } catch (err) {
      message.error("Không thể lưu bài viết.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };


  const handleSharePost = async (message: string) => {
    try {
      await postApi.sharePost({ postId: data._id, message });
      message.success("Chia sẻ bài viết thành công!");
    } catch (err) {
      message.error("Không thể chia sẻ bài viết.");
      console.error(err);
    } finally {
      setIsShareOpen(false);
    }
  };

  const handleUpdatePost = async (values: any) => {
    try {
      await postApi.updatePost(data._id, values); // PUT API
      message.success("Đã cập nhật bài viết.");
      // Tùy chọn: cập nhật lại UI tại chỗ nếu cần
    } catch (error) {
      console.error(error);
      message.error("Cập nhật thất bại.");
    }
  };


  const handleReportPost = async (reason: string) => {
    try {
      await postApi.reportPost({
        postId: data.userId._id,
        reason,
      });
      message.success("Đã gửi báo cáo.");
    } catch (err) {
      message.error("Không thể gửi báo cáo.");
      console.error(err);
    } finally {
      setIsReportOpen(false);
    }
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <StyleCartPost>
      <div className="cartpost_title">
        <div className="cartpost_title-content">
          <div className="cartpost_title-avantar">
            <Avatar
              src={data?.userId?.avatar || undefined}
              icon={<UserOutlined />}
              alt={data?.userId?.username}
            />
          </div>
          <div className="cartpost_title-container">
            <div className="cartpost_title-info">
              {data?.userId?.username || "Ẩn danh"} <span>• 1 giờ trước</span>
            </div>
            <div className="cartpost_title-location">{data?.location || ""}</div>
          </div>
        </div>
        <div className="cartpost_title-iconmore">
          <Dropdown
            menu={{ items, onClick: handleClick }}
            trigger={["click"]}
            placement="bottomLeft"
          >
            <div className="navbar_setting">
              <EllipsisOutlined />
            </div>
          </Dropdown>
        </div>
      </div>

      <div className="cartpost_title-cartmain">
        <Slider {...settingsCart}>
          {Array.isArray(data?.photoUrls) &&
            data.photoUrls.map((imgObj: any, idx: number) => (
              <img
                key={idx}
                src={imgObj.url}
                alt={`img-${idx}`}
                onClick={() => setIsModalOpen(true)}
                className="w-full h-[400px] object-cover cursor-pointer"
              />
            ))}
        </Slider>
      </div>

      <div className="cartpost_title-contentMain">
        <div className="cartpost_title-contenticon">
          <div className="cartpost_title-iconClick">
            {isLiked && (
              <HeartFilled
                onClick={toggleLike}
                className={animateLike ? "like-animation" : ""}
                style={{ fontSize: "26px", padding: "7px", color: "#ff4d4f" }}
              />
            )}

            {!isLiked && (
              <HeartOutlined
                onClick={toggleLike}
                style={{ fontSize: "26px", padding: "7px" }}
              />
            )}
            <CommentOutlined style={{ fontSize: "26px", padding: "7px" }} />
            <SendOutlined style={{ fontSize: "26px", padding: "7px" }} onClick={() => setIsShareOpen(true)}/>
          </div>
          <div className="cartpost_title-save">
            <CrownOutlined
              onClick={toggleSave}
              style={{
                fontSize: "26px",
                padding: "7px",
                color: isSaved ? "#fadb14" : undefined,
                cursor: "pointer",
              }}
            />
          </div>
        </div>

        <div
          className="cartpost_title-likes"
          onClick={() => setIsLikeModalOpen(true)}
          style={{ cursor: "pointer" }}
        >
          {likesCount} lượt thích
        </div>


        {data?.content && (
          <div className="cartpost_title-description">
            <span className="font-semibold">{data?.userId?.username}</span> {data.content}
          </div>
        )}

        <div className="cartpost_title-moreComment">Xem thêm bình luận</div>

        <div className="cartpost_title-comment">
          <input
            ref={inputRef}
            className="cartpost_title-comment-input"
            placeholder="Thêm bình luận..."
            value={valueInput}
            onChange={handleInputChange}
            onClick={() =>
              setCursorPosition(inputRef.current?.selectionStart || 0)
            }
          />
          {valueInput && (
            <>
              <CloseOutlined className="deleteInput" onClick={deleteInput} />
              <span className="post_commend">Đăng</span>
            </>
          )}
          <div onClick={() => setShowEmojiPicker((prev) => !prev)}>
            <SmileOutlined style={{ cursor: "pointer" }} />
          </div>
        </div>
      </div>

      {showEmojiPicker && (
        <div className="pickEmoji_container" ref={emojiPickerRef}>
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}

      <InfoPostPopup
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={data}
      />

      <SharePost
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onSubmit={handleSharePost}
      />

      <LikeListModal
        open={isLikeModalOpen}
        onClose={() => setIsLikeModalOpen(false)}
        data={mockLikedUsers}
      />

      <ReportPostModal
        open={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmit={handleReportPost}
      />

      <Modal
        open={isDeleteConfirmOpen}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        footer={null}
        centered
      >
        <h3>Bạn có chắc chắn muốn xóa bài viết này?</h3>
        <p>Hành động này không thể hoàn tác.</p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: 24 }}>
          <button
            onClick={() => setIsDeleteConfirmOpen(false)}
            style={{
              padding: "8px 16px",
              border: "1px solid #ccc",
              borderRadius: 4,
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Hủy
          </button>

          <button
            onClick={async () => {
              try {
                await postApi.deletePost(data._id);
                message.success("Đã xóa bài viết.");
                setIsDeleteConfirmOpen(false);
                // Cập nhật UI: ví dụ gọi reload hoặc xóa khỏi danh sách
              } catch (err) {
                console.error(err);
                message.error("Không thể xóa bài viết.");
              }
            }}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ff4d4f",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Xóa
          </button>
        </div>
      </Modal>

      <EditPostModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        data={data}
        onSubmit={handleUpdatePost}
      />



    </StyleCartPost>
  );
};

export default Post;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
`;

const StyleCartPost = styled.div`
  border-bottom: 1px solid #dbdbdb;
  padding-bottom: 16px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;

  .like-animation {
    animation: ${pulse} 0.4s ease-in-out;
  }

  .cartpost_title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
  }

  .cartpost_title-content {
    display: flex;
    flex-direction: row;
  }

  .cartpost_title-container {
    display: flex;
    flex-direction: column;
  }

  .cartpost_title-contenticon {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 -7px;
  }

  .cartpost_title-comment {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .cartpost_title-avantar {
    margin-right: 12px;
    align-content: center;
  }

  .cartpost_title-cartmain .slick-dots {
    bottom: 21px;
  }

  .slick-dots li {
    margin: 0;
  }

  .cartpost_title-likes,
  .cartpost_title-description span {
    font-weight: 700;
  }

  .cartpost_title-moreComment {
    color: #737373;
    padding-bottom: 12px;
  }

  .cartpost_title-comment-input {
    width: 100%;
    border: unset;
    padding-right: 12px;
  }

  .cartpost_title-comment-input::placeholder {
    color: #737373;
    font-size: 14px;
    opacity: 0.8;
  }

  .pickEmoji_container {
    position: absolute;
    right: 0;
    bottom: 50px;
    z-index: 999;
  }

  .deleteInput {
    margin: 0 4px;
    cursor: pointer;
    transition: all 0.6s;
  }

  .deleteInput:hover {
    transform: rotate(180deg);
  }

  .deleteInput:hover svg {
    fill: #c62e2e;
  }

  .post_commend {
    margin-left: 4px;
    margin-right: 8px;
    font-weight: 700;
    color: #37afe1;
    cursor: pointer;
    opacity: 0.6;
    transition: all 0.6s;
  }

  .post_commend:hover {
    opacity: 1;
  }

  .dropdownPost .ant-dropdown-menu-title-content {
    justify-content: center;
  }

  .cartpost_title-iconmore,
  .cartpost_title-cartmain {
    cursor: pointer;
  }

  .cartpost_title-info {
    font-size: 14px;
    font-weight: 600;
    line-height: 18px;
    color: #000000;
  }

  .cartpost_title-info span {
    color: #737373;
    font-weight: 400;
  }
`
