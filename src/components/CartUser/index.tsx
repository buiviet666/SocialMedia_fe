/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Avatar, Button } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import userApi from '../../apis/api/userApi';
import { useNavigate } from 'react-router-dom';

export interface CartUserProps {
  dataItem?: any;
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
  onToggleFollow,
  onChangeAvatar,
  size = 'medium',
}: CartUserProps) => {
  const avatarSize = avatarSizeMap[size];
  const [isFollowing, setIsFollowing] = useState<boolean>(dataItem?.isFollowing || false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUserId = sessionStorage.getItem('userId') || localStorage.getItem('userId');

  const handleFollowToggle = async () => {
    if (!dataItem?._id) return;
    setLoading(true);
    try {
      let newFollowingStatus = !isFollowing;
      if (isFollowing) {
        await userApi.unfollowUser(dataItem._id);
        toast.success('Unfollowed');
        newFollowingStatus = false;
      } else {
        await userApi.followUser(dataItem._id);
        toast.success('Followed');
        newFollowingStatus = true;
      }
      setIsFollowing(newFollowingStatus);
      onToggleFollow?.();
    } catch (err) {
      toast.error('Operation failed!');
      console.log(err);
    }
    setLoading(false);
  };


  useEffect(() => {
    setIsFollowing(dataItem?.isFollowing || false);
  }, [dataItem?.isFollowing]);

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
          <span className="cartuser_name" onClick={() => navigate(`/profile/${dataItem?._id}`)}>
            {dataItem?.name || dataItem?.nameDisplay || dataItem?.userName}
          </span>
          <div className="cartuser_desc">{dataItem?.bio || 'Mô tả ngắn'}</div>
        </div>
      </div>
      {dataItem?._id && dataItem._id !== currentUserId && (
        <div className="cartuser_follow" onClick={handleFollowToggle}>
          <Button
            size="small"
            loading={loading}
            type={isFollowing ? 'default' : 'primary'}
          >
            {isFollowing ? 'unFollow' : 'Following'}
          </Button>
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
    max-width: 150px;

  }

  .cartuser_name {
    font-weight: 600;
    cursor: pointer;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
