import React from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";

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
    name: "Ngọc Hân",
    avatar: "https://i.pravatar.cc/150?img=52",
  },
];

const mockMessages = [
  { from: "u1", to: "me", text: "Hi, bạn khỏe không?" },
  { from: "me", to: "u1", text: "Mình ổn, còn bạn?" },
  { from: "u2", to: "me", text: "Đi cafe không?" },
  { from: "me", to: "u2", text: "Chiều nay nhé!" },
];

const InboxMessage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const selectedFriend = mockFriends.find((f) => f.id === id);

  const selectedMessages = mockMessages.filter(
    (msg) => msg.from === id || msg.to === id
  );

  const handleSelectFriend = (friendId: string) => {
    navigate(`/inbox/${friendId}`);
  };

  return (
    <StyleInboxMessage>
      <div className="sidebar">
        <h3>Friends</h3>
        {mockFriends.map((friend) => (
          <div
            key={friend.id}
            className={`friend-item ${id === friend.id ? "active" : ""}`}
            onClick={() => handleSelectFriend(friend.id)}
          >
            <img src={friend.avatar} alt={friend.name} />
            <span>{friend.name}</span>
          </div>
        ))}
      </div>
      <div className="chat-box">
        {selectedFriend ? (
          <>
            <div className="chat-header">
              <img src={selectedFriend.avatar} alt={selectedFriend.name} />
              <h4>{selectedFriend.name}</h4>
            </div>
            <div className="chat-body">
              {selectedMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${msg.from === "me" ? "me" : "other"}`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input type="text" placeholder="Nhập tin nhắn..." />
              <button>Gửi</button>
            </div>
          </>
        ) : (
          <div className="no-selection">Chọn người để bắt đầu trò chuyện</div>
        )}
      </div>
    </StyleInboxMessage>
  );
};

const StyleInboxMessage = styled.div`
  display: flex;
  height: 100vh;

  .sidebar {
    width: 240px;
    border-right: 1px solid #eee;
    padding: 16px;
  }

  .friend-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    cursor: pointer;
    border-radius: 6px;
  }

  .friend-item:hover,
  .friend-item.active {
    background-color: #f5f5f5;
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
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .chat-header img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .chat-body {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .chat-message {
    max-width: 70%;
    padding: 8px 12px;
    border-radius: 12px;
    font-size: 14px;
  }

  .chat-message.me {
    background-color: #dcf8c6;
    align-self: flex-end;
  }

  .chat-message.other {
    background-color: #f1f0f0;
    align-self: flex-start;
  }

  .chat-input {
    display: flex;
    border-top: 1px solid #eee;
    padding: 12px 16px;
    gap: 8px;
  }

  .chat-input input {
    flex: 1;
    padding: 8px 12px;
    border-radius: 20px;
    border: 1px solid #ccc;
    outline: none;
  }

  .chat-input button {
    padding: 8px 16px;
    border: none;
    background-color: #1677ff;
    color: white;
    border-radius: 20px;
    cursor: pointer;
  }

  .no-selection {
    margin: auto;
    font-size: 18px;
    color: gray;
  }
`;

export default InboxMessage;
