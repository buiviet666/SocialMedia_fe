import React, { memo, useEffect, useRef } from "react";
import { FaCheck } from "react-icons/fa";
import { MdClose, MdOutlineMoreVert } from "react-icons/md";
import { Dropdown } from "antd";

interface MessageListProps {
  currentUserId: string;
  messages: any[];
  editingMessageId: string | null;
  editingValue: string;
  onEditChange: (value: string) => void;
  onEditSubmit: (id: string) => void;
  onEditCancel: () => void;
  createMessageMenu: (msg: any) => any;
}

const MessageList = memo(({
  currentUserId,
  messages,
  editingMessageId,
  editingValue,
  onEditChange,
  onEditSubmit,
  onEditCancel,
  createMessageMenu
}: MessageListProps) => {

    const messageEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

  return (
    <>
      {messages?.map((msg: any) => {
        const senderId = msg.senderId?._id || msg.senderId;
        const isMe = senderId === currentUserId;
        const time = new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div key={msg._id} className={`chat-message-wrapper ${isMe ? "me" : "other"}`}>
            {isMe && (
              <Dropdown
                menu={createMessageMenu(msg)}
                trigger={["click"]}
                placement="bottomLeft"
              >
                <MdOutlineMoreVert style={{ cursor: "pointer", marginRight: 8 }} />
              </Dropdown>
            )}

            <div className={`chat-message ${isMe ? "me" : "other"}`}>
              {editingMessageId === msg._id ? (
                <div className="flex flex-col">
                  <input
                    value={editingValue}
                    onChange={(e) => onEditChange(e.target.value)}
                    className="border border-gray-300 px-2 py-1 rounded"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => onEditSubmit(msg._id)}
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={onEditCancel}
                    >
                      <MdClose />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div>{msg.content}</div>
                  {msg.status === 'EDITED' && <span className="text-xs text-gray-500 ml-1">(đã sửa)</span>}
                </div>
              )}

              <div className="message-time">{time}</div>

              {isMe && (
                <div className="text-xs text-gray-500 mt-1 flex gap-2 items-center">
                  {msg.deliveredTo?.length > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <FaCheck className="text-blue-500" />
                      <span>Đã nhận</span>
                    </span>
                  )}
                  {msg.seenBy?.length > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <FaCheck className="text-green-600" />
                      <span>Đã đọc</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {!isMe && (
              <Dropdown
                menu={createMessageMenu(msg)}
                trigger={["click"]}
                placement="bottomLeft"
              >
                <MdOutlineMoreVert style={{ cursor: "pointer", marginLeft: 8 }} />
              </Dropdown>
            )}
          </div>
        );
      })}
      <div ref={messageEndRef} />
    </>
  );
});

export default MessageList;
