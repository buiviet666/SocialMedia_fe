/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Avatar, Divider } from 'antd';
import { CloseOutlined, HeartFilled, HeartOutlined, MessageOutlined, SendOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import Slider from "react-slick";
import styled from 'styled-components';
import { settingsDetailPost } from '../../../constants/sliderSetting';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import moment from 'moment';
import postApi from '../../../apis/api/postApi';
import toast from 'react-hot-toast';
import SharePost from '../SharePost';
import LikeListModal from '../LikeListModal';
import CommentItem from '../CommentItem';
import { RiShareForward2Fill } from 'react-icons/ri';
import { FaRegBookmark } from 'react-icons/fa';

interface InfoPostPopupProps {
  open: boolean;
  onClose: () => void;
  data?: any;
  commentData?: any;
  infoUser?: any;
  getDataListCmt: () => Promise<void>;
}

const InfoPostPopup = ({ open, onClose, data, commentData, infoUser, getDataListCmt }: InfoPostPopupProps) => {
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [valueInput, setValueInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState(false);
  const [animateLike, setAnimateLike] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(data?.likes?.length || 0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);
  const [likeUsers, setLikeUsers] = useState([]);
  const currentUserId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
  const navigate = useNavigate();

  const handleClickProfile = () => {
    if (currentUserId === data?.user?._id) {
      navigate(`/profile`)
    } else {
      navigate(`/profile/${data?.user?._id}`)
    }
  }

  const handleSubmitCmt = async () => {
    try {
      const params = {
        postId: data._id,
        content: valueInput
      }
      const res: any = await postApi.createComment(params);
      if (res?.statusCode === 201) {
        toast.success(res?.message);
        setValueInput("");
        await getDataListCmt();
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
        toast.success("Đã lưu bài viết.");
      } else if (res?.message === "unSave") {
        setIsSaved(false);
        toast.success("Đã bỏ lưu bài viết.");
      }
    } catch (err) {
      toast.error("Không thể lưu bài viết.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSharePost = async (message: string) => {
    try {
      const params = {
        postId: data._id,
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

  const handleGetListLiked = () => {
    fetchLikesList();
    setIsLikeModalOpen(true)
  } 

  const fetchLikesList = async () => {
    try {
      const res = await postApi.getPostLikes(data._id);
      setLikeUsers(res.data);
    } catch (err) {
      console.error('Error fetching likes:', err);
      toast.error("Unable to load likes list.");
    }
  };

  useEffect(() => {
    if (data?.likes && currentUserId) {
      setIsLiked(data.likes.includes(currentUserId));
    }

    if (infoUser?.savedPosts) {
      setIsSaved(infoUser?.savedPosts.includes(data._id));
    }
  }, [data?.likes, currentUserId, infoUser?.savedPosts, data._id]);

  return (
    <StyledModal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className='modal-fullwidth'
    >
      <div className="modal-content">
        <div className="flex-7" style={{ maxWidth: 700}}>
          <Slider {...settingsDetailPost}>
            {data?.photoUrls?.map((item: any, idx: any) => (
                <div className='custom-slide-post'>
                  <img key={idx} src={item.url} alt={`modal-img-${idx}`} className="w-full" />
                </div>
            ))}
          </Slider>
        </div>

        <div className="flex flex-col flex-3 p-5 overflow-scroll overflow-x-hidden overflow-y-hidden h-full" style={{ maxWidth: 350}}>
          <div className="post-header">
            <Avatar size="large" icon={<UserOutlined />} src={data?.userId?.avatar || ''} />
            <div>
              <div className="username" onClick={() => handleClickProfile}>{data?.userId?.nameDisplay || data?.userId?.userName}</div>
              <div className="location">{data.location || ''}</div>
            </div>
          </div>
          <Divider />


          <div className="caption">
            {commentData.map((comment: any) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  currentUserId={currentUserId}
                  dataPost={data}
                  getDataListCmt={getDataListCmt}
                />
              ))}
          </div>

          <div className='mt-auto'>
            <Divider />
            <div className='cartpost_title-contenticon'>
              <div className="interactions">
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

                <MessageOutlined
                  style={{ fontSize: "26px", padding: "7px", cursor: "pointer" }}
                  onClick={() => {
                    inputRef.current?.focus();
                    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                />

                <span className='cursor-pointer' style={{ fontSize: "26px", padding: "7px" }} onClick={() => setIsShareOpen(true)}>
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

            <div className="flex flex-col gap-2 mb-3">
              <div className="text-base font-semibold text-gray-900 leading-snug">
                {data.title}
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">
                {data.content}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {moment(data.createdAt).format('DD/MM/YYYY HH:mm')}
              </div>
            </div>

            <div
              className="likes cursor-pointer"
              onClick={() => handleGetListLiked()}
            >
              {likesCount || 0} like
            </div>

            <div className="flex items-center mt-3 gap-2">
              <input
                ref={inputRef}
                className="flex-1 border-none outline-none pr-3 placeholder:text-gray-400 placeholder:text-sm"
                placeholder="More comment..."
                value={valueInput}
                onChange={handleInputChange}
                onClick={() =>
                  setCursorPosition(inputRef.current?.selectionStart || 0)
                }
              />
              {valueInput && (
                <>
                  <CloseOutlined className="text-gray-400 cursor-pointer hover:text-red-500" onClick={deleteInput} />
                  <span className="font-semibold hover:opacity-100 opacity-60 cursor-pointer" onClick={handleSubmitCmt}>
                    <SendOutlined />
                  </span>
                </>
              )}
              <div className="relative">
                <SmileOutlined
                  className="cursor-pointer text-lg text-gray-500 hover:text-gray-700"
                  onClick={() => setShowEmojiPicker(prev => !prev)}
                />
                {showEmojiPicker && (
                  <div
                    ref={emojiPickerRef}
                    className="absolute bottom-full mb-2 right-0 z-50"
                  >
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SharePost
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onSubmit={handleSharePost}
      />
      <LikeListModal
        open={isLikeModalOpen}
        onClose={() => setIsLikeModalOpen(false)}
        users={likeUsers}
      />
    </StyledModal>
  );
};

const StyledModal = styled(Modal)`
  min-width: 800px;
  max-width: 80%;

  &.modal-fullwidth {
    width: 55% !important;
  }

  .modal-content {
    display: flex;
    height: 700px;
  }

  .modal-left {
    flex: 1;
    display: flex;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      display: block;
    }
  }

  .post-header {
    display: flex;
    align-items: center;
    gap: 12px;

    .username {
      font-weight: bold;
      cursor: pointer;
    }

    .location {
      font-size: 12px;
      color: #888;
    }
  }

  .caption {
    max-height: 350px;
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

  .interactions {
    display: flex;
    font-size: 20px;
    margin: 12px 0;
  }

  .likes {
    font-weight: 500;
    margin-bottom: 12px;
  }

  .comment-box {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .custom-slide-post {
    width: 800px;
    height: 700px;
    max-width: 700px;
    overflow: hidden;
    position: relative;
    display: flex !important;
  }

  .custom-slide-post img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    display: block;
  }

  .slick-dots {
    bottom: 10px;
  }

  .ant-modal-content {
    padding: 0;
  }

  .cartpost_title-comment {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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

  .cartpost_title-contenticon {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 -7px;
  }

  .ant-divider {
    margin: 12px 0;
  }

  .cartpost_title-save svg {
    width: 40px;
    height: 40px;
  }
`;

export default InfoPostPopup;
