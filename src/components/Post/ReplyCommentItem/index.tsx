import { EllipsisOutlined, HeartFilled, HeartOutlined, SendOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, MenuProps } from 'antd';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import { formatTimeFromNow } from '../../../utils/functionCommon';

type Props = {
    data?: any;
    currentUserId?: string;
    onDelete: (commentId: string) => void;
    onReport: (commentId: string) => void;
    onToggleLike: (commentId: string) => void;
    onReply: (commentId: string, content: string) => void;
    idMainCmt: string;
}

const ReplyCommentItem = ({data, currentUserId, onDelete, onReport, onToggleLike, onReply, idMainCmt}: Props) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const isOwnComment = currentUserId === data?.userId?._id;

    const dropdownItems: MenuProps["items"] = isOwnComment
    ? [
        { label: "Edit comment", key: "update" },
        { label: "Delete comment", key: "delete" },
      ]
    : [{ label: "Report comment", key: "report" }];

    const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
        if (key === "delete") onDelete(data._id);
        else if (key === "report") onReport(data._id);
    };

    console.log("data", data);
    

  return (
    <StyleReplyCommentItem>
        <div className="itemCustom flex items-start gap-3 mb-4">
            <Avatar src={data?.userId?.avatar} />
            <div className="flex-1">
                <div className="bg-gray-100 px-4 py-2 rounded-lg relative">
                <span className="font-semibold">{data?.userId?.nameDisplay || data?.userId?.userName}</span>
                <p className="text-sm">{data?.content}</p>
                <Dropdown menu={{ items: dropdownItems, onClick: handleMenuClick }} trigger={["click"]}>
                    <EllipsisOutlined className="absolute top-2 right-2 cursor-pointer text-gray-500" />
                </Dropdown>
                </div>

                <div className="flex items-center text-xs text-gray-500 mt-1 gap-4 ml-2 whitespace-nowrap">
                <span
                    onClick={() => onToggleLike(data._id)}
                    className="cursor-pointer hover:underline flex items-center gap-1"
                >
                    {data.likes?.includes(currentUserId) ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                    {data.likes?.length || 0} Thích
                </span>
                <span
                    onClick={() => {
                        setShowReplyInput(true); // luôn bật khung nhập
                        const username = data?.userId?.nameDisplay || data?.userId?.userName || "";
                        setReplyContent(`@${username} `); // thêm mention
                        setTimeout(() => inputRef.current?.focus(), 0); // focus sau khi render xong
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
                        onReply(idMainCmt, replyContent);
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
    </StyleReplyCommentItem>
  )
}

export default ReplyCommentItem;

const StyleReplyCommentItem = styled.div`
    
`