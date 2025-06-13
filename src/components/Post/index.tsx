/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EmojiPicker from "emoji-picker-react";
import { Avatar, Dropdown, MenuProps } from "antd";
import {
  CloseOutlined,
  CommentOutlined,
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
import EditPostModal from "./EditPostModal";
import { formatTimeFromNow } from "../../utils/functionCommon";
import toast from "react-hot-toast";
import userApi from "../../apis/api/userApi";
import { FaRegBookmark } from "react-icons/fa";
import { RiShareForward2Fill } from "react-icons/ri";
import ModalReport from "../Modal/ModalReport";
import ModalDelete from "../Modal/ModalDelete";

const reasonReport = [
  "Inappropriate content",
  "Spam or misleading",
  "Hate speech",
  "Nudity or sexual content",
  "Other"
]

interface Props {
  data?: any;
  infoUser?: any;
  refreshPosts?: () => void;
}

const Post = ({ data, infoUser, refreshPosts}: Props) => {
  const [valueInput, setValueInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const currentUserId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(data?.likes?.length || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [animateLike, setAnimateLike] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);
  const [likeUsers, setLikeUsers] = useState([]);
  const [listComment, setListComment] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState<boolean>(infoUser.following.includes(data.userId._id) || false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const isOwnPost = currentUserId === data?.userId?._id;

  useEffect(() => {
    if (data?.likes && currentUserId) {
      setIsLiked(data.likes.includes(currentUserId));
    }

    if (infoUser?.savedPosts) {
      setIsSaved(infoUser?.savedPosts.includes(data._id));
    }
  }, [data?.likes, currentUserId, infoUser?.savedPosts, data._id]);

  useEffect(() => {
    setIsFollowing(infoUser.following.includes(data.userId._id) || false);
  }, [infoUser.following, data.userId]);

  const items: MenuProps["items"] = isOwnPost 
  ? [
    { label: "View details", key: "view" },
    { type: "divider" },
    { label: "Edit post", key: "edit" },
    { type: "divider" },
    { label: "Delete post", key: "delete" },
    { type: "divider" },
    { label: "Cancel", key: "cancel" },
  ]
  : [
    { label: "Report", key: "report" },
    { type: "divider" },
    { label: isFollowing ? "unFollow" : "follow", key: "follow" },
    { type: "divider" },
    { label: isSaved ? "unSave Post" : "Save post", key: "save" },
    { type: "divider" },
    { label: "View full post", key: "view" },
    { type: "divider" },
    { label: "Cancel", key: "cancel" },
  ];

  const handleClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "report":
        setIsReportOpen(true);
        break;
      case "follow":
        followUser();
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

  const followUser = async () => {
    try {
      let newFollowingStatus = !isFollowing;
      if (isFollowing) {
        await userApi.unfollowUser(data.userId._id);
        toast.success("Unfollowed success!");
        newFollowingStatus = false;
      } else {
        await userApi.followUser(data.userId._id);
        toast.success('Followed');
        newFollowingStatus = true;
      }
      setIsFollowing(newFollowingStatus);
    } catch (error: any) {
      toast.error(error.message || 'Operation failed!');
    }
  }

  const handleSubmitComment = async () => {
    try {
      const params = {
        postId: data._id,
        content: valueInput
      }
      const res: any = await postApi.createComment(params);
      if (res?.statusCode === 201) {
        toast.success(res?.message);
        setIsModalOpen(true);
        setValueInput("");
        getDataListCmt();
      }
    } catch (error: any) {
      toast.error(error.message || 'Operation failed!');
    }
  }

  const handleSeeMoreCmt = () => {
    getDataListCmt();
    setIsModalOpen(true);
  }

  const getDataListCmt = async () => {
    try {
      const res: any = await postApi.getCommentsByPost(data._id);
      if (res?.statusCode === 200) {
        setListComment(res?.data);
      }
    } catch (error) {
      toast.error("Operation failed!");
      console.log(error);
    }
  }

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
      toast.error("Unable to like/unlike.");
      console.log(err);
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
        toast.success("Article saved.");
      } else if (res?.message === "unSave") {
        setIsSaved(false);
        toast.success("Post unsaved.");
      }
    } catch (err) {
      toast.error("Unable to save post.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSharePost = async (message: string) => {
    try {
      await postApi.sharePost({ postId: data._id, message });
      toast.success("Shared article successfully!");
    } catch (err) {
      toast.error("Cannot share post.");
      console.log(err);
    } finally {
      setIsShareOpen(false);
    }
  };

  const handleUpdatePost = async (values: any) => {
    try {
      await postApi.updatePost(data._id, values);
      toast.success("Article updated.");
      refreshPosts?.();
    } catch (error) {
      toast.error("Update failed.");
      console.error(error);
    }
  };

  const handleReportPost = async ({
    targetId,
    reason,
  }: {
    targetId: string;
    reason: string;
  }) => {
    try {
      await postApi.reportPost({
        postId: targetId,
        reason,
      });
      toast.success("Report sent.");
    } catch (err) {
      toast.error("Unable to send report.");
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

  const fetchLikes = async () => {
    try {
      const res = await postApi.getPostLikes(data._id);
      setLikeUsers(res.data);
    } catch (err) {
      console.log('Error fetching likes:', err);
    }
  };

  const handleOpenLikeModal = () => {
    fetchLikes();
    setIsLikeModalOpen(true);
  };

  const handleClickName = (id: any) => {
    if (currentUserId === id?.userId?._id) {
      navigate("/profile");
    } else {
      navigate(`/profile/${id?.userId?._id}`);
    }
  }

  const handleDeletePost = async () => {
    try {
      setLoadingDelete(true);
      await postApi.deletePost(data._id);
      toast.success("Post deleted successfully.");
      setIsDeleteConfirmOpen(false);
      refreshPosts?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post.");
    } finally {
      setLoadingDelete(false);
    }
  };

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
            <div className="cartpost_title-info" onClick={() => handleClickName(data)}>
              {data?.userId?.userName && data?.userId?.nameDisplay} 
              <span> • {formatTimeFromNow(data?.createdAt)}</span>
            </div>
            <div className="cartpost_title-location">
              {data?.location || ""}
            </div>
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
                onClick={() => handleSeeMoreCmt()}
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
            <CommentOutlined
              style={{ fontSize: "26px", padding: "7px", cursor: "pointer" }}
              onClick={() => {
                inputRef.current?.focus();
                inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            />
            <span style={{ fontSize: "26px", padding: "7px", cursor: "pointer" }} onClick={() => setIsShareOpen(true)}>
              <RiShareForward2Fill />
            </span>
          </div>
          <div className="cartpost_title-save">
            <FaRegBookmark
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
          onClick={handleOpenLikeModal}
          style={{ cursor: "pointer" }}
        >
          {likesCount} like
        </div>


        {data?.content && (
          <div className="cartpost_title-description">
            <span className="font-semibold">{data?.userId?.username}</span> {data.content}
          </div>
        )}

        <div 
          className="cartpost_title-moreComment cursor-pointer" 
          onClick={() => handleSeeMoreCmt()}>
          See info post
        </div>

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
              <span className="post_commend" onClick={handleSubmitComment}>
                <SendOutlined />
              </span>
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
        commentData={listComment}
        infoUser={infoUser}
        getDataListCmt={getDataListCmt}
      />

      <SharePost
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onSubmit={handleSharePost}
      />

      <LikeListModal
        open={isLikeModalOpen}
        onClose={() => setIsLikeModalOpen(false)}
        users={likeUsers}
        infoUser={infoUser}
      />

      <ModalReport
        open={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmit={({ targetId, reason }) =>
          handleReportPost({ targetId, reason })
        }
        targetId={data._id}
        targetType="POST"
        reportReasons={reasonReport}
        title="Report Post"
      />

      <ModalDelete
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeletePost}
        loading={loadingDelete}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
      />

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
    cursor: pointer;
  }

  .cartpost_title-info span {
    color: #737373;
    font-weight: 400;
  }

  .cartpost_title-save svg {
    width: 40px;
    height: 40px;
  }

  .cartpost_title-iconClick {
    display: flex;
    flex-direction: row;
  }
`
