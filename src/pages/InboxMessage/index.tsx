/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import userApi from "../../apis/api/userApi";
import conversationApi from "../../apis/api/conversation";
import { Avatar, Dropdown, List, MenuProps, Tooltip } from "antd";
import toast from "react-hot-toast";
import messageApi from "../../apis/api/messageApi";
import socket from "../../utils/socket";
import { MdOutlineMoreVert } from "react-icons/md";
import MessageList from "../../components/MessageList";
import ModalReport from "../../components/Modal/ModalReport";
import { UserOutlined } from "@ant-design/icons";
import ModalDelete from "../../components/Modal/ModalDelete";

interface SelectedConversation {
  messages?: any[];
  participants?: any[];
  _id?: string | null;
  infoUser?: any;
}

const reasonReport = [
  "Spam or inappropriate content",
  "Harassment",
  "Threatening or abusive",
  "Hate speech",
  "Other",
]

const InboxMessage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SelectedConversation | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [dataDeleteConversation, setDataDeleteConversation] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [input, setInput] = useState("");
  const [infoUser, setInfoUser] = useState<any>(null);
  const [listFollowing, setListFollowing] = useState<any>(null);
  const [listConversation, setListConversation] = useState<any>(null);
  const [reportModal, setReportModal] = useState<{
    open: boolean;
    messageId: string | null;
  }>({ open: false, messageId: null });

  const getInfoUser = async () => {
    try {
      const res: any = await userApi.getCurrentUser();
      setInfoUser(res?.data);
    } catch (error) {
      toast.error("Error loading data");
      console.log(error);
    }
  };

  const getListFollowing = async () => {
    try {
      const res: any = await userApi.getFollowing();
      setListFollowing(res?.data);
    } catch (error) {
      toast.error("Error loading data");
      console.log(error);
    }
  }

  const getListConverSation = async () => {
    try {
      const res: any = await conversationApi.getListConversation();
      setListConversation(res?.data);
    } catch (error) {
      toast.error("Error loading data");
      console.log(error);
    }
  }

  const getDataConversationById = async (idConversation: string): Promise<any[]> => {
    try {
      const res: any = await messageApi.getMessagesByConversation(idConversation);
      return res?.data || [];
    } catch (error) {
      toast.error("Error loading data");
      console.log(error);
      return [];
    }
  }

  const getFriendInfo = () => {
    const found = selected?.participants?.find((p: any) => p._id !== infoUser?._id);
    if (found) return found;

    const fallback = listFollowing.find((f: any) =>
      selected?.participants?.some?.((p: any) => p._id === f._id) || selected?._id === f._id
    );
    return fallback;
  };

  const handleChooseChat = async (conversationOrFriend: any, type: "friend" | "message") => {
    try {
      let messages = [];
      const isHasConversation = conversationOrFriend?.participants?.length;
      const otherUser = conversationOrFriend?.participants?.length
        ? conversationOrFriend.participants.find((p: any) => p._id !== infoUser._id)
        : conversationOrFriend;
      if (type === "friend") {
        if (isHasConversation) {
          messages = await getDataConversationById(conversationOrFriend?._id);
          setSelected({ ...conversationOrFriend, messages: messages, infoUser: otherUser});
          navigate(`/inbox/${conversationOrFriend._id}`);
        } else {
          setSelected({
            _id: null,
            participants: [infoUser, conversationOrFriend],
            messages: [],
            infoUser: conversationOrFriend
          });
          navigate(`/inbox/${conversationOrFriend._id}`);
        }
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
        return;
      } else if (type === "message") {
        messages = await getDataConversationById(conversationOrFriend?._id);
        setSelected({ ...conversationOrFriend, messages: messages, infoUser: otherUser});
        navigate(`/inbox/${conversationOrFriend?._id}`);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    } catch (error) {
      toast.error("Unable to open conversation.");
      console.error(error);
    }
  };

  const handleDeltePopup = (data: any) => {
    setDataDeleteConversation(data);
    setIsDeleteConfirmOpen(true);
  }

  const handleSendMessage = async () => {
    const messageText = input.trim();
    if (!input.trim() || !selected) return;

    setInput("");

    try {
      let conversationId = selected._id;
      if (!conversationId) {
        const partner = selected.participants?.find((p: any) => p._id !== infoUser?._id);
        const res = await conversationApi.createConversation({ partnerId: partner._id });
        conversationId = res.data._id;

        setListConversation((prev: any) => [...prev, res.data]);
        navigate(`/inbox/${conversationId}`);

        setSelected({
          ...res.data,
          messages: [],
        });
      }

      const res = await messageApi.sendMessage({
        conversationId,
        content: messageText,
        type: "TEXT",
      });

      const newMsg = res.data;

      setSelected((prev: any) => ({
        ...prev,
        _id: conversationId,
        messages: [...(prev?.messages || []), newMsg],
      }));

      socket.emit("send_message", newMsg);
    } catch (err) {
      console.log(err);
      toast.error("Message could not be sent.");
    }
  };

  const handleUpdateMessage = async (messageId: string) => {
    const msg = selected?.messages?.find((m) => m._id === messageId);
    const senderId = msg?.senderId?._id || msg?.senderId;

    if (senderId !== infoUser?._id) {
      toast.error("Bạn không thể sửa tin nhắn của người khác");
      return;
    }

    try {
      const res = await messageApi.updateMessage(messageId, editingValue);
      const updatedMsg = res.data;

      setSelected((prev: any) => ({
        ...prev,
        messages: prev.messages.map((msg: any) =>
          msg._id === messageId ? updatedMsg : msg
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


  const handleDeleteConversation = async (data: any) => {
    try {
      setLoadingDelete(true);
      const res: any = await conversationApi.deleteConversation(data._id);
      if (res?.statusCode === 200) {
        toast.success(res?.message);
        setDataDeleteConversation(null);
        setIsDeleteConfirmOpen(false);
        getListConverSation();
      }
    } catch (error) {
      toast.error("Error loading data");
      console.log(error);
    } finally {
      setLoadingDelete(false);
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const res: any = await messageApi.deleteMessage(messageId);

      if (res?.statusCode === 200) {
        toast.success(res.message);
        // Cập nhật lại danh sách tin nhắn trong hội thoại hiện tại
        setSelected((prev: any) => ({
          ...prev,
          messages: prev.messages?.filter((msg: any) => msg._id !== messageId),
        }));
        socket.emit("delete_message", {
          messageId,
          conversationId: selected?._id,
        });
      } else {
        toast.error(res?.message || "Cannot delete message");
      }
    } catch (error: any) {
      toast.error("Error loading data");
      console.log(error);
    }
  };

  const handleReceiveMessage = async (message: any) => {
    const conversationId = message.conversationId._id || message.conversationId;
    // Nếu đang mở đúng hội thoại
    if (selected?._id === conversationId) {
      setSelected((prev: any) => ({
        ...prev,
        messages: [...(prev?.messages || []), message],
      }));

      try {
        // Nếu chưa đánh dấu đã nhận
        if (!message.deliveredTo?.includes(infoUser?._id)) {
          await messageApi.markAsDelivered(message._id);
        }
      } catch (err) {
        console.error("Lỗi markAsDelivered:", err);
      }
    }

    // Cập nhật lastMessage trong danh sách hội thoại
    setListConversation((prev: any[]) =>
      prev.map((conv: any) =>
        conv._id === conversationId
          ? { ...conv, lastMessage: message }
          : conv
      )
    );
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    if (infoUser?._id) {
      socket.emit("join", infoUser?._id);
    }
    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [infoUser?._id]);

  useEffect(() => {
    socket.on("message_deleted", ({ messageId }) => {
      setSelected((prev: any) => ({
        ...prev,
        messages: prev.messages?.filter((m: any) => m._id !== messageId),
      }));
    });

    return () => {
      socket.off("message_deleted");
    };
  }, [selected?._id]);

  useEffect(() => {
    const handleMessageEdited = ({ messageId, content, status, updatedAt }: any) => {
      setSelected((prev: any) => ({
        ...prev,
        messages: prev.messages.map((msg: any) =>
          msg._id === messageId
            ? { ...msg, content, status, updatedAt }
            : msg
        ),
      }));
    };
    socket.on("message_edited", handleMessageEdited);
    return () => {
      socket.off("message_edited", handleMessageEdited);
    };
  }, [selected?._id]);
   

  const markMessagesAsDeliveredAndRead = async (messages: any[]) => {
    const deliveredIds: string[] = [];
    const readIds: string[] = [];

    messages.forEach((msg) => {
      const senderId = msg.senderId?._id || msg.senderId;
      if (senderId !== infoUser?._id) {
        if (!msg.deliveredTo?.includes(infoUser?._id)) deliveredIds.push(msg._id);
        if (!msg.seenBy?.includes(infoUser?._id)) readIds.push(msg._id);
      }
    });

    try {
      if (deliveredIds.length > 0) {
        await messageApi.markDeliveredBulk({ messageIds: deliveredIds });
        socket.emit("messages_delivered", {
          messageIds: deliveredIds,
          deliveredBy: infoUser?._id,
        });
      }

      if (readIds.length > 0) {
        await messageApi.markReadBulk({ messageIds: readIds });
        socket.emit("messages_read", {
          messageIds: readIds,
          readBy: infoUser?._id,
        });
      }
    } catch (err) {
      console.error("❌ Lỗi khi đánh dấu đã nhận/đọc:", err);
    }
  };


  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [selected?.messages]);

  useEffect(() => {
    const openById = async () => {
      if (!id || listConversation?.length === 0) return;
      const foundConv = listConversation.find((c: any) => c._id === id);
      if (foundConv) {
        const messagesRes = await messageApi.getMessagesByConversation(id);
        setSelected({ ...foundConv, messages: messagesRes.data });
        await markMessagesAsDeliveredAndRead(messagesRes.data);
      }
    };
    openById();
  }, [id, listConversation]);

  

  const handleClick = (key: string, conversation: any) => {
    switch (key) {
      case "delete":
        handleDeltePopup(conversation);
        break;
      default:
        break;
    }
  }

  const items2: MenuProps["items"] = [
    {label: "Edit", key: "edit"},
    {label: "Delete", key: "delete"}
  ]

  const items3: MenuProps["items"] = [
    {label: "Copy", key: "copy"},
    {label: "Report", key: "report"}
  ]

  const createMessageMenu = (msg: any): MenuProps => ({
    items: msg.senderId?._id === infoUser?._id || msg.senderId === infoUser?._id ? items2 : items3,
    onClick: ({ key }) => {
      switch (key) {
        case "delete":
          handleDeleteMessage(msg._id);
          break;
        case "edit":
          setEditingMessageId(msg._id);
          setEditingValue(msg.content);
          break;
        case "copy":
          navigator.clipboard.writeText(msg.content);
          toast.success("Đã sao chép nội dung");
          break;
        case "report":
          setReportModal({ open: true, messageId: msg._id });
          break;
        default:
          break;
      }
    },
  });

  // 👇 Lắng nghe trạng thái online/offline realtime
  useEffect(() => {
    const handleOnlineStatus = ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
      // Cập nhật trạng thái của bạn bè trong danh sách
      setListFollowing((prev: any) =>
        prev.map((friend: any) =>
          friend._id === userId ? { ...friend, isOnline } : friend
        )
      );

      // Cập nhật participant trong danh sách conversation
      setListConversation((prev: any) =>
        prev.map((conv: any) => ({
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

  useEffect(() => {
    const handleDelivered = ({ messageIds, deliveredBy }: any) => {
      setSelected((prev: any) => ({
        ...prev,
        messages: prev.messages.map((msg: any) =>
          messageIds.includes(msg._id)
            ? {
                ...msg,
                deliveredTo: [...new Set([...(msg.deliveredTo || []), deliveredBy])],
              }
            : msg
        ),
      }));
    };

    const handleRead = ({ messageIds, readBy }: any) => {
      setSelected((prev: any) => ({
        ...prev,
        messages: prev.messages.map((msg: any) =>
          messageIds.includes(msg._id)
            ? {
                ...msg,
                seenBy: [...new Set([...(msg.seenBy || []), readBy])],
              }
            : msg
        ),
      }));
    };

    socket.on("messages_delivered", handleDelivered);
    socket.on("messages_read", handleRead);

    return () => {
      socket.off("messages_delivered", handleDelivered);
      socket.off("messages_read", handleRead);
    };
  }, []);

  useEffect(() => {
    const handleReceiveNotification = (notification: any) => {
      toast(notification.message || "Bạn có thông báo mới");
      // Optional: hiển thị icon thông báo chưa đọc trong Navbar hoặc Inbox
    };

    socket.on("new_notification", handleReceiveNotification);

    return () => {
      socket.off("new_notification", handleReceiveNotification);
    };
  }, []);

  const handleReportMessage = async ({targetId, reason}: {
    targetId: string;
    reason: string;
  }) => {
    if (!reason.trim()) {
      toast.error("Please select a reason");
      return;
    }
    try {
      await messageApi.reportMessage({
        messageId: targetId,
        reason,
      });
      toast.success("Message has been reported.");
      setReportModal({ open: false, messageId: null });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to report message.");
    }
  };


  useEffect(() => {
    const fetchAll = async () => {
      await getInfoUser();
      await getListFollowing();
      await getListConverSation();
      setLoading(false);
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (!id || !listConversation?.length || !infoUser?._id) return;

    const existingConversation = listConversation.find((conv: any) =>
      conv.participants.some((p: any) => p._id === id) &&
      conv.participants.some((p: any) => p._id === infoUser._id)
    );

    if (existingConversation) {
      navigate(`/inbox/${existingConversation._id}`);
    } else {
      const friend = listFollowing?.find((f: any) => f._id === id);
      if (friend) {
        setSelected({
          _id: null,
          participants: [infoUser, friend],
          messages: [],
          infoUser: friend,
        });
      }
    }
  }, [id, listConversation, infoUser?._id]);

  console.log("selected", selected);
  

  if (loading) return <div>Data is loading...</div>;
  
  return (
    <StyleInboxMessage>
      <div className="sidebar">
        <Tooltip
          placement="top"
          title={infoUser?.nameDisplay || infoUser?.userName || ''}
          arrow
        >
          <div onClick={() => navigate('/profile')} className="titleNameCustom text-[21px] cursor-pointer inline-block hover:underline">
            <b>{infoUser?.nameDisplay || infoUser?.userName || ''}</b>
          </div>
        </Tooltip>

        <div className="friend-list">
          {listFollowing?.length === 0 ? (
            <p>No friends yet.</p>
          ) : (
            listFollowing?.map((friend: any) => {
              const existingConversation = listConversation.find((item: any) =>
                item.participants.some((p: any) => p._id === friend._id)
              );
              return (
                <Tooltip
                  placement="top"
                  title={friend.nameDisplay || friend.userName}
                  arrow
                  key={friend._id}
                >
                  <div
                    className="friend-item"
                    onClick={() => handleChooseChat(existingConversation || friend, "friend",)}
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
            })
          )}
        </div>
        <div>
          <List
            header={<strong>Message list</strong>}
            itemLayout="horizontal"
            dataSource={listConversation?.filter((c: any) => c.lastMessage)}
            renderItem={(conversation: any) => {
              const participant = conversation.participants?.find(
                (p: any) => p._id !== infoUser?._id
              ) || {};
              
              return (
                <List.Item
                  key={conversation._id}
                  style={{ cursor: "default" }}
                  className="customCartIb"
                >
                  <div
                    onClick={() => handleChooseChat(conversation, "message")}
                    style={{ flex: 1, cursor: "pointer" }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size="large"
                          src={!avatarError && participant?.avatar ? participant.avatar : undefined}
                          icon={<UserOutlined />}
                          onError={() => {
                            setAvatarError(true);
                            return false;
                          }}
                        />
                      }
                      title={
                        <Tooltip
                          placement="top"
                          title={participant.nameDisplay || participant.userName || ""}
                          arrow
                        >
                          {participant.nameDisplay || participant.userName || ""}
                        </Tooltip>
                      }
                      description={
                        conversation.lastMessage?.content || "Latest Message"
                      }
                    />
                  </div>

                  <Dropdown
                    menu={{ 
                      items: [
                        {label: "Delete", key: "delete"}
                      ],
                      onClick: ({key}) => handleClick(key, conversation) }}
                    trigger={["click"]}
                    placement="bottomLeft"
                  >
                    <MdOutlineMoreVert style={{ cursor: "pointer" }} />
                  </Dropdown>
                </List.Item>
              );
            }}
          />
        </div>
      </div>

      <div className="chat-box">
        {selected ? (
          <>
            <div className="chat-header">
              <div className="chat-header-info flex items-center gap-3">
                {(() => {
                  const friend = getFriendInfo();
                  return (
                    <>
                      <Avatar
                        size="large"
                        src={!avatarError && friend?.avatar ? friend.avatar : undefined}
                        icon={<UserOutlined />}
                        onError={() => {
                          setAvatarError(true);
                          return false;
                        }}
                      />

                      <div className="flex flex-col">
                        <span 
                          className="cursor-pointer font-semibold text-base"
                          onClick={() => navigate(`/profile/${friend?._id}`)}
                        >
                          {friend?.nameDisplay || friend?.userName || "User"}
                        </span>

                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              friend?.isOnline ? "bg-green-500" : "bg-gray-400"
                            }`}
                          ></span>
                          {friend?.isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="chat-body" ref={chatRef}>
              <div className="chat-body" ref={chatRef}>
                <MessageList
                  currentUserId={infoUser?._id}
                  messages={selected.messages || []}
                  editingMessageId={editingMessageId}
                  editingValue={editingValue}
                  onEditChange={setEditingValue}
                  onEditSubmit={handleUpdateMessage}
                  onEditCancel={() => setEditingMessageId(null)}
                  createMessageMenu={createMessageMenu}
                />
              </div>
            </div>
            <div className="chat-input flex items-center gap-2 p-3 border-t border-gray-200 bg-white">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Enter message..."
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-200 disabled:opacity-50"
                disabled={!input.trim()}
              >
                Send
              </button>
            </div>

          </>
        ) : (
          <div className="no-selection">Select person to start chatting with</div>
        )}
      </div>
      <ModalReport
        open={reportModal.open}
        onClose={() => setReportModal({ open: false, messageId: null })}
        onSubmit={({ targetId, reason }) =>
          handleReportMessage({ targetId, reason })
        }
        targetId={reportModal.messageId || ""}
        targetType="MESSAGE"
        title="Report Message"
        reportReasons={reasonReport}
      />
      <ModalDelete
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => handleDeleteConversation(dataDeleteConversation)}
        loading={loadingDelete}
        title="Delete conversation"
        description="Are you sure you want to delete this conversation? This action cannot be undone."
      />
    </StyleInboxMessage>
  );
};
export default InboxMessage;
const StyleInboxMessage = styled.div`
  display: flex;
  height: 100vh;

  .sidebar {
    width: 260px;
    border-right: 1px solid #eee;
    padding: 16px;
    overflow-y: auto;
  }

  .friend-item {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    border-radius: 8px;
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

  .chat-box {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .chat-header {
    padding: 12px 16px;
    border-bottom: 1px solid #eee;
  }

  .chat-header-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .chat-header-info img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .chat-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background-color: #fafafa;
  }

  .chat-message {
    max-width: 75%;
    padding: 10px 14px;
    border-radius: 14px;
    font-size: 14px;
    line-height: 1.4;
    word-break: break-word;
  }

  .chat-message.me {
    background-color: #dcf8c6;
    align-self: flex-end;
    border-bottom-right-radius: 0;
  }

  .chat-message.other {
    background-color: #f1f0f0;
    align-self: flex-start;
    border-bottom-left-radius: 0;
  }

  .chat-input {
    display: flex;
    padding: 12px 16px;
    border-top: 1px solid #eee;
    gap: 10px;
    background-color: white;
  }

  .chat-input input {
    flex: 1;
    padding: 10px 16px;
    border-radius: 20px;
    border: 1px solid #ccc;
    outline: none;
  }

  .chat-input button {
    padding: 8px 20px;
    border: none;
    background-color: #1677ff;
    color: white;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
  }

  .no-selection {
    margin: auto;
    font-size: 18px;
    color: gray;
  }

  .friend-list {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
  }

  .friend-item {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70px;
    text-align: center;
    cursor: pointer;
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

  .customCartIb {
    max-width: 228px;
  }

  .customCartIb .ant-list-item-meta-title,
  .customCartIb .ant-list-item-meta-description {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ant-list-item-meta {
    align-items: center !important;
  }

  .chat-message-wrapper {
    display: flex;
    align-items: flex-end;
    margin-bottom: 8px;
  }

  .chat-message-wrapper.me {
    flex-direction: row;
    justify-content: flex-end;
  }

  .chat-message-wrapper.other {
    flex-direction: row;
    justify-content: flex-start;
  }

  .chat-message {
    max-width: 75%;
    padding: 10px 14px;
    border-radius: 14px;
    font-size: 14px;
    line-height: 1.4;
    word-break: break-word;
    display: flex;
    flex-direction: column;
  }

  .chat-message .message-time {
    font-size: 11px;
    color: #999;
    margin-top: 4px;
    align-self: flex-end;
  }

  .avatar-wrapper {
    position: relative;
    display: inline-block;
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

  .titleNameCustom {
    overflow: hidden;
    width: 100%;
    text-overflow: ellipsis;
  }
`