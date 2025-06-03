import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CartUser from '../../components/CartUser';
import userApi from '../../apis/api/userApi';
import toast from 'react-hot-toast';

const SuggestFriend = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await userApi.getRecommendedUsers();
        setSuggestions(res.data || []);
      } catch (err) {
        toast.error("Lỗi khi lấy danh sách gợi ý");
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <StyleSuggestFriend>
      <div className="wrapper">
        <h2>Gợi ý cho bạn</h2>
        <div className="list">
          {suggestions.length > 0 ? (
            suggestions.map((user) => (
              <CartUser dataItem={user} key={user._id} size="small" />
            ))
          ) : (
            <p className="empty">Không có gợi ý nào lúc này.</p>
          )}
        </div>
      </div>
    </StyleSuggestFriend>
  );
};

export default SuggestFriend;

const StyleSuggestFriend = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px;

  .wrapper {
    width: 100%;
    max-width: 400px;
    background-color: #fff;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  h2 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 70vh;
    overflow-y: auto;
  }

  .list::-webkit-scrollbar {
    width: 6px;
  }

  .list::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 10px;
  }

  .empty {
    text-align: center;
    color: #999;
    font-style: italic;
    font-size: 14px;
    padding: 12px;
  }
`;
