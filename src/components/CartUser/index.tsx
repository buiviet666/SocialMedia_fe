import React from 'react';
import styled, { css } from 'styled-components';
import { Avatar, Button } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';

export interface CartUserProps {
  dataItem?: {
    name?: string;
    des?: string;
    avatar?: string;
  };
  isFollow?: boolean;
  onToggleFollow?: () => void;
  onChangeAvatar?: () => void;
  size?: 'small' | 'medium' | 'large';
}

const avatarSizeMap = {
  small: 40,
  medium: 64,
  large: 100,
};

const CartUser = ({
  dataItem,
  isFollow,
  onToggleFollow,
  onChangeAvatar,
  size = 'medium',
}: CartUserProps) => {
  const avatarSize = avatarSizeMap[size];

  return (
    <StyleCartUser $size={size}>
      <div className="cartuser_container">
        <div className="cartuser_avatar">
          <Avatar
            size={avatarSize}
            icon={!dataItem?.avatar && <UserOutlined />}
            src={dataItem?.avatar}
          />
          {onChangeAvatar && (
            <Button
              icon={<UploadOutlined />}
              size="small"
              onClick={onChangeAvatar}
              className="change_avatar_btn"
            >
              Đổi ảnh
            </Button>
          )}
        </div>
        <div className="cartuser_info">
          <span className="cartuser_name">{dataItem?.name || 'Tên người dùng'}</span>
          <div className="cartuser_desc">{dataItem?.des || 'Mô tả ngắn'}</div>
        </div>
      </div>
      {typeof isFollow !== 'undefined' && (
        <div className="cartuser_follow" onClick={onToggleFollow}>
          {isFollow ? 'Đã theo dõi' : 'Theo dõi'}
        </div>
      )}
    </StyleCartUser>
  );
};

export default CartUser;

const StyleCartUser = styled.div<{ $size: 'small' | 'medium' | 'large' }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); */
  transition: all 0.2s;

  .cartuser_container {
    display: flex;
    align-items: center;
  }

  .cartuser_avatar {
    margin-right: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .change_avatar_btn {
    font-size: 12px;
    padding: 0 8px;
    height: 24px;
  }

  .cartuser_info {
    display: flex;
    flex-direction: column;
  }

  .cartuser_name {
    font-weight: 600;
    color: #333;
    ${({ $size }) =>
      $size === 'small'
        ? css`font-size: 14px;`
        : $size === 'large'
        ? css`font-size: 20px;`
        : css`font-size: 16px;`}
  }

  .cartuser_desc {
    color: #888;
    ${({ $size }) =>
      $size === 'small'
        ? css`font-size: 11px;`
        : $size === 'large'
        ? css`font-size: 15px;`
        : css`font-size: 13px;`}
  }

  .cartuser_follow {
    font-size: 13px;
    font-weight: 600;
    color: #1890ff;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      text-decoration: underline;
    }
  }
`;
