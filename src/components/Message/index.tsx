/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Input, Avatar, List, Button, Tooltip, InputRef, Dropdown } from "antd";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import userApi from "../../apis/api/userApi";
import conversationApi from "../../apis/api/conversation";
import messageApi from "../../apis/api/messageApi";
import toast from "react-hot-toast";
import socket from "../../utils/socket";
import { MdOutlineMoreVert } from "react-icons/md";
import moment from "moment";
import ModalDelete from "../Modal/ModalDelete";

type MessageProps = {
  onClose?: () => void;
};

const Message = ({ onClose }: MessageProps) => {
  const inputRef = useRef<InputRef>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [input, setInput] = useState("");
  const selectedRef = useRef<any>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [dataToDel, setDataToDel] = useState<any>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [infoUser, setInfoUser] = useState<any>(null);

  const navigate = useNavigate();
  const currentUserId = sessionStorage.getItem("userId") || localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUser = await userApi.getCurrentUser();
        setInfoUser(resUser?.data)
        const user = resUser?.data;

        if (!user?.following || user.following.length === 0) {
          setFriends([]);
        } else {
          const friendRes = await userApi.getUsersByIds(user.following);
          setFriends(friendRes?.data);
        }

        const convoRes = await conversationApi.getListConversation();
        setConversations(convoRes?.data);
      } catch (error) {
        console.log(error);
        toast.error("Load data failed");
      }
      };
      fetchData();
    }, []);

    useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    if (currentUserId) {
      socket.emit("join", currentUserId);
      console.log("🧩 Join socket room:", currentUserId);
    }

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      // KHÔNG disconnect socket nếu bạn dùng nhiều tab/components
      // socket.disconnect(); ← chỉ disconnect khi logout hoặc đóng app hẳn
    };
  }, [currentUserId]);

  useEffect(() => {
    if (selected && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [selected]);

  const handleReceiveMessage = (message: any) => {
    const conversationId = message.conversationId._id || message.conversationId;
    const currentSelected = selectedRef.current;

    console.log("📨 Nhận từ socket:", message);
    console.log("🆔 selected._id:", currentSelected?._id);
    console.log("🆔 message.conversationId:", conversationId);

    if (!currentSelected || conversationId !== currentSelected._id) {
      setConversations((prev: any[]) =>
        prev.map((conv: any) =>
          conv._id === conversationId
            ? { ...conv, lastMessage: message }
            : conv
        )
      );
      return;
    }

    setSelected((prev: any) => ({
      ...prev,
      messages: [...(prev?.messages || []), message],
    }));

    setConversations((prev: any[]) =>
      prev.map((conv: any) =>
        conv._id === conversationId
          ? { ...conv, lastMessage: message }
          : conv
      )
    );
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [selected?.messages]);

  const handleSend = async () => {
    if (!input.trim() || !selected) return;
    try {
      let conversationId = selected._id;

      if (!conversationId) {
        const res = await conversationApi.createConversation({
          partnerId: selected.id,
        });
        conversationId = res.data._id;
        setSelected((prev: any) => ({ ...prev, _id: conversationId }));
      }

      const msgRes = await messageApi.sendMessage({
        conversationId,
        content: input,
        type: "TEXT",
      });

      const newMsg = msgRes.data;

      setSelected((prev: any) => ({
        ...prev,
        messages: [...(prev.messages || []), newMsg],
      }));

      setInput("");

      const updatedConversations = await conversationApi.getListConversation();
      setConversations(updatedConversations.data);
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  const openChatWithFriend = async (conversation: any) => {
    try {
      const res = await messageApi.getMessagesByConversation(conversation._id);
      const partner = conversation.participants.find(
        (p: any) => p._id !== currentUserId
      ) || {};

      setSelected({
        ...conversation,
        id: partner._id,
        name: partner.nameDisplay || partner.userName || "",
        avatar: partner.avatar || "",
        messages: res.data,
      });
    } catch (err) {
      console.error("Open chat failed", err);
    }
  };

  const handleClickFriend = () => {
    navigate(`/inbox/`);
    onClose?.();
  };

  const handleDeleteConversation = async (data: any) => {
    try {
      const res: any = await conversationApi.deleteConversation(data);

      if (res?.statusCode === 200) {
        toast.success(res?.message || "Delete success!");
      } else {
        toast.error(res?.message || "Error!")
      }
    } catch (error) {
      console.log(error);
      toast.error("Error server!")
    }
  }

  const handleClick = (key: string, conversation: any) => {
    switch (key) {
      case "delete_convo":
        handleDeleteConversation(conversation);
        break;
      default:
        break;
    }
  }

  // 👇 Lắng nghe trạng thái online/offline realtime
  useEffect(() => {
    const handleOnlineStatus = ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
      setFriends((prev) =>
        prev.map((friend) =>
          friend._id === userId ? { ...friend, isOnline } : friend
        )
      );

      // ✅ Sửa lại từ setDataConversation → setConversations
      setConversations((prev) =>
        prev.map((conv) => ({
          ...conv,
          participants: conv.participants.map((p: any) =>
            p._id === userId ? { ...p, isOnline } : p
          ),
        }))
      );
    };

    socket.on("user_online_status", handleOnlineStatus);

    return () => {
      socket.off("user_online_status", handleOnlineStatus);
    };
  }, []);

  const handleMsgMenuClick = (key: string, msg: any) => {
    switch (key) {
      case "edit":
        setEditingMessageId(msg._id);
        setEditingValue(msg.content);
        break;
      case "delete":
        handleClickPopupDel(msg);
        break;
      case "report":
        console.log("Report:", msg);
        break;
    }
  };

  const handleClickPopupDel = (data: any) => {
    setDataToDel(data?._id);
    setIsDeleteConfirmOpen(true);
  }

  const handleUpdateMessage = async (messageId: string) => {
    const msg = selected?.messages?.find((m: any) => m._id === messageId);
    if (!msg) {
      toast.error("Không tìm thấy tin nhắn cần sửa");
      return;
    }

    const senderId = msg?.senderId?._id || msg?.senderId;
    if (senderId !== infoUser?._id) {
      toast.error("Bạn không thể sửa tin nhắn của người khác");
      return;
    }

    if (!editingValue.trim()) {
      toast.error("Nội dung không được để trống");
      return;
    }

    try {
      const res = await messageApi.updateMessage(messageId, editingValue);
      const updatedMsg = res.data;

      setSelected((prev: any) => ({
        ...prev,
        messages: prev.messages.map((m: any) =>
          m._id === messageId ? updatedMsg : m
        ),
      }));

      toast.success("Cập nhật tin nhắn thành công");
      setEditingMessageId(null);
      setEditingValue("");
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      toast.error("Không thể cập nhật tin nhắn");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      setLoadingDelete(true); // bạn cần có state này
      const res: any = await messageApi.deleteMessage(messageId);

      if (res?.statusCode === 200) {
        toast.success(res?.message || "Đã xóa tin nhắn");

        setSelected((prev: any) => ({
          ...prev,
          messages: prev.messages.map((msg: any) =>
            msg._id === messageId ? { ...msg, status: "DELETED", content: "" } : msg
          ),
        }));
        setIsDeleteConfirmOpen(false);
      }
    } catch (error) {
      toast.error("Không thể xóa tin nhắn");
      console.error("Error:", error);
    } finally {
      setLoadingDelete(false);
    }
  };



  return (
    <StyleMessage>
      {!selected ? (
        <>
          <div className="flex flex-row items-center">
            <div className="friendList">
              {friends.map((friend: any) => {
                const existingConversation = conversations.find((conv: any) =>
                  conv.participants.some((p: any) => p._id === friend._id)
                );

                const handleClick = () => {
                  if (existingConversation) {
                    openChatWithFriend(existingConversation);
                  } else {
                    setSelected({
                      _id: null,
                      name: friend.nameDisplay || friend.userName,
                      avatar: friend.avatar,
                      id: friend._id,
                      messages: [],
                    });
                  }
                };

                return (
                  // <div key={friend._id} className="friendItem" onClick={handleClick}>
                  //   <Avatar src={friend.avatar} size={50} />
                  //   <span>{friend.nameDisplay || friend.userName}</span>
                  // </div>
                  <Tooltip
                    placement="top"
                    title={friend.nameDisplay || friend.userName}
                    arrow
                    key={friend._id}
                  >
                    <div
                      className="friend-item"
                      onClick={handleClick}
                    >
                      <div className="avatar-wrapper">
                        <Avatar
                          size="large"
                          src={!avatarError && friend?.avatar ? friend.avatar : undefined}
                          icon={<UserOutlined />}
                          onError={() => {
                            setAvatarError(true);
                            return false;
                          }}
                        />
                        <span className={`status-indicator ${friend.isOnline ? "online" : "offline"}`} />
                      </div>
                      <div>{friend.nameDisplay || friend.userName}</div>
                    </div>
                  </Tooltip>
                );
              })}
            </div>
            <div
              className="pl-3 flex justify-end mb-3.5 cursor-pointer hover:underline text-[16px] text-nowrap"
              onClick={handleClickFriend}
            >
              see all
            </div>
          </div>
          <List
            header={<strong>Recent chats</strong>}
            itemLayout="horizontal"
            dataSource={conversations.filter((c: any) => c.lastMessage)}
            renderItem={(conversation: any) => {
              const participant = conversation.participants?.find(
                (p: any) => p._id !== currentUserId
              ) || {};
              return (
                <List.Item
                  key={conversation._id}
                  style={{ cursor: "default" }}
                  className="customCartIb"
                >
                  <div
                    onClick={() => openChatWithFriend(conversation)}
                    style={{ flex: 1, cursor: "pointer" }}>
                    <List.Item.Meta
                      avatar={<Avatar src={participant.avatar} />}
                      title={participant.nameDisplay || participant.userName || ""}
                      description={
                        conversation.lastMessage?.content || "Tin nhắn gần nhất"
                      }
                    />
                  </div>
                  <Dropdown
                    menu={{ 
                      items: [
                        {label: "Delete", key: "delete_convo"}
                      ], 
                      onClick: ({key}) => handleClick(key, conversation) }}
                    trigger={["click"]}
                    placement="bottomLeft"
                  >
                    <MdOutlineMoreVert style={{ cursor: "pointer", alignSelf: 'center' }} />
                  </Dropdown>
                </List.Item>
              );
            }}
          />
        </>
      ) : (
        <div className="flex flex-col h-full">
          <div className="chatHeader">
            <Avatar src={selected.avatar} />
            <Tooltip placement="top" title={selected.name} arrow>
              <span
                style={{
                  maxWidth: "140px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                className="text-[16px] ml-2 font-semibold cursor-pointer"
                onClick={() => navigate(`/profile/${selected.id}`)}
              >
                {selected.name}
              </span>
            </Tooltip>
            <Button type="text" onClick={() => setSelected(null)} className="ml-auto">
              Back
            </Button>
          </div>
          <div className="chatContent" ref={chatRef}>
            {(selected.messages || []).map((msg: any, idx: number) => {
              const isMe = msg.senderId?._id === currentUserId;

              const dropdownItems = [];
              if (isMe && (msg.status === 'SENT' || msg.status === 'EDITED')) {
                dropdownItems.push({ key: 'edit', label: 'Chỉnh sửa' });
              }
              if (isMe && msg.status !== 'DELETED') {
                dropdownItems.push({ key: 'delete', label: 'Xóa' });
              }
              if (!isMe && msg.status !== 'DELETED') {
                dropdownItems.push({ key: 'report', label: 'Báo cáo' });
              }
              const formattedTime = moment(msg.createdAt).format("HH:mm, DD/MM/YYYY");

              return (
                <div
                  key={idx}
                  className={`group relative flex items-end gap-2 ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isMe && <Avatar src={msg.senderId?.avatar} size={30} />}

                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm relative ${
                      isMe ? "bg-blue-100 rounded-br-md" : "bg-gray-200 rounded-bl-md"
                    }`}
                  >
                    {/* Hiển thị nội dung theo status */}
                    <div className={`${['DELETED', 'HIDDEN'].includes(msg.status) ? 'italic text-gray-500' : ''}`}>
                      {editingMessageId === msg._id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            size="small"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onPressEnter={() => handleUpdateMessage(msg._id)}
                            className="text-sm"
                            autoFocus
                          />
                          <div className="flex gap-1">
                            <Button
                              size="small"
                              type="primary"
                              onClick={() => handleUpdateMessage(msg._id)}
                            >
                              ✅
                            </Button>
                            <Button
                              size="small"
                              danger
                              onClick={() => {
                                setEditingMessageId(null);
                                setEditingValue("");
                              }}
                            >
                              ❌
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {msg.status === 'DELETED' && 'Tin nhắn đã bị xóa'}
                          {msg.status === 'HIDDEN' && 'Tin nhắn đã bị ẩn bởi quản trị viên'}
                          {msg.status === 'SENT' && msg.content}
                          {msg.status === 'EDITED' && (
                            <>
                              {msg.content}
                              <span className="ml-2 text-xs italic text-gray-400">(đã chỉnh sửa)</span>
                            </>
                          )}
                        </>
                      )}
                    </div>

                    <div className="text-[10px] text-gray-500 text-right mt-1">
                      {formattedTime}
                    </div>

                    {/* Dropdown hiển thị khi hover nếu có menu */}
                    {dropdownItems.length > 0 && (
                      <div className="absolute top-1 right-1 hidden group-hover:block">
                        <Dropdown
                          menu={{
                            items: dropdownItems,
                            onClick: ({ key }) => handleMsgMenuClick(key, msg),
                          }}
                          trigger={["click"]}
                        >
                          <MdOutlineMoreVert className="text-gray-500 cursor-pointer" />
                        </Dropdown>
                      </div>
                    )}
                  </div>

                  {isMe && <Avatar src={msg.senderId?.avatar} size={30} />}
                </div>
              );
            })}
          </div>

          <div className="chatInput mt-auto">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={handleSend}
              placeholder="Enter message..."
            />
            <Button type="primary" icon={<SendOutlined />} onClick={handleSend} />
          </div>
        </div>
      )}
      <ModalDelete
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => handleDeleteMessage(dataToDel)}
        loading={loadingDelete}
        title="Delete message"
        description="Are you sure you want to delete this message? This action cannot be undone."
      />
    </StyleMessage>
  );
};

const StyleMessage = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  .friendList {
    display: flex;
    overflow-x: auto;
    padding: 10px 0;
    gap: 12px;
    margin-bottom: 12px;
    border-bottom: 1px solid #eee;
  }

  .friend-item {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70px;
    text-align: center;
    cursor: pointer;
    border-radius: 8px;
    padding: 10px;

  }

  .friend-item:hover {
    background-color: #f0f0f0;
    border-radius: 8px;
  }

  .friend-item div {
    max-width: 45px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    margin-top: 6px;
  }

  .friend-item:hover,
  .friend-item.active {
    background-color: #f0f0f0;
  }

  .friend-item img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .avatar-wrapper {
    position: relative;
    display: inline-block;
  }

  .chatHeader {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-bottom: 1px solid #ddd;
    background: #fafafa;
  }

  .chatContent {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .chatBubble {
    max-width: 75%;
    padding: 10px 14px;
    border-radius: 18px;
    background-color: #f5f5f5;
    font-size: 14px;
    line-height: 1.4;
    transition: background-color 0.2s;
  }

  .chatBubble.me {
    background-color: #d4f1ff;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }

  .chatBubble.other {
    background-color: #f0f0f0;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
  }

  .chatBubble:hover {
    background-color: #e2e2e2;
  }

  .chatInput {
    display: flex;
    gap: 8px;
    padding: 10px;
    border-top: 1px solid #ddd;
    background-color: white;
  }

  .ant-list-header {
    font-weight: bold;
    font-size: 15px;
    padding: 8px 16px;
    background-color: #fafafa;
    border-bottom: 1px solid #eee;
  }

  .ant-list-item-meta-title {
    font-weight: 600;
  }

  .ant-list-item {
    transition: background 0.2s;
  }

  .ant-list-item:hover {
    background-color: #f7f7f7;
  }

  .customCartIb {
    max-width: 300px;
  }

  .customCartIb .ant-list-item-meta-title,
  .customCartIb .ant-list-item-meta-description {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .status-indicator {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
  }

  .status-indicator.online {
    background-color: #4caf50; /* xanh lá */
  }

  .status-indicator.offline {
    background-color: #9e9e9e; /* xám */
  }
`;


export default Message;
