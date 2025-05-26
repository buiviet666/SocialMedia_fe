import React, { useState } from "react";
import styled from "styled-components";
import { Input, Avatar, List, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

type MessageProps = {
  onClose?: () => void;
};

const mockFriends = [
  {
    id: "u1",
    name: "Linh Chi",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: "u2",
    name: "Minh Tuấn",
    avatar: "https://i.pravatar.cc/150?img=18",
  },
  {
    id: "u3",
    name: "Yến Nhi",
    avatar: "https://i.pravatar.cc/150?img=22",
  },
  {
    id: "u4",
    name: "Trà My",
    avatar: "https://i.pravatar.cc/150?img=39",
  },
];

const mockConversations = [
  {
    id: "c1",
    name: "Linh Chi",
    avatar: "https://i.pravatar.cc/150?img=32",
    messages: [
      { from: "other", text: "Chào bạn!" },
      { from: "me", text: "Hello 😄" },
    ],
  },
  {
    id: "c2",
    name: "Minh Tuấn",
    avatar: "https://i.pravatar.cc/150?img=18",
    messages: [{ from: "other", text: "Tối đi chơi không?" }],
  },
];

const Message = ({onClose} : MessageProps) => {
  const [selected, setSelected] = useState<any>(null);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSend = () => {
    if (!input.trim()) return;
    const updated = {
      ...selected,
      messages: [...selected.messages, { from: "me", text: input }],
    };
    setSelected(updated);
    setInput("");
  };

  const openChatWithFriend = (friend: any) => {
    const existing = mockConversations.find((c) => c.name === friend.name);
    if (existing) {
      setSelected(existing);
    } else {
      setSelected({
        id: `c-new-${friend.id}`,
        name: friend.name,
        avatar: friend.avatar,
        messages: [],
      });
    }
  };

  const handleClickFriend = () => {
    navigate(`/inbox/`);
    onClose?.();
  };

  return (
    <StyleMessage>
        <span onClick={() => handleClickFriend()}>xem tất cả</span>
      {!selected ? (
        <>
          <div className="friendList">
            {mockFriends.map((friend) => (
              <div
                key={friend.id}
                className="friendItem"
                onClick={() => openChatWithFriend(friend)}
              >
                <Avatar src={friend.avatar} size={50} />
                <span>{friend.name}</span>
              </div>
            ))}
          </div>
          <List
            itemLayout="horizontal"
            dataSource={mockConversations}
            renderItem={(item) => (
              <List.Item onClick={() => setSelected(item)}>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={item.name}
                  description={item.messages.at(-1)?.text || "No messages yet"}
                />
              </List.Item>
            )}
          />
        </>
      ) : (
        <div className="chatBox">
          <div className="chatHeader">
            <Avatar src={selected.avatar} />
            <span>{selected.name}</span>
            <Button type="text" onClick={() => setSelected(null)}>
              Quay lại
            </Button>
          </div>
          <div className="chatContent">
            {selected.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chatBubble ${msg.from === "me" ? "me" : "other"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatInput">
            <Input
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
  .friendList {
    display: flex;
    overflow-x: auto;
    padding: 10px 0;
    gap: 12px;
    margin-bottom: 10px;
  }

  .friendItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    width: 70px;
    text-align: center;
    font-size: 12px;
  }

  .chatBox {
    display: flex;
    flex-direction: column;
    height: 400px;
  }

  .chatHeader {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-bottom: 1px solid #eee;
  }

  .chatContent {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .chatBubble {
    max-width: 80%;
    padding: 8px 12px;
    border-radius: 12px;
    background-color: #f1f1f1;
    width: fit-content;
  }

  .chatBubble.me {
    background-color: #aee1f9;
    align-self: flex-end;
  }

  .chatInput {
    display: flex;
    gap: 6px;
    padding: 8px;
    border-top: 1px solid #eee;
  }
`;

export default Message;
