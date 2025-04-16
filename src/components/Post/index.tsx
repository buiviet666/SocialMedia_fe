import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EmojiPicker from "emoji-picker-react";
import { Avatar, Dropdown, MenuProps, Modal } from "antd";
import {
  CloseOutlined,
  CommentOutlined,
  CrownOutlined,
  EllipsisOutlined,
  HeartOutlined,
  SendOutlined,
  SmileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { settingsCart } from "../../constants/sliderSetting";

type Props = {
  data?: any;
};

const Post = ({ data }: Props) => {
  const [valueInput, setValueInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  const items: MenuProps["items"] = [
    {
      label: "Báo cáo",
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: "Bỏ theo dõi",
      key: "2",
    },
    {
      type: "divider",
    },
    {
      label: "Lưu bài viết",
      key: "3",
    },
    {
      type: "divider",
    },
    {
      label: "Xem toàn bộ bài viết",
      key: "4",
    },
    {
      type: "divider",
    },
    {
      label: "Hủy",
      key: "5",
    },
  ];

  const handleOpenModal = () => {
    setIsModalOpen(true);
    console.log(isModalOpen);
  };

  const onEmojiClick = (emojiObject: any) => {
    const { emoji } = emojiObject;
    const start = valueInput.substring(0, cursorPosition || 0);
    const end = valueInput.substring(cursorPosition || 0);
    const newValue = start + emoji + end;

    setValueInput(newValue);
    setCursorPosition((start + emoji).length);
    setShowEmojiPicker(false);

    // Đặt lại focus và vị trí con trỏ
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(
          (start + emoji).length,
          (start + emoji).length
        );
      }
    }, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueInput(e.target.value);
  };

  const handleEmojiPickerToggle = () => {
    setShowEmojiPicker(!showEmojiPicker);
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart);
    }
  };

  const deleteInput = () => {
    setValueInput("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setShowEmojiPicker(false);
  }, [data]);

  return (
    <StyleCartPost>
      <div className="cartpost_title">
        <div className="cartpost_title-content">
          <div className="cartpost_title-avantar">
            <Avatar icon={<UserOutlined />} />
          </div>
          <div className="cartpost_title-container">
            <div className="cartpost_title-info">
              name
              <span> &#8226; time</span>
            </div>
            <div className="cartpost_title-location">location</div>
          </div>
        </div>
        <div className="cartpost_title-iconmore">
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            placement="bottomLeft"
            className="dropdownPost"
          >
            <div className="navbar_setting">
              <EllipsisOutlined />
            </div>
          </Dropdown>
        </div>
      </div>
      <div className="cartpost_title-cartmain">
        <Slider {...settingsCart}>
          {Array.isArray(data?.img) ? (
            data.img.map((imgItem: any, imgIdx: any) => (
              <h1 key={imgIdx} onClick={handleOpenModal}>
                {imgItem}
              </h1>
            ))
          ) : data?.linkimg ? (
            <img src={data.linkimg} alt="ảnh" onClick={handleOpenModal} />
          ) : (
            <h1>{data?.text}</h1>
          )}
        </Slider>
      </div>
      <div className="cartpost_title-contentMain">
        <div className="cartpost_title-contenticon">
          <div className="cartpost_title-iconClick">
            <span>
              <HeartOutlined style={{ fontSize: "26px", padding: "7px" }} />
            </span>
            <span>
              <CommentOutlined style={{ fontSize: "26px", padding: "7px" }} />
            </span>
            <span>
              <SendOutlined style={{ fontSize: "26px", padding: "7px" }} />
            </span>
          </div>
          <div className="cartpost_title-save">
            <CrownOutlined style={{ fontSize: "26px", padding: "7px" }} />
          </div>
        </div>
        <div className="cartpost_title-likes">lượt thích</div>
        <div className="cartpost_title-description">
          <span>tên</span> và tiêu đề và tiêu đề và tiêu đề và tiêu đề và tiêu
          đề và tiêu đề và tiêu đề và tiêu đề và tiêu đề và tiêu đề
        </div>
        <div className="cartpost_title-moreComment">xem thêm bình luận</div>
        <div className="cartpost_title-comment">
          <input
            ref={inputRef}
            className="cartpost_title-comment-input"
            placeholder="Thêm bình luận..."
            value={valueInput}
            onChange={handleInputChange}
            onClick={() =>
              setCursorPosition(inputRef.current?.selectionStart || 0)
            }
          />
          {valueInput && (
            <>
              <CloseOutlined className="deleteInput" onClick={deleteInput} />
              <span className="post_commend">Đăng</span>
            </>
          )}
          <div onClick={handleEmojiPickerToggle} style={{ cursor: "pointer" }}>
            <SmileOutlined />
          </div>
        </div>
      </div>
      {showEmojiPicker && (
        <div className="pickEmoji_container" ref={emojiPickerRef}>
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
      <Modal
        title="Tạo bài viết mới"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <h2>Đây là nội dung của Modal</h2>
        <p>Bạn có thể đặt bất kỳ nội dung nào ở đây.</p>
        <button onClick={() => setIsModalOpen(false)}>Đóng</button>
      </Modal>
      {/* <ModalPopup isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Đây là nội dung của Modal</h2>
        <p>Bạn có thể đặt bất kỳ nội dung nào ở đây.</p>
        <button onClick={() => setIsModalOpen(false)}>Đóng</button>
      </ModalPopup> */}
    </StyleCartPost>
  );
};

export default Post;

const StyleCartPost = styled.div`
  border-bottom: 1px solid #dbdbdb;
  padding-bottom: 16px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;

  .cartpost_title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
  }

  .cartpost_title-content {
    display: flex;
    flex-direction: row;
  }

  .cartpost_title-container {
    display: flex;
    flex-direction: column;
  }

  .cartpost_title-contenticon {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 -7px;
  }

  .cartpost_title-comment {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .cartpost_title-avantar {
    margin-right: 12px;
    align-content: center;
  }

  .cartpost_title-cartmain .slick-dots {
    bottom: 21px;
  }

  .slick-dots li {
    margin: 0;
  }

  .cartpost_title-likes,
  .cartpost_title-description span {
    font-weight: 700;
  }

  .cartpost_title-moreComment {
    color: #737373;
    padding-bottom: 12px;
  }

  .cartpost_title-comment-input {
    width: 100%;
    border: unset;
    padding-right: 12px;
  }

  .cartpost_title-comment-input::placeholder {
    color: #737373;
    font-size: 14px;
    opacity: 0.8;
  }

  .pickEmoji_container {
    position: absolute;
    right: 0;
    bottom: 50px;
    z-index: 999;
  }

  .deleteInput {
    margin: 0 4px;
    cursor: pointer;
    transition: all 0.6s;
  }

  .deleteInput:hover {
    transform: rotate(180deg);
  }

  .deleteInput:hover svg {
    fill: #c62e2e;
  }

  .post_commend {
    margin-left: 4px;
    margin-right: 8px;
    font-weight: 700;
    color: #37afe1;
    cursor: pointer;
    opacity: 0.6;
    transition: all 0.6s;
  }

  .post_commend:hover {
    opacity: 1;
  }

  .dropdownPost .ant-dropdown-menu-title-content {
    justify-content: center;
  }

  .cartpost_title-iconmore,
  .cartpost_title-cartmain {
    cursor: pointer;
  }

  .cartpost_title-info {
    font-size: 14px;
    font-weight: 600;
    line-height: 18px;
    color: #000000;
  }

  .cartpost_title-info span {
    color: #737373;
    font-weight: 400;
  }
`;
