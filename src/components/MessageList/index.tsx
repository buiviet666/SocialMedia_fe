/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useRef } from "react";
import { FaCheck } from "react-icons/fa";
import { MdOutlineMoreVert } from "react-icons/md";
import { Avatar, Dropdown } from "antd";
import { GrFormClose } from "react-icons/gr";
import { UserOutlined } from "@ant-design/icons";

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
      {messages.map((msg) => {
        const senderId = msg.senderId?._id || msg.senderId;
        const isMe = senderId === currentUserId;
        const time = new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div key={msg._id} className={`flex mb-3 items-start ${isMe ? "justify-end" : "justify-start"}`}>
            {!isMe && (
              <div className="pr-3">
                <Avatar
                  size="large"
                  src={msg.senderId.avatar}
                  icon={<UserOutlined />}
                  onError={() => false}
                />
              </div>
            )}

            <div className={`relative max-w-[70%] ${isMe ? "text-right" : "text-left"}`}>
              <Dropdown
                menu={createMessageMenu(msg)}
                trigger={["click"]}
                placement={isMe ? "bottomRight" : "bottomLeft"}
              >
                <MdOutlineMoreVert
                  className={`absolute top-2.5 ${isMe ? "right-full -mr-6 text-white" : "left-full -ml-6"} cursor-pointer`}
                />
              </Dropdown>

              <div
                className={`px-4 py-2 rounded-lg ${
                  isMe
                    ? "bg-blue-500 text-white rounded-br-none pl-10"
                    : "bg-gray-200 text-black rounded-bl-none pr-10"
                }`}
              >
                {editingMessageId === msg._id ? (
                  <div className="flex flex-col">
                    <input
                      value={editingValue}
                      onChange={(e) => onEditChange(e.target.value)}
                      className="border border-gray-300 px-2 py-1 rounded text-black"
                    />
                    <div className="mt-2 flex gap-2 items-center">
                      <span
                        className="text-green-600 cursor-pointer"
                        onClick={() => onEditSubmit(msg._id)}
                      >
                        <FaCheck />
                      </span>
                      <span
                        className="text-gray-500 cursor-pointer"
                        onClick={onEditCancel}
                      >
                        <GrFormClose className="w-[26px] h-[26px]" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    {msg.status === "HIDDEN" ? (
                      <span className="italic text-gray-400">Message has been hidden</span>
                    ) : (
                      <>
                        <span>{msg.content}</span>
                        {msg.status === "EDITED" && (
                          <span className="text-xs text-gray-300 ml-2">(is edit)</span>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="text-xs text-gray-500 mt-1">
                {time}
                {isMe && msg.deliveredTo?.length > 0 && (
                  <span className="ml-2 text-blue-400 inline-flex items-center gap-1">
                    <FaCheck /> Received
                  </span>
                )}
                {isMe && msg.seenBy?.length > 0 && (
                  <span className="ml-2 text-green-500 inline-flex items-center gap-1">
                    <FaCheck /> Seen
                  </span>
                )}
              </div>
            </div>

            {isMe && (
              <div className="pl-3">
                <Avatar
                  size="large"
                  src={msg.senderId.avatar}
                  icon={<UserOutlined />}
                  onError={() => false}
                />
              </div>
            )}
          </div>
        );
      })}
      <div ref={messageEndRef} />
    </>
  );
});

export default MessageList;
