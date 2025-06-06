/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import userApi from "../../apis/api/userApi";
import conversationApi from "../../apis/api/conversation";
import { Avatar, Dropdown, Input, List, MenuProps, Modal, Tooltip } from "antd";
import toast from "react-hot-toast";
import messageApi from "../../apis/api/messageApi";
import socket from "../../utils/socket";
import { MdOutlineMoreVert } from "react-icons/md";

const InboxMessage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUserId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
  const [dataCurrent, setDataCurrent] = useState<any>(null);
  const [dataListFriend, setDataListFriend] = useState<any[]>([]);
  const [dataConversation, setDataConversation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [input, setInput] = useState("");
  const [reportModal, setReportModal] = useState<{
    open: boolean;
    messageId: string | null;
  }>({ open: false, messageId: null });
  const [reportReason, setReportReason] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await userApi.getCurrentUser();
        setDataCurrent(userRes.data);

        if (userRes?.data?.following?.length > 0) {
          const friendsRes = await userApi.getUsersByIds(userRes.data.following);
          setDataListFriend(friendsRes.data);
        } else {
          setDataListFriend([]);
        }

        const convRes = await conversationApi.getListConversation();
        setDataConversation(convRes.data);

      } catch (err) {
        console.log(err);
        toast.error("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
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
    }

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [currentUserId]);

  useEffect(() => {
    socket.on("message_deleted", ({ messageId }) => {
      setSelected((prev: any) => ({
        ...prev,
        messages: prev.messages.filter((m: any) => m._id !== messageId),
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
  
  

  const handleDeleteConversation = async () => {
    const getIdConversation: any = id;
    try {
      const res: any = await conversationApi.deleteConversation(getIdConversation);

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

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const res: any = await messageApi.deleteMessage(messageId);

      if (res?.statusCode === 200) {
        toast.success(res.message || "Xóa tin nhắn thành công");

        // Cập nhật lại danh sách tin nhắn trong hội thoại hiện tại
        setSelected((prev: any) => ({
          ...prev,
          messages: prev.messages.filter((msg: any) => msg._id !== messageId),
        }));

        // (Nếu dùng socket.io để đồng bộ realtime)
        socket.emit("delete_message", {
          messageId,
          conversationId: selected._id,
        });
      } else {
        toast.error(res?.message || "Không thể xóa tin nhắn");
      }
    } catch (error: any) {
      console.error("❌ Lỗi xóa tin nhắn:", error);
      toast.error("Lỗi máy chủ. Vui lòng thử lại sau.");
    }
  };


  const handleReceiveMessage = (message: any) => {
    const conversationId = message.conversationId._id || message.conversationId;

    // Cập nhật nếu đang mở đúng hội thoại
    if (selected?._id === conversationId) {
      setSelected((prev: any) => ({
        ...prev,
        messages: [...(prev?.messages || []), message],
      }));
    }

    // Cập nhật lastMessage trong danh sách hội thoại
    setDataConversation((prev: any[]) =>
      prev.map((conv: any) =>
        conv._id === conversationId
          ? { ...conv, lastMessage: message }
          : conv
      )
    );
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !selected) return;

    try {
      let conversationId = selected._id;

      // Nếu chưa có hội thoại, tạo mới
      if (!conversationId) {
        const partner = selected.participants?.find((p: any) => p._id !== currentUserId);
        const res = await conversationApi.createConversation({ partnerId: partner._id });
        conversationId = res.data._id;

        // Cập nhật danh sách và URL
        setDataConversation((prev) => [...prev, res.data]);
        navigate(`/inbox/${conversationId}`);

        setSelected((prev: any) => ({
          ...res.data,
          messages: [],
        }));
      }

      const res = await messageApi.sendMessage({
        conversationId,
        content: input,
        type: "TEXT",
      });
      const newMsg = res.data;
      setSelected((prev: any) => ({
        ...prev,
        _id: conversationId,
        messages: [...(prev?.messages || []), newMsg],
      }));
      socket.emit("send_message", newMsg);
      setInput("");
    } catch (err) {
      console.log(err);
      toast.error("Không gửi được tin nhắn.");
    }
  };

  const handleChooseChat = async (conversationOrFriend: any, type: "friend" | "message") => {
    try {
      const selectedConversation = conversationOrFriend;

      if (type === "friend") {
        // Nếu đã có conversation
        const existing = dataConversation.find((conv: any) =>
          conv.participants.some((p: any) => p._id === conversationOrFriend._id)
        );

        if (existing) {
          const messagesRes = await messageApi.getMessagesByConversation(existing._id);
          setSelected({ ...existing, messages: messagesRes.data });
          navigate(`/inbox/${existing._id}`);
        } else {
          // Hiển thị giao diện trò chuyện với bạn (chưa từng nhắn tin)
          setSelected({
            _id: null,
            participants: [dataCurrent, conversationOrFriend],
            messages: [],
          });
          navigate(`/inbox/temp-${conversationOrFriend._id}`); // chỉ để phân biệt
        }

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);

        return;
      }

      // Nếu là click từ danh sách hội thoại
      const messagesRes = await messageApi.getMessagesByConversation(selectedConversation._id);
      setSelected({ ...selectedConversation, messages: messagesRes.data });
      navigate(`/inbox/${selectedConversation._id}`);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      console.error("❌ Lỗi khi chọn hội thoại:", error);
      toast.error("Không thể mở hội thoại.");
    }
  };

  const handleUpdateMessage = async (messageId: string) => {
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

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [selected?.messages]);

  useEffect(() => {
    const openById = async () => {
      if (!id || dataConversation.length === 0) return;
      const foundConv = dataConversation.find((c) => c._id === id);
      if (foundConv) {
        const messagesRes = await messageApi.getMessagesByConversation(id);
        setSelected({ ...foundConv, messages: messagesRes.data });
      }
    };
    openById();
  }, [id, dataConversation]);

  const getFriendInfo = () => {
    // Nếu đã có participants
    const found = selected?.participants?.find((p: any) => p._id !== currentUserId);
    if (found) return found;

    // Nếu không có → tìm trong danh sách bạn bè
    const fallback = dataListFriend.find((f: any) =>
      selected?.participants?.some?.((p: any) => p._id === f._id) || selected?._id === f._id
    );
    return fallback;
  };

  const items: MenuProps["items"] = [
    {label: "Delete", key: "delete"}
  ]

  const handleClick: MenuProps["onClick"] = ({key}) => {
    switch (key) {
      case "delete":
        handleDeleteConversation();
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
    items: msg.senderId?._id === currentUserId || msg.senderId === currentUserId ? items2 : items3,
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
      setDataListFriend((prev) =>
        prev.map((friend) =>
          friend._id === userId ? { ...friend, isOnline } : friend
        )
      );

      // Cập nhật participant trong danh sách conversation
      setDataConversation((prev) =>
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


  if (loading) return <div>Đang tải dữ liệu...</div>;
  
  return (
    <StyleInboxMessage>
      <div className="sidebar">
        <div onClick={() => navigate('/profile')} className="text-[21px] cursor-pointer inline-block hover:underline">
          <b>{dataCurrent?.nameDisplay || dataCurrent?.userName || ''}</b>
        </div>

        <div className="friend-list">
          {dataListFriend.length === 0 ? (
            <p>Không có bạn bè nào.</p>
          ) : (
            dataListFriend?.map((friend: any) => {
              const existingConversation = dataConversation.find((conv: any) =>
                conv.participants.some((p: any) => p._id === friend._id)
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
                    onClick={() => handleChooseChat(existingConversation || friend, "friend")}
                  >
                    <div className="avatar-wrapper">
                      <Avatar src={friend.avatar} size={50} />
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
            header={<strong>Tin nhắn</strong>}
            itemLayout="horizontal"
            dataSource={dataConversation.filter((c: any) => c.lastMessage)}
            renderItem={(conversation: any) => {
              const participant = conversation.participants?.find(
                (p: any) => p._id !== currentUserId
              ) || {};
              console.log("participant", participant);
              
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
                      avatar={<Avatar src={participant.avatar} />}
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
                        conversation.lastMessage?.content || "Tin nhắn gần nhất"
                      }
                    />
                  </div>

                  <Dropdown
                    menu={{ items, onClick: handleClick }}
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
              <div className="chat-header-info">
                {(() => {
                  const friend = getFriendInfo();
                  return (
                    <>
                      <Avatar src={friend?.avatar} />
                      <span>{friend?.nameDisplay || friend?.userName || "Người dùng"}</span>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="chat-body" ref={chatRef}>
              {selected.messages?.map((msg: any) => {
                const isMe = msg.senderId?._id === currentUserId || msg.senderId === currentUserId;
                const time = new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div key={msg._id} className={`chat-message-wrapper ${isMe ? "me" : "other"}`}>
                    {/* Dropdown 3 chấm bên trái nếu là mình */}
                    {isMe && (
                      <Dropdown
                        menu={createMessageMenu(msg)}
                        trigger={["click"]}
                        placement="bottomLeft"
                      >
                        <MdOutlineMoreVert style={{ cursor: "pointer", marginRight: 8 }} />
                      </Dropdown>
                    )}

                    {/* Nội dung tin nhắn */}
                    <div className={`chat-message ${isMe ? "me" : "other"}`}>
                      
                      {editingMessageId === msg._id ? (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <input
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            style={{ padding: 4, borderRadius: 4, border: "1px solid #ccc" }}
                          />
                          <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
                            <button
                              style={{ background: "#4caf50", color: "white", border: "none", padding: "4px 10px", borderRadius: 4 }}
                              onClick={() => handleUpdateMessage(msg._id)}
                            >
                              ✅
                            </button>
                            <button
                              style={{ background: "#f44336", color: "white", border: "none", padding: "4px 10px", borderRadius: 4 }}
                              onClick={() => setEditingMessageId(null)}
                            >
                              ❌
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div>{msg.content}</div>
                          {msg.status === 'EDITED' && <span style={{ fontSize: 11, color: '#888', marginLeft: 4 }}>(đã sửa)</span>}
                        </div>
                      )}

                      <div className="message-time">{time}</div>
                    </div>

                    {/* Dropdown 3 chấm bên phải nếu là người khác */}
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
            </div>
            <div className="chat-input">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Nhập tin nhắn..."
              />
              <button onClick={handleSendMessage}>Gửi</button>
            </div>

          </>
        ) : (
          <div className="no-selection">Chọn người để bắt đầu trò chuyện</div>
        )}
      </div>
      <Modal
        title="Báo cáo tin nhắn"
        open={reportModal.open}
        onCancel={() => setReportModal({ open: false, messageId: null })}
        onOk={async () => {
          if (!reportReason.trim()) {
            toast.error("Vui lòng nhập lý do báo cáo");
            return;
          }
          try {
            await messageApi.reportMessage({
              messageId: reportModal.messageId!,
              reason: reportReason.trim(),
            });
            toast.success("Đã báo cáo tin nhắn");
            setReportModal({ open: false, messageId: null });
            setReportReason("");
          } catch (err: any) {
            toast.error(err.response?.data?.message || "Lỗi báo cáo");
          }
        }}
      >
        <Input.TextArea
          rows={4}
          placeholder="Nhập lý do báo cáo..."
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
        />
      </Modal>
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

`