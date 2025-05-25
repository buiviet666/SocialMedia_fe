/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Collapse, CollapseProps, Divider, Input, Modal, Radio, Upload } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import Slider from "react-slick";
import { RiDeleteBinLine } from "react-icons/ri";
import styled from "styled-components";
import { settingsCreatePost } from "../../../utils/settingSlider";
import { MdOutlineAddAPhoto } from "react-icons/md";
import TextArea from "antd/es/input/TextArea";
import { Control, Controller, UseFormSetValue, useWatch } from "react-hook-form";
import logoPhoto from '../../../assets/photo.svg';
import { ValidateMessage } from "../../../utils/validateMessage";
import { FaGlobeAsia, FaLock, FaUser, FaUserFriends } from "react-icons/fa";
import { LiaUserFriendsSolid } from "react-icons/lia";

type Props = {
  setHasData?: (hasData: boolean) => void;
  step: "select" | "compose";
  setImages: (images: File[]) => void;
  images: File[];
  control: Control<any>;
  setValue: UseFormSetValue<any>;
};

const CreatePost = ({
  setHasData,
  step,
  setImages,
  images,
  control,
  setValue
}: Props) => {
  const [showPopup, setShowPopup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const content = useWatch({ control, name: "content" });
  const valuePrivacy = useWatch({ control, name: "privacy" });

  const previews = useMemo(() => {
    return images.map((file) => URL.createObjectURL(file));
  }, [images]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const optionPrivacys = [
    {
      key: 0,
      name: 'PUBLIC',
      openPopup: false,
      description: 'Anyone can see your posts',
      icon: <FaGlobeAsia />
    },
    {
      key: 1,
      name: 'PRIVATE',
      openPopup: false,
      description: 'Only you can see that post',
      icon: <FaLock />
    },
    {
      key: 2,
      name: 'FRIEND',
      openPopup: false,
      description: 'People who follow you can see',
      icon: <FaUserFriends />
    },
    {
      key: 3,
      name: 'FRIENDONLY',
      openPopup: true,
      description: 'Only people you choose can see your posts',
      icon: <FaUser />
    },
    {
      key: 4,
      name: 'EXCEPTFRIEND',
      openPopup: true,
      description: 'People you choose will not be able to see your posts.',
      icon: <LiaUserFriendsSolid />
    }
  ]

  const handleImageChange = (info: any) => {
    // update max 5 image
    const fileList = info.fileList.slice(-5);
    const files = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);
    setImages(files);

    setHasData?.(files.length > 0);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);

    setImages(newImages);
    setHasData?.(newImages.length > 0 || content?.trim() !== "");
  };

  const handleAddImages = (fileList: File[]) => {
    const newImages = [...images, ...fileList].slice(0, 5); // Giới hạn 5 ảnh
    setImages(newImages);
    setHasData?.(newImages.length > 0);
  };

  const handleSelect = (item: any) => {
    setValue("privacy", item.name);
    setHasData?.(true);
    if (item.openPopup) {
      setShowPopup(true);
    }
  };

  const text = `
    A dog is a type of domesticated animal.
    Known for its loyalty and faithfulness,
    it can be found as a welcome guest in many households across the world.
  `;

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Option Post',
      children: 
        <div>
          <Controller
            name="title"
            control={control}
            defaultValue=""
            rules={{ maxLength: { value: 1500, message: 'Content must be less than 1500 characters' } }}
            render={({ field, fieldState }) => (
              <FormItem>
                <label htmlFor='title'><b>Title</b></label>
                <Input
                  {...field}
                  id="title"
                  maxLength={1500}
                  placeholder="Input your title"
                  style={{ resize: 'none', border: 'none' }}
                  className="mb-2 custom-input-content"
                />
                  <ValidateMessage message={fieldState.error?.message}/>
              </FormItem>
            )
          }/>

          <Controller
            name="location"
            control={control}
            defaultValue=""
            rules={{ maxLength: { value: 1500, message: 'Content must be less than 1500 characters' } }}
            render={({ field, fieldState }) => (
              <FormItem>
                <label htmlFor='location'><b>Location</b></label>
                <Input
                  {...field}
                  maxLength={1500}
                  id="location"
                  placeholder="Input your location"
                  style={{ resize: 'none', border: 'none' }}
                  className="mb-2 custom-input-content"
                />
                  <ValidateMessage message={fieldState.error?.message}/>
              </FormItem>
            )
          }/>
        </div>,
    },
    {
      key: '2',
      label: 'Privacy Setting',
      children: 
        <div className="containerPrivacy">
          {optionPrivacys.map((item) => (
            <div 
              className="hover-custom flex flex-row justify-between items-center cursor-pointer p-2.5" 
              key={item.key}
              onClick={() => handleSelect(item)}>
              <div className="flex flex-row items-center">
                <Avatar size="small" icon={item.icon} />
                <div className="ml-2" style={{maxWidth: '200px'}}>
                  <div className="SideBarRight_title-info leading-3.5"><b>{item.name}</b></div>
                  <div className="SideBarRight_title-location leading-3.5">{item.description}</div>
                </div>
              </div>
              <div>
                <Radio checked={valuePrivacy === item.name}/>
              </div>
            </div>
          ))}
        </div>
    },
    {
      key: '3',
      label: 'Advantage Setting',
      children: <p>{text}</p>,
    }
  ];

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
                <img src={logoPhoto} alt="photosIcon" style={{width: '100%'}}/>
              </div>
              <Button icon={<UploadOutlined />} className="customBtnChoosePhoto">Chọn ảnh</Button>
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
          <div className="flex-3 p-4" style={{ maxWidth: 350}}>
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
              // onChange={onChange} 
              />
          </div>
        </div>
      )}
      <Modal
        open={showPopup}
        onOk={() => console.log('hhhhhhhdwj')}
        onCancel={() => setShowPopup(false)}
        okText="Save"
        cancelText="Cancel"
        centered
        >
          <h1>hhhhhhhh</h1>
      </Modal>
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

  /* .custom-collapse .ant-collapse-item {
    margin-bottom: 16px;
  } */

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

  .icon-custom-images {
    width: 150px;
    height: 150px;
  }

  .ant-upload {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    cursor: pointer;
  }

  .customBtnChoosePhoto {
    width: 100%;
    margin-top: 24px;
  }

  .containerPrivacy {
    gap: 6px;
    display: flex;
    flex-direction: column;
  }

  .SideBarRight_title-location {
    line-height: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* max-width: 150px; */
  }

  .hover-custom {
    transition: all 0.6s;
  }

  .hover-custom:hover {
    background-color: #82828261;
    border-radius: 12px;
  }
`;

const FormItem = styled.div`
  margin-bottom: 16px;

  .ant-input {
    /* margin-top: 8px; */
    min-height: 48px;
    padding: 14px 16px;
    padding-top: 0;
  }

  label {
    font-size: 14px;
    padding-left: 16px;
  }

  .custom_input_username {
    height: 50px;
  }

  .custom_input_password input {
    margin: 0;
    min-height: 40px;
  }
`;
