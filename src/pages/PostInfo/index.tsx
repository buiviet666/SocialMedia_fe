import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Spin, Avatar, Input, Button } from "antd";
import {
  UserOutlined,
  HeartFilled,
  HeartOutlined,
  MessageOutlined,
  SendOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import moment from "moment";
import postApi from "../../apis/api/postApi";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";
import LikeListModal from "../../components/Post/LikeListModal";

const PostInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeUsers, setLikeUsers] = useState([]);
  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const currentUserId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const fetchPost = async () => {
    try {
      const res: any = await postApi.getPostById(id!);
      setPost(res.data);
      setLikesCount(res.data.likes?.length || 0);
      setIsLiked(res.data.likes?.includes(currentUserId));
    } catch (err) {
      setError("Không lấy được thông tin bài viết.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLikes = async () => {
    try {
      const res = await postApi.getPostLikes(post._id);
      setLikeUsers(res.data);
      setIsLikeModalOpen(true);
    } catch (err) {
      toast.error("Không thể tải danh sách lượt thích.");
    }
  };

  const toggleLike = async () => {
    try {
      const res: any = await postApi.toggleLike({ postId: post._id });
      if (res?.message === "Like") {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
      setLikesCount(res?.totalLikes || 0);
    } catch (err) {
      toast.error("Không thể thích/bỏ thích bài viết.");
    }
  };

  const onEmojiClick = (emojiObject: any) => {
    const { emoji } = emojiObject;
    const start = newComment.substring(0, cursorPosition || 0);
    const end = newComment.substring(cursorPosition || 0);
    const newValue = start + emoji + end;
    setNewComment(newValue);
    setCursorPosition((start + emoji).length);
    setShowEmojiPicker(false);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(newValue.length, newValue.length);
    }, 0);
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }
  if (error || !post) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error || "Bài viết không tồn tại."}
      </div>
    );
  }

  return (
    <Wrapper>
      <div className="flex flex-row">
        <div className="left">
          <img src={post.photoUrls[0]?.url} alt="Post" />
        </div>
        <div className="right">
          <div className="header">
            <Avatar src={post.userId.avatar} icon={<UserOutlined />} size={48} />
            <div className="user-info">
              <div className="username cursor-pointer" onClick={() => navigate(`/profile/${post.userId._id}`)}>{post.userId.username}</div>
              {post.location && <div className="location">{post.location}</div>}
            </div>
          </div>

          <div className="interactions">
            {isLiked ? (
              <HeartFilled style={{ fontSize: 26, color: "#ff4d4f" }} onClick={toggleLike} />
            ) : (
              <HeartOutlined style={{ fontSize: 26 }} onClick={toggleLike} />
            )}
            <MessageOutlined
              style={{ fontSize: 26, marginLeft: 12, cursor: "pointer" }}
              onClick={() => {
                inputRef.current?.focus();
                inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            />
            <SmileOutlined
              style={{ fontSize: 26, marginLeft: 12, cursor: "pointer" }}
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            />
          </div>

          <div
            className="likes cursor-pointer text-sm"
            onClick={fetchLikes}
          >
            {likesCount} lượt thích
          </div>

          <div className="caption">
            <span className="font-semibold mr-2">{post.userId.username}</span>
            {post.content}
          </div>

          <div className="text-xs text-gray-400 mt-1">
            {moment(post.createdAt).format("DD/MM/YYYY HH:mm")}
          </div>

          <div className="add-comment mt-4 flex items-center gap-2">
            <Input
              ref={inputRef}
              placeholder="Thêm bình luận..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onClick={() =>
                setCursorPosition(inputRef.current?.selectionStart || 0)
              }
            />
            <Button type="primary" disabled={!newComment.trim()}>
              Đăng
            </Button>
          </div>

          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute z-50 mt-2">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}

          <LikeListModal
            open={isLikeModalOpen}
            onClose={() => setIsLikeModalOpen(false)}
            users={likeUsers}
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default PostInfo;

const Wrapper = styled.div`
  background: #fff;
  max-height: 100vh;
  max-width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  place-self: anchor-center;
  padding-top: 50px;

  .left {
    flex: 1;
    background: #000;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    position: relative;
  }

  .header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eaeaea;
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;

    .user-info {
      margin-left: 0.75rem;

      .username {
        font-weight: 600;
      }
      .location {
        font-size: 0.875rem;
        color: #888;
      }
    }
  }

  .caption {
    padding: 0.5rem 0;
    border-bottom: 1px solid #eaeaea;
    font-size: 0.95rem;
    color: #333;
  }

  .interactions {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 0.5rem;
  }

  .add-comment {
    border-top: 1px solid #eaeaea;
    padding-top: 0.5rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    .left,
    .right {
      width: 100%;
    }
    .left {
      height: 300px;
    }
  }
`;
