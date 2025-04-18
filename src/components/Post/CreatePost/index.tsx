import { UploadOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Upload } from "antd";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { TbPhotoSquareRounded } from "react-icons/tb";
import { RiDeleteBinLine } from "react-icons/ri";
import styled from "styled-components";

type Props = {
  onRequestClose?: () => void;
  setHasData?: (hasData: boolean) => void;
  step: "select" | "compose";
  setStep: (value: "select" | "compose") => void;
};

const CreatePost = ({ onRequestClose, setHasData, step, setStep }: Props) => {
  // const [step, setStep] = useState<"select" | "compose">("select");
  const [showConfirm, setShowConfirm] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [content, setContent] = useState("");

  const handleImageChange = (info: any) => {
    const fileList = info.fileList.slice(-5); // giới hạn 5 ảnh
    const files = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);
    setImages(files);
    const urls = files.map((file: any) => URL.createObjectURL(file));
    setPreviews(urls);

    if (files.length > 0) {
      setHasData?.(true); // báo lên Navbar là có dữ liệu đang nhập
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (e.target.value.trim() !== "") {
      setHasData?.(true);
    }
  };

  const resetData = () => {
    setStep("select");
    setImages([]);
    setPreviews([]);
    setContent("");
  };

  const confirmClose = () => {
    resetData();
    setShowConfirm(false);
    setHasData?.(false);
    onRequestClose?.(); // đóng modal từ Navbar
  };

  // const handleClose = () => {
  //   if (images.length > 0 || content.trim() !== "") {
  //     setShowConfirm(true);
  //   } else {
  //     resetData();
  //     onRequestClose?.();
  //   }
  // };

  const cancelClose = () => setShowConfirm(false);

  const handlePost = () => {
    // TODO: gọi API đăng bài
    message.success("Đăng bài thành công!");
    resetData();
    setHasData?.(false);
    onRequestClose?.();
  };

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <CreateStyled>
      {showConfirm && (
        <Modal
          open={true}
          onOk={confirmClose}
          onCancel={cancelClose}
          title="Discard"
          okText="Ok"
          cancelText="Cancel"
        >
          If you leave, you will lose your edits.
        </Modal>
      )}
      {step === "select" ? (
        <>
          {/* {previews.length === 0 && (
            <Upload
              accept="image/*"
              listType="picture"
              multiple
              beforeUpload={() => false}
              onChange={handleImageChange}
            >
              <TbPhotoSquareRounded />
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          )} */}

          <Upload
            accept="image/*"
            listType="picture"
            multiple
            beforeUpload={() => false}
            onChange={handleImageChange}
          >
            <TbPhotoSquareRounded />
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>

          {previews.length > 0 && (
            <>
              <div>
                <Slider>
                  {previews.map((src, idx) => (
                    <div className="relative" key={idx}>
                      <img src={src} style={{ width: "100%" }} />
                      <RiDeleteBinLine className="custom-bin-icon" />
                    </div>
                  ))}
                </Slider>
              </div>
              <Button
                type="primary"
                onClick={() => setStep("compose")}
                style={{ marginTop: 16 }}
              >
                Tiếp tục
              </Button>
            </>
          )}
        </>
      ) : (
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <Slider>
              {previews.map((src, i) => (
                <>
                  <img key={i} src={src} style={{ width: "100%" }} />
                  <div>hhhhhh</div>
                </>
              ))}
            </Slider>
          </div>
          <div style={{ flex: 1 }}>
            <Input.TextArea
              placeholder="Bạn đang nghĩ gì?"
              rows={6}
              value={content}
              onChange={handleContentChange}
            />
            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {/* <Button danger onClick={handleClose}>
                Hủy
              </Button> */}
              <Button type="primary" onClick={handlePost}>
                Đăng bài
              </Button>
            </div>
          </div>
        </div>
      )}
    </CreateStyled>
  );
};

export default CreatePost;

const CreateStyled = styled.div`
  .custom-bin-icon {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 666;
  }
`;
