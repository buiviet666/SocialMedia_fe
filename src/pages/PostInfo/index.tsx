/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, Input, Button, Spin, InputRef, Divider } from "antd";
import { HeartOutlined, HeartFilled, MessageOutlined, SendOutlined, SmileOutlined, UserOutlined, CloseOutlined } from "@ant-design/icons";
import EmojiPicker from "emoji-picker-react";
import Slider from "react-slick";
import moment from "moment";
import postApi from "../../apis/api/postApi";
import LikeListModal from "../../components/Post/LikeListModal";
import toast from "react-hot-toast";
import { settingsDetailPost } from "../../constants/sliderSetting";
import styled from "styled-components";
import userApi from "../../apis/api/userApi";
import { FaRegBookmark } from "react-icons/fa";
import CommentItem from "../../components/Post/CommentItem";
import { RiShareForward2Fill } from "react-icons/ri";
import SharePost from "../../components/Post/SharePost";

const PostInfo = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);
  const [likeUsers, setLikeUsers] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [listComment, setListComment] = useState<any[]>([]);
  const [infoUser, setInfoUser] = useState<any>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (post?.likes) {
      setIsLiked(post.likes.includes(infoUser?._id));
      setLikesCount(post.likes.length);
    }

    if (infoUser?.savedPosts) {
      setIsSaved(infoUser?.savedPosts.includes(post?._id));
    }
  }, [post?.likes, infoUser, infoUser?.savedPosts, infoUser?.savedPosts, post?._id]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res: any = await postApi.getPostById(id!);
        setPost(res.data);
        setLikesCount(res.data.likes?.length || 0);
        setIsLiked(res.data.likes?.includes(id));
      } catch (error) {
        toast.error("Failed to fetch post");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const getDataListCmt = async () => {
    try {
      const res: any = await postApi.getCommentsByPost(id!);
      if (res?.statusCode === 200) {
        setListComment(res?.data);
      }
    } catch (error) {
      toast.error("Operation failed!");
      console.log(error);
    }
  }

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

  useEffect(() => {
    fetchCurrentUser();
    getDataListCmt();
  }, []);

  const toggleLike = async () => {
    try {
      const res: any = await postApi.toggleLike({ postId: post._id });
      if (res.message === "Like") setIsLiked(true);
      else setIsLiked(false);
      setLikesCount(res.totalLikes || 0);
    } catch {
      console.error("Failed to like post");
    }
  };

  const fetchLikes = async () => {
    try {
      const res = await postApi.getPostLikes(post._id);
      setLikeUsers(res.data);
      setIsLikeModalOpen(true);
    } catch {
      console.error("Failed to fetch likes");
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

  const deleteInput = () => {
    setNewComment("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleClickProfile = () => {
    if (id === infoUser?._id) {
      navigate(`/profile`)
    } else {
      navigate(`/profile/${infoUser?._id}`)
    }
  }

  const handleSharePost = async (message: string) => {
    try {
      const params = {
        postId: post._id,
        message
      }
      await postApi.sharePost(params);
      toast.success("Shared article successfully!");
    } catch (err) {
      toast.error("Cannot share post.");
      console.log(err);
    } finally {
      setIsShareOpen(false);
    }
  };

  const toggleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const res: any = await postApi.toggleSave({ postId: post._id });
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

  const handleSubmitCmt = async () => {
    try {
      const params = {
        postId: post._id,
        content: newComment
      }
      const res: any = await postApi.createComment(params);
      if (res?.statusCode === 201) {
        toast.success(res?.message);
        setNewComment("");
        await getDataListCmt();
      }
    } catch (error) {
      toast.error("Operation failed!");
      console.log(error);
    }
  }

  if (loading) {
    return <div className="h-screen flex items-center justify-center"><Spin size="large" /></div>;
  }

  if (!post) {
    return <div className="h-screen flex items-center justify-center text-red-500">Bài viết không tồn tại.</div>;
  }

  return (
    <PostInfoStyle className="flex justify-center pt-28">
      <div className="bg-white shadow-lg rounded-lg flex w-[80%] max-h-[90vh] overflow-hidden border border-gray-300 rounded-md p-3">
        <div className="flex-1 bg-white w-[50%]">
          <Slider {...settingsDetailPost}>
            {post?.photoUrls?.map((item: any, idx: any) => (
              <img
                key={idx} 
                src={item?.url} 
                alt="post" 
                className="w-full h-full object-cover" />
            ))}
          </Slider>
        </div>

        <div className="flex-1 flex flex-col pl-3 relative overflow-y-auto">
          <div className="flex items-center gap-4 pb-2 mb-2">
            <Avatar src={post.userId.avatar} icon={<UserOutlined />} size={"large"}/>
            <div>
              <div className="font-semibold cursor-pointer" onClick={() => handleClickProfile}>
                {post.userId.nameDisplay || post.userId.userName}
              </div>
              {post.location && <div className="text-xs text-gray-500">{post.location}</div>}
            </div>
          </div>
          <Divider />


          <div className="caption">
            {listComment.map((comment: any) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  currentUserId={infoUser?._id}
                  dataPost={post}
                  getDataListCmt={getDataListCmt}
                />
              ))}
          </div>

          <Divider />
          <div className="pt-3">
            <div className="flex justify-between" onClick={toggleLike}>
              <div className="flex items-center gap-4 mb-2 cursor-pointer iconContainerInteract">
                {isLiked ? (
                    <HeartFilled className="colorLike" />
                  ) : (
                    <HeartOutlined />
                  )}
                <MessageOutlined className="text-xl cursor-pointer" onClick={() => inputRef.current?.focus()} />
                <span 
                  className='cursor-pointer' 
                  onClick={() => setIsShareOpen(true)}>
                  <RiShareForward2Fill />
                </span>
              </div>
              <div className="cartpost_title-save cursor-pointer">
                <FaRegBookmark 
                  onClick={toggleSave}
                  style={{
                    color: isSaved ? "#fadb14" : undefined,
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-3">
              <div className="text-base font-semibold text-gray-900 leading-snug">
                {post?.title}
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">
                {post?.content}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {moment(post?.createdAt).format('DD/MM/YYYY HH:mm')}
              </div>
            </div>
            <div className="likes cursor-pointer" onClick={fetchLikes}>
              {likesCount || 0} like
            </div>
            <div className="mt-auto pt-3 ">
              <div className="cartpost_title-comment flex flex-row">
                <Input
                  ref={inputRef}
                  className="customInputContent flex-1 border-none outline-none placeholder:text-gray-400 placeholder:text-sm pr-20"
                  placeholder="Add comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onClick={() =>
                    setCursorPosition(inputRef.current?.input?.selectionStart || 0)
                  }
                />
                <div className="actionInput">
                  {newComment && (
                    <>
                      <CloseOutlined className="text-gray-400 cursor-pointer hover:text-red-500 iconDeleteInput" onClick={deleteInput} />
                      <SendOutlined onClick={handleSubmitCmt}/>
                    </>
                  )}
                  <SmileOutlined style={{ cursor: "pointer" }} onClick={() => setShowEmojiPicker((prev) => !prev)}/>
                </div>
              </div>
              {showEmojiPicker && (
                <div ref={emojiPickerRef} className="absolute bottom-14 right-4 z-50">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
          </div> 

          <LikeListModal
            open={isLikeModalOpen}
            onClose={() => setIsLikeModalOpen(false)}
            users={likeUsers}
          />
        </div>
      </div>
      <SharePost
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onSubmit={handleSharePost}
      />
    </PostInfoStyle>
  );
};

export default PostInfo;

const PostInfoStyle = styled.div`
  .slick-track {
    display: flex;
  }

  .slick-slide {
    align-self: center;
  }

  .colorLike {
    color: #ff4d4f !important;
  }

  .caption {
    max-height: 340px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    .username {
      font-weight: bold;
      margin-right: 6px;
    }
  }

  .caption::-webkit-scrollbar {
    display: none;
  }

  .ant-divider {
    margin: 0;
    margin-bottom: 12px;
  }

  .iconContainerInteract span svg {
    width: 24px;
    height: 24px;
  }

  .cartpost_title-save svg {
    width: 24px;
    height: 24px;
  }

  .likes {
    font-weight: 500;
    display: inline-block;
  }

  .cartpost_title-comment {
    position: relative;
  }

  .actionInput {
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: row;
    align-self: center;
    padding: 0 10px;
    gap: 6px;
  }

  .customInputContent {
    padding-right: 80px;
  }
`