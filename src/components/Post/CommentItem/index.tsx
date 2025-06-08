import { Avatar, Dropdown, Input, MenuProps, Modal } from "antd";
import { EllipsisOutlined, HeartOutlined, HeartFilled, SendOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { formatTimeFromNow } from "../../../utils/functionCommon";
import postApi from "../../../apis/api/postApi";
import toast from "react-hot-toast";
import ReplyCommentItem from "../ReplyCommentItem";
import styled from "styled-components";

const CommentItem = ({ comment, currentUserId, onReply, onDelete, onReport }: any) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [dataListCommenReply, setDataListCommenReply] = useState<any[]>([]);
  const [showReply, setShowReply] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isLikedCmt, setIsLikedCmt] = useState<boolean>(false);
  const [likesCmtCount, setLikesCmtCount] = useState<number>(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    if (comment?.likes) {
      setIsLikedCmt(comment.likes.includes(currentUserId));
      setLikesCmtCount(comment.likes.length);
    }
  }, [comment?.likes, currentUserId]);


  const onToggleLikeCmt = async (commentId: string) => {
    try {
      const res: any = await postApi.toggleLikeComment(commentId);

      if (res?.message === "likedCmt") {
        setIsLikedCmt(true);
        setLikesCmtCount((prev) => prev + 1);
      } else if (res?.message === "unlikedCmt") {
        setIsLikedCmt(false);
        setLikesCmtCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      console.log(error);
      toast.error("Không thể thực hiện hành động.");
    }
  };

  const handleDelete = async (data: any) => {
    try {
      const res: any = await postApi.deleteComment(data._id);
      toast.success(res?.message);
    } catch (error) {
      console.log(error);
      toast.error("Không thể thực hiện hành động.");
    }
  }

  const handleConfirmReport = async () => {
    if (!reportReason.trim()) {
      return toast.error("Vui lòng nhập lý do.");
    }

    try {
      const res: any = await postApi.reportComment(comment._id, reportReason);
      toast.success(res?.message || "Đã báo cáo bình luận");
      setIsReportModalOpen(false);
      setReportReason("");
    } catch (error) {
      console.log(error);
      toast.error("Không thể gửi báo cáo.");
    }
  };



  
  const isOwnComment = currentUserId === comment?.userId?._id;

  const handleMenuClick = (key: string, data: any) => {
    if (key === "delete") handleDelete(data);
    else if (key === "report") setIsReportModalOpen(true);
    else if (key === "update") {
      setIsEditing(true);
      setEditContent(comment.content); // fill nội dung cũ
    }
  };

  const handleDeleteComment = (commentId: string) => {
    console.log("Delete", commentId);
  };
  const handleReportComment = (commentId: string) => {
    console.log("Report", commentId);
  };
  const handleToggleLike = (commentId: string) => {
    console.log("Toggle like", commentId);
  };

  const handleUpdateCmt = async () => {
    try {
      await postApi.updateComment(comment._id, { content: editContent });
      toast.success("Đã cập nhật bình luận!");
      comment.content = editContent; // cập nhật local
      setIsEditing(false);
    } catch (error) {
      toast.error("Lỗi khi cập nhật bình luận!");
    }
  }

  const handleShowReplyCmt = () => {
    if (dataListCommenReply.length > 0) {
      setShowReply(prev => !prev);
    } else {
      getListReplyComment();
      setShowReply(true);
    }
  }

  const getListReplyComment = async () => {
    try {
      const res = await postApi.getRepliesByCommentId(comment._id);
      setDataListCommenReply(res?.data);
      console.log(res);
      
    } catch (error) {
      console.log(error);
      toast.error("error");
    }
  }
  console.log("comment._id", comment._id);
  console.log("showReply", showReply);
  

  return (
    <StyleCommentItem className="itemCustomcmt flex items-start gap-3 mb-4">
      <Avatar src={comment?.userId?.avatar} />
      <div className="flex-1">
        <div className="bg-gray-100 px-4 py-2 rounded-lg relative">
          <span className="font-semibold">{comment?.userId?.nameDisplay || comment?.userId?.userName}</span>

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
                ✔
              </span>
              <span
                className="text-gray-500 cursor-pointer"
                onClick={() => setIsEditing(false)}
              >
                ✖
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


        <div className="flex items-center text-xs text-gray-500 mt-1 gap-4 ml-2">
          <span
            className="cursor-pointer hover:underline flex items-center gap-1"
            onClick={() => onToggleLikeCmt(comment._id)}
          >
            {isLikedCmt ? (
              <HeartFilled className="colorLike" />
            ) : (
              <HeartOutlined />
            )}
            {likesCmtCount} Thích
          </span>
          <span
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="cursor-pointer hover:underline"
          >
            Trả lời
          </span>
          <span>{formatTimeFromNow(comment.createdAt)}</span>
        </div>

        {showReplyInput && (
          <div className="flex items-center mt-2 ml-2 gap-2">
            <input
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Nhập phản hồi..."
              className="border px-3 py-1 rounded-md text-sm w-full"
            />
            <SendOutlined
              onClick={() => {
                onReply(comment._id, replyContent);
                setReplyContent("");
                setShowReplyInput(false);
              }}
              className="cursor-pointer text-blue-500"
            />
            <button onClick={() => setShowReplyInput(false)} className="text-xs text-gray-500">Đóng</button>
          </div>
        )}

        {/* Nếu có replies */}
        {comment.totalReplies > 0 && (
          <div className="mt-2 ml-2 mb-2">
            <button
              onClick={() => handleShowReplyCmt()}
              className="text-blue-500 text-xs hover:underline"
            >
              {showReply ? (
                `Ẩn đi ${comment.totalReplies} phản hồi`
                
              ) : (
                `Hiện thêm ${comment.totalReplies} phản hồi`
              )}
              
            </button>
          </div>
        )}

        {showReply && <div>
          {dataListCommenReply.map((item: any, idx: any) => (
            <ReplyCommentItem
              data={item}
              key={idx}
              currentUserId={currentUserId}
              onReply={onReply}
              onDelete={handleDeleteComment}
              onReport={handleReportComment}
              onToggleLike={handleToggleLike}
              idMainCmt={comment._id}
            />
          ))}
        </div>}
        
      </div>
      <Modal
        title="Báo cáo bình luận"
        open={isReportModalOpen}
        onOk={handleConfirmReport}
        onCancel={() => {
          setIsReportModalOpen(false);
          setReportReason("");
        }}
        okText="Gửi báo cáo"
        cancelText="Hủy"
      >
        <p>Nhập lý do bạn muốn báo cáo bình luận này:</p>
        <Input.TextArea
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          rows={4}
          placeholder="Nhập lý do..."
        />
      </Modal>
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