import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Collapse, CollapseProps, Divider, Input, message, Modal, Radio, Upload } from "antd";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { TbPhotoSquareRounded } from "react-icons/tb";
import { RiDeleteBinLine } from "react-icons/ri";
import styled from "styled-components";
import { settingsCreatePost } from "../../../utils/settingSlider";
import { MdOutlineAddAPhoto } from "react-icons/md";
import TextArea from "antd/es/input/TextArea";
import { Control, Controller } from "react-hook-form";

type Props = {
  setHasData?: (hasData: boolean) => void;
  step: "select" | "compose";
  setStep: (value: "select" | "compose") => void;
  setImages: (images: File[]) => void;
  images: File[];
  control: Control<any>;
};

const CreatePost = ({
  setHasData,
  step,
  setStep,
  setImages,
  images,
  control
}: Props) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);

    setImages(newImages);

    const newPreviews = newImages.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    if (newImages.length === 0 && content.trim() === "") {
      setHasData?.(false);
    }
  };

  const handleAddImages = (fileList: File[]) => {
    const newImages = [...images, ...fileList].slice(0, 5); // Giới hạn 5 ảnh
    setImages(newImages);

    const newPreviews = newImages.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    if (newImages.length > 0) {
      setHasData?.(true);
    }
  };

  const resetData = () => {
    setStep("select");
    setImages([]);
    setPreviews([]);
    setContent("");
  };

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const text = `
    A dog is a type of domesticated animal.
    Known for its loyalty and faithfulness,
    it can be found as a welcome guest in many households across the world.
  `;

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Option Post',
      children: <div>
        <Controller
          name="title"
          control={control}
          defaultValue=""
          rules={{ maxLength: { value: 1500, message: 'Content must be less than 1500 characters' } }}
          render={({ field, fieldState }) => (
            <>
              <label htmlFor='title'>Title</label>
              <Input
                {...field}
                maxLength={1500}
                placeholder="Input your title"
                style={{ resize: 'none', border: 'none' }}
                className="mb-2 custom-input-content"
              />
              {fieldState.error && (
                <p style={{ color: 'red', marginTop: 4 }}>{fieldState.error.message}</p>
              )}
            </>
          )}/>
          <Controller
          name="location"
          control={control}
          defaultValue=""
          rules={{ maxLength: { value: 1500, message: 'Content must be less than 1500 characters' } }}
          render={({ field, fieldState }) => (
            <>
              <label htmlFor='location'>Location</label>
              <Input
                {...field}
                maxLength={1500}
                placeholder="Input your location"
                style={{ resize: 'none', border: 'none' }}
                className="mb-2 custom-input-content"
              />
              {fieldState.error && (
                <p style={{ color: 'red', marginTop: 4 }}>{fieldState.error.message}</p>
              )}
            </>
          )}/>
      </div>,
    },
    {
      key: '2',
      label: 'Privacy Setting',
      children: <div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center">
            <Avatar size="small" icon={<UserOutlined />} />
            <div className="ml-2">
              <div className="SideBarRight_title-info">name - time</div>
              <div className="SideBarRight_title-location">location</div>
            </div>
          </div>
          <div>
            <Radio />
          </div>
        </div>
      </div>,
    },
    {
      key: '3',
      label: 'Advantage Setting',
      children: <p>{text}</p>,
    }
  ];

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  console.log("images", images);
  console.log("previews", previews);

  return (
    <CreateStyled>
      {step === "select" ? (
        <>
          {previews.length === 0 && (
            <Upload
              accept="image/*"
              listType="picture"
              multiple
              beforeUpload={() => false}
              onChange={handleImageChange}
            >
              <div className="icon-custom-images">
              <TbPhotoSquareRounded />
              </div>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          )}

          {previews.length > 0 && (
            <>
              <div className="relative">
                <Slider {...settingsCreatePost}>
                  {previews.map((src, idx) => (
                    <div className="relative create-main-slide" key={idx}>
                      <img src={src} className="create-img-slide" />
                      <div className="absolute top-2.5 right-2.5 custom-btn-photo-delete">
                        <RiDeleteBinLine
                          onClick={() => handleRemoveImage(idx)}
                        />
                      </div>
                    </div>
                  ))}
                </Slider>
                <div className="absolute bottom-2.5 right-2.5 custom_btn-photo-add">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      handleAddImages(files as File[]);
                      e.target.value = "";
                    }}
                  />
                  <MdOutlineAddAPhoto
                    onClick={() => fileInputRef.current?.click()}
                  />
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="flex flex-row">
          <div className="flex-7" style={{ maxWidth: 700}}>
            <Slider {...settingsCreatePost}>
              {previews.map((src, i) => (
                <div className="custom-slide-post">
                  <img key={i} src={src} style={{ width: "100%" }} />
                </div>
              ))}
            </Slider>
          </div>
          <div className="flex-3 p-4">
            <div className="flex flex-row items-center mb-2">
              <Avatar size="default" icon={<UserOutlined />} />
              <span className="ml-1.5 font-semibold">name</span>
            </div>

            <Controller
              name="content"
              control={control}
              defaultValue=""
              rules={{ maxLength: { value: 1500, message: 'Content must be less than 1500 characters' } }}
              render={({ field, fieldState }) => (
                <>
                  <TextArea
                    {...field}
                    showCount
                    maxLength={1500}
                    placeholder="What do you think?"
                    style={{ height: 210, resize: 'none', border: 'none' }}
                    className="mb-2 custom-input-content"
                  />
                  {fieldState.error && (
                    <p style={{ color: 'red', marginTop: 4 }}>{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
            
            <Divider />

            <Collapse
              className="border-none custom-collapse"
              style={{ backgroundColor: "unset"}} 
              expandIconPosition={'end'} 
              items={items} 
              defaultActiveKey={['1']} 
              onChange={onChange} />
            
            {/* <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button type="primary" onClick={handlePost}>
                Đăng bài
              </Button>
            </div> */}
          </div>
        </div>
      )}
    </CreateStyled>
  );
};

export default CreatePost;

const CreateStyled = styled.div`
  .custom_btn-photo-add,
  .custom-btn-photo-delete {
    width: 40px;
    height: 40px;
    background: #1a1a1acc;
    border-radius: 50%;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .custom_btn-photo-add svg,
  .custom-btn-photo-delete svg {
    width: 20px;
    height: 20px;
    color: #ffffff;
    cursor: pointer;
  }

  /* .custom-btn-photo-delete {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  } */

  .create-main-slide {
    /* width: 900px;
    height: 900px; */
    aspect-ratio: 1 / 1;
    overflow: hidden;
    display: flex !important;
    justify-content: center;
    align-items: center;
    max-width: 800px;
    max-height: 800px;
  }

  .custom-slide-post {
    width: 800px;
    height: 700px;
    max-width: 700px;
    overflow: hidden;
    position: relative;
    display: flex !important;
  }

  .custom-slide-post img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    display: block;
  }

  .create-img-slide {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .slick-dots {
    bottom: 10px;
  }

  .slick-dots li.slick-active button:before,
  .slick-dots li button:before {
    color: #ffffff;
  }

  .custom-collapse {
    border: unset;
    max-height: 360px;
    overflow: auto;
    scrollbar-width: none;
  }

  .custom-collapse .ant-collapse-content,
  .custom-collapse .ant-collapse-item {
    border: unset;
  }

  .custom-collapse .ant-collapse-item {
    margin-bottom: 16px;
  }

  .custom-collapse .ant-collapse-content-box {
    padding: 0 16px;
  }

  .custom-collapse .ant-collapse-content-active .ant-collapse-header .ant-collapse-header-text {
    font-weight: 600;
  }

  .custom-input-content:focus-within {
    box-shadow: unset;
  }

  .custom-input-content {
    padding-top: 10px;

    & .ant-input {
      padding: 0;
    }
  }
`;
