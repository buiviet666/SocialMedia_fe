import React from 'react';
import styled from 'styled-components';
import { dataFake } from '../../utils/mockdata';
import CartUser from '../../components/CartUser';

type Props = {};

const SuggestFriend = (props: Props) => {
  return (
    <StyleSuggestFriend>
      <div className="wrapper">
        <h2>Gợi ý cho bạn</h2>
        <div className="list">
          {dataFake.map((item, idx) => (
            <CartUser dataItem={item} key={idx} isFollow size="small" />
          ))}
        </div>
      </div>
    </StyleSuggestFriend>
  );
};

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
`;

export default SuggestFriend;
