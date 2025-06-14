/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Dropdown } from "antd";
import { EllipsisOutlined, HeartOutlined, HeartFilled, SendOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { formatTimeFromNow } from "../../../utils/functionCommon";
import postApi from "../../../apis/api/postApi";
import toast from "react-hot-toast";
import ReplyCommentItem from "../ReplyCommentItem";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ModalReport from "../../Modal/ModalReport";
import { FaCheck } from "react-icons/fa";
import { GrFormClose } from "react-icons/gr";

const reasonReport = [
  "Offensive or abusive language",
  "Spam or irrelevant content",
  "Harassment or bullying",
  "Other"
]

interface Props {
  comment?: any;
  currentUserId?: any;
  dataPost?: any;
  getDataListCmt: () => Promise<void>;
}

const CommentItem = ({ comment, currentUserId, dataPost, getDataListCmt }: Props) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [dataListCommenReply, setDataListCommenReply] = useState<any[]>([]);
  const [showReply, setShowReply] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isLikedCmt, setIsLikedCmt] = useState<boolean>(false);
  const [likesCmtCount, setLikesCmtCount] = useState<number>(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [countCmtReply, setCountCmtReply] = useState<number>(comment?.totalReplies)
  const isOwnComment = currentUserId === comment?.userId?._id;
  const navigate = useNavigate();

  useEffect(() => {
    if (comment?.likes) {
      setIsLikedCmt(comment.likes.includes(currentUserId));
      setLikesCmtCount(comment.likes.length);
    }
  }, [comment?.likes, currentUserId]);

  const getListReplyComment = async () => {
    try {
      const res: any = await postApi.getRepliesByCommentId(comment._id);
      if (res?.statusCode === 200) {
        setDataListCommenReply(res?.data);
        setCountCmtReply(res?.data.length);
        toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Operation failed!");
    }
  }

  const handleReplyCmt = async (parentId: string, content: string) => {
    try {
      const params = {
        postId: dataPost._id,
        content: content,
        parentCommentId: parentId
      }
      const res: any = await postApi.createComment(params);
      if (res?.statusCode === 201) {
        toast.success(res?.message);
        getListReplyComment();
      }
    } catch (error) {
      toast.error("Operation failed!");
      console.log(error);
    }
  };

  const handleUpdateCmt = async () => {
    try {
      const res: any = await postApi.updateComment(comment._id, { content: editContent });
      if (res?.statusCode === 200) {
        toast.success(res?.message);
        comment.content = editContent;
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Error updating comment!");
      console.log(error);
    }
  }

  const onToggleLikeCmt = async (commentId: string) => {
    try {
      const res: any = await postApi.toggleLikeComment(commentId);

      if (res?.statusCode === 200) {
        const updatedComment = res.data;

        setDataListCommenReply((prev) =>
          prev.map((item) => item._id === updatedComment._id ? updatedComment : item)
        );

        if (commentId === comment._id) {
          comment.likes = updatedComment.likes;
        }
      }
    } catch (error) {
      toast.error("Unable to perform action.");
      console.log(error);
    }
  };

  const handleDelete = async (data: any) => {
    try {
      const res: any = await postApi.deleteComment(data._id);
      if (res?.statusCode === 200) {
        toast.success(res?.message);
        getListReplyComment();
        getDataListCmt();
      }
    } catch (error) {
      toast.error("Unable to perform action.");
      console.log(error);
    }
  }

  const handleReportComment = async ({
    targetId,
    reason,
  }: {
    targetId: string;
    reason: string;
  }) => {
    if (!reason.trim()) {
      return toast.error("Please select a reason.");
    }

    try {
      const res: any = await postApi.reportComment(targetId, reason);
      toast.success(res?.message || "Report sent.");
      setIsReportModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Unable to send report.");
    }
  };

  const handleMenuClick = (key: string, data: any) => {
    if (key === "delete") handleDelete(data);
    else if (key === "report") setIsReportModalOpen(true);
    else if (key === "update") {
      setIsEditing(true);
      setEditContent(comment.content);
    }
  };

  const handleShowReplyCmt = () => {
    if (dataListCommenReply.length > 0) {
      setShowReply(prev => !prev);
    } else {
      getListReplyComment();
      setShowReply(true);
    }
  }

  const handleReplyRootCmt = (parentId: string, content: string) => {
    handleReplyCmt(parentId, content);
    getListReplyComment();
    setReplyContent("");
    setShowReplyInput(false);
  }

  const handleClickProfile = () => {
    if (currentUserId === comment?.userId?._id) {
      navigate(`/profile`)
    } else {
      navigate(`/profile/${comment?.userId?._id}`)
    }
  }

  return (
    <StyleCommentItem className="itemCustomcmt flex items-start gap-3 mb-4">
      <Avatar src={comment?.userId?.avatar} />
      <div className="flex-1">
        <div className="bg-gray-100 px-4 py-2 rounded-lg relative">
          <span className="font-semibold cursor-pointer" onClick={() => handleClickProfile()}>{comment?.userId?.nameDisplay || comment?.userId?.userName}</span>

          {!isEditing ? (
            <p className="text-sm">{comment?.content}</p>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="border px-3 py-1 rounded-md text-sm w-full"
              />
              <span
                className="text-green-600 cursor-pointer"
                onClick={() => handleUpdateCmt()}
              >
                <FaCheck />
              </span>
              <span
                className="text-gray-500 cursor-pointer"
                onClick={() => setIsEditing(false)}
              >
                <GrFormClose className="w-[24px] h-[24px]"/>
              </span>
            </div>
          )}

          <Dropdown 
            menu={{ items: isOwnComment
              ? [
                  { label: "Edit comment", key: "update" },
                  { label: "Delete comment", key: "delete" },
                ]
              : [{ label: "Report comment", key: "report" }], 
            onClick: ({key}) => handleMenuClick(key, comment) }} trigger={["click"]}>
            <EllipsisOutlined className="absolute top-2 right-2 cursor-pointer text-gray-500" />
          </Dropdown>
        </div>


        <div className="flex items-center text-xs text-gray-500 mt-1 gap-4 ml-2 whitespace-nowrap">
          <span
            className="cursor-pointer hover:underline flex items-center gap-1"
            onClick={() => onToggleLikeCmt(comment._id)}
          >
            {isLikedCmt ? (
              <HeartFilled className="colorLike" />
            ) : (
              <HeartOutlined />
            )}
            {likesCmtCount} {isLikedCmt ? "unLike" : "Like"}
          </span>
          <span
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="cursor-pointer hover:underline"
          >
            Reply
          </span>
          <span>{formatTimeFromNow(comment.createdAt)}</span>
        </div>

        {showReplyInput && (
          <div className="flex items-center mt-2 ml-2 gap-2">
            <input
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Enter feedback..."
              className="border px-3 py-1 rounded-md text-sm w-full"
            />
            <SendOutlined
              onClick={() => handleReplyRootCmt(comment._id, replyContent)}
              className="cursor-pointer text-blue-500"
            />
            <button onClick={() => setShowReplyInput(false)} className="cursor-pointer text-xs text-gray-500">Đóng</button>
          </div>
        )}

        {/* Nếu có replies */}
        {comment.totalReplies > 0 && (
          <div className="mt-2 ml-2 mb-2">
            <button
              onClick={() => handleShowReplyCmt()}
              className="text-blue-500 text-xs hover:underline"
            >
              {showReply ? (`Hide ${countCmtReply} responses`) 
              : 
              (`Show more ${countCmtReply} responses`)}
            </button>
          </div>
        )}

        {showReply && <div>
          {dataListCommenReply.map((item: any, idx: any) => (
            <ReplyCommentItem
              key={idx}
              data={item}
              currentUserId={currentUserId}
              onReply={handleReplyCmt}
              onDelete={handleDelete}
              onReport={handleReportComment}
              onToggleLike={onToggleLikeCmt}
              dataComment={comment}
            />
          ))}
        </div>}
      </div>
      <ModalReport
        open={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={({ targetId, reason }) =>
          handleReportComment({ targetId, reason })
        }
        targetId={comment._id}
        targetType="COMMENT"
        reportReasons={reasonReport}
        title="Report Comment"
      />
    </StyleCommentItem>
  );
};

export default CommentItem;

const StyleCommentItem = styled.div`
  &.itemCustomcmt:last-child {
    margin-bottom: 0 !important;
  }

  .colorLike {
    color: #ff4d4f !important;
  }
`