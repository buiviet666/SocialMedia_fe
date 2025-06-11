/* eslint-disable @typescript-eslint/no-explicit-any */
import { EllipsisOutlined, HeartFilled, HeartOutlined, SendOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Input, MenuProps, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { formatTimeFromNow } from '../../../utils/functionCommon';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import postApi from '../../../apis/api/postApi';

type Props = {
    data?: any;
    currentUserId?: string;
    onDelete: (commentId: string) => void;
    onReport: (commentId: string, reasonReport: string) => void;
    onToggleLike: (commentId: string) => void;
    onReply: (parentId: string, content: string) => void;
    dataComment: any;
}

const ReplyCommentItem = ({data, currentUserId, onDelete, onReport, onToggleLike, onReply, dataComment}: Props) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [isLike, setIsLike] = useState<boolean>(false);
    const [countLike, setCountLike] = useState<number>(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(data.content);
    
    
    const navigate = useNavigate();
    
    useEffect(() => {
        setIsLike(data?.likes?.includes(currentUserId));
        setCountLike(data?.likes?.length || 0);
    }, [data?.likes, currentUserId]);

    const isOwnComment = currentUserId === data?.userId?._id;

    const dropdownItems: MenuProps["items"] = isOwnComment
    ? [
        { label: "Edit comment", key: "update" },
        { label: "Delete comment", key: "delete" },
      ]
    : [{ label: "Report comment", key: "report" }];

    const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
        if (key === "delete") onDelete(data);
        else if (key === "report") setIsReportModalOpen(true);
        else if (key === "update") {
            setIsEditing(true);
            setEditContent(data.content);
        }
    };

    const handleUpdateCmt = async () => {
        try {
        const res: any = await postApi.updateComment(data._id, { content: editContent });
        if (res?.statusCode === 200) {
            toast.success(res?.message);
            data.content = editContent;
            setIsEditing(false);
        }
        } catch (error) {
        toast.error("Error updating comment!");
        console.log(error);
        }
    }

    const handleClickProfile = () => {
        if (currentUserId === data?.userId?._id) {
        navigate(`/profile`)
        } else {
        navigate(`/profile/${data?.userId?._id}`)
        }
    }

  return (
    <StyleReplyCommentItem>
        <div className="itemCustom flex items-start gap-3 mb-4">
            <Avatar src={data?.userId?.avatar} />
            <div className="flex-1">
                <div className="bg-gray-100 px-4 py-2 rounded-lg relative">
                <span className="font-semibold cursor-pointer" onClick={() => handleClickProfile()}>{data?.userId?.nameDisplay || data?.userId?.userName}</span>
                
                {!isEditing ? (
                    <p className="text-sm">{data?.content}</p>
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
                <Dropdown menu={{ items: dropdownItems, onClick: handleMenuClick }} trigger={["click"]}>
                    <EllipsisOutlined className="absolute top-2 right-2 cursor-pointer text-gray-500" />
                </Dropdown>
                </div>

                <div className="flex items-center text-xs text-gray-500 mt-1 gap-4 ml-2 whitespace-nowrap">
                <span
                    onClick={() => onToggleLike(data._id)}
                    className="cursor-pointer hover:underline flex items-center gap-1"
                >
                    {isLike ? (
                        <HeartFilled className="colorLike" />
                    ) : (
                        <HeartOutlined />
                    )}
                    {countLike} {isLike ? "unLike" : "Like"}
                </span>
                <span
                    onClick={() => {
                        setShowReplyInput(true);
                        const username = data?.userId?.nameDisplay || data?.userId?.userName || "";
                        setReplyContent(`@${username} `);
                        setTimeout(() => inputRef.current?.focus(), 0);
                    }}
                    className="cursor-pointer hover:underline"
                    >
                    Trả lời
                </span>
                <span>{formatTimeFromNow(data.createdAt)}</span>
                </div>

                {showReplyInput && (
                <div className="flex items-center mt-2 ml-2 gap-2">
                    <input
                    ref={inputRef}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Nhập phản hồi..."
                    className="border px-3 py-1 rounded-md text-sm w-full"
                    />
                    <SendOutlined
                    onClick={() => {
                        onReply(dataComment._id, replyContent);
                        setReplyContent("");
                        setShowReplyInput(false);
                    }}
                    className="cursor-pointer text-blue-500"
                    />
                    <button onClick={() => setShowReplyInput(false)} className="text-xs text-gray-500">Đóng</button>
                </div>
                )}
            </div>
        </div>
        <Modal
            title="Report comment"
            open={isReportModalOpen}
            onOk={() => onReport(data._id, reportReason)}
            onCancel={() => {
                setIsReportModalOpen(false);
                setReportReason("");
            }}
            okText="Submit report"
            cancelText="Cancel"
            >
            <p>Enter the reason you want to report this comment:</p>
            <Input.TextArea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={4}
                placeholder="Enter reason..."
            />
            </Modal>
    </StyleReplyCommentItem>
  )
}

export default ReplyCommentItem;

const StyleReplyCommentItem = styled.div`
    .colorLike {
        color: #ff4d4f !important;
    }
`