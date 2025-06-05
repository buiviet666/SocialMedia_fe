/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Input, Avatar, List, Button, Tooltip, InputRef } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import userApi from "../../apis/api/userApi";
import conversationApi from "../../apis/api/conversation";
import messageApi from "../../apis/api/messageApi";
import toast from "react-hot-toast";
import socket from "../../utils/socket";

type MessageProps = {
  onClose?: () => void;
};

const Message = ({ onClose }: MessageProps) => {
  const inputRef = useRef<InputRef>(null);
  const [friends, setFriends] = useState([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [input, setInput] = useState("");
  const selectedRef = useRef<any>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const currentUserId = sessionStorage.getItem("userId") || localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUser = await userApi.getCurrentUser();
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

  return (
    <StyleMessage>
      <div
        className="flex justify-end mb-3.5 cursor-pointer hover:underline text-[16px]"
        onClick={handleClickFriend}
      >
        xem tất cả
      </div>

      {!selected ? (
        <>
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
                <div key={friend._id} className="friendItem" onClick={handleClick}>
                  <Avatar src={friend.avatar} size={50} />
                  <span>{friend.nameDisplay || friend.userName}</span>
                </div>
              );
            })}
          </div>
          <List
            header={<strong>Đoạn chat gần đây</strong>}
            itemLayout="horizontal"
            dataSource={conversations.filter((c: any) => c.lastMessage)}
            renderItem={(conversation: any) => {
              const participant = conversation.participants?.find(
                (p: any) => p._id !== currentUserId
              ) || {};
              return (
                <List.Item
                  key={conversation._id}
                  onClick={() => openChatWithFriend(conversation)}
                  style={{ cursor: "pointer" }}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={participant.avatar} />}
                    title={participant.nameDisplay || participant.userName || ""}
                    description={
                      conversation.lastMessage?.content || "Tin nhắn gần nhất"
                    }
                  />
                </List.Item>
              );
            }}
          />
        </>
      ) : (
        <div className="flex flex-col" style={{ height: "95%" }}>
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
              Quay lại
            </Button>
          </div>
          <div className="chatContent" ref={chatRef}>
            {(selected.messages || []).map((msg: any, idx: number) => (
              <div
                key={idx}
                className={`chatBubble ${
                  msg?.senderId?._id === currentUserId ? "me" : "other"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
          <div className="chatInput mt-auto">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={handleSend}
              placeholder="Nhập tin nhắn..."
            />
            <Button type="primary" icon={<SendOutlined />} onClick={handleSend} />
          </div>
        </div>
      )}
    </StyleMessage>
  );
};

const StyleMessage = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px;

  .friendList {
    display: flex;
    overflow-x: auto;
    padding: 10px 0;
    gap: 12px;
    margin-bottom: 12px;
    border-bottom: 1px solid #eee;
  }

  .friendItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    width: 72px;
    text-align: center;
    font-size: 13px;
    transition: all 0.3s;
  }

  .friendItem:hover {
    transform: scale(1.05);
  }

  .friendItem span {
    margin-top: 4px;
    word-break: break-word;
    white-space: normal;
    font-weight: 500;
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
`;


export default Message;
