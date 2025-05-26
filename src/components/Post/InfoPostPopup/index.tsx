import React from 'react';
import { Modal, Avatar, Input, Button } from 'antd';
import { HeartOutlined, MessageOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from 'styled-components';
import { settingsCart } from '../../../constants/sliderSetting';

const { TextArea } = Input;

interface InfoPostPopupProps {
  open: boolean;
  onClose: () => void;
  data: {
    img: string[];
    name: string;
    avatar?: string;
    caption: string;
    location: string;
    likes: number;
  };
}

const InfoPostPopup = ({ open, onClose, data }: InfoPostPopupProps) => {
  return (
    <StyledModal
      open={open}
      onCancel={onClose}
      footer={null}
      width={960}
      centered
      bodyStyle={{ padding: 0 }}
    >
      <div className="modal-content">
        <div className="modal-left">
          <Slider {...settingsCart}>
            {/* {data.img.map((url, idx) => (
              <img key={idx} src={url} alt={`slide-${idx}`} />
            ))} */}
            {data.img?.map((url, i) => (
                <img key={i} src={url} alt={`modal-img-${i}`} className="w-full" />
            ))}
          </Slider>
        </div>

        <div className="modal-right">
          <div className="post-header">
            <Avatar size="large" icon={<UserOutlined />} src={data.avatar} />
            <div>
              <div className="username">{data.name}</div>
              <div className="location">{data.location}</div>
            </div>
          </div>

          <div className="caption">
            <span className="username">{data.name}</span> {data.caption}
          </div>

          <div className="interactions">
            <HeartOutlined />
            <MessageOutlined />
            <SendOutlined />
          </div>

          <div className="likes">{data.likes} lượt thích</div>

          <div className="comment-box">
            <TextArea rows={2} placeholder="Thêm bình luận..." />
            <Button type="text">Đăng</Button>
          </div>
        </div>
      </div>
    </StyledModal>
  );
};

const StyledModal = styled(Modal)`
  .modal-content {
    display: flex;
    height: 600px;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .modal-left {
    flex: 1;
    background-color: #000;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .modal-right {
    flex: 1;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #fff;
  }

  .post-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;

    .username {
      font-weight: bold;
    }

    .location {
      font-size: 12px;
      color: #888;
    }
  }

  .caption {
    margin: 12px 0;
    .username {
      font-weight: bold;
      margin-right: 6px;
    }
  }

  .interactions {
    display: flex;
    gap: 16px;
    font-size: 20px;
    margin: 12px 0;
  }

  .likes {
    font-weight: 500;
    margin-bottom: 12px;
  }

  .comment-box {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

export default InfoPostPopup;
