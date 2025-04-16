import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import * as React from 'react';
import styled from 'styled-components';

export interface CartUserProps {
  dataItem?: any;
}

export default function CartUser({ dataItem }: CartUserProps) {
  return (
    <StyleCartUser>
      <div className="cartuser_container">
        <div className="cartuser_avantar">
          <Avatar icon={<UserOutlined />} />
        </div>
        <div className="cartuser_info">
          <span>{dataItem?.name}</span>
          <div>{dataItem?.des}</div>
        </div>
      </div>
      <div className="cartuser_follow">Theo dõi</div>
    </StyleCartUser>
  );
}

const StyleCartUser = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 8px 0;
  align-items: center;

  .cartuser_container {
    display: flex;
    flex-direction: row;
  }

  .cartuser_avantar {
    margin-right: 12px;
  }

  .cartuser_info span {
    color: #000000;
    font-size: 14px;
    font-weight: 600;
    line-height: 16px;
  }

  .cartuser_info div {
    color: #737373;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
  }

  .cartuser_follow {
    font-size: 12px;
    color: #37afe1;
    font-weight: 600;
    line-height: 16px;
    cursor: pointer;
  }
`;
