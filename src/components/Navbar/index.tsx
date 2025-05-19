/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlignLeftOutlined,
  BellOutlined,
  CrownOutlined,
  HomeOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
  StarOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Drawer, Dropdown, MenuProps, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Search from "../Search";
import Notify from "../Notify";
import CreatePost from "../Post/CreatePost";
import Profile from "../../pages/Profile";
import authApi from "../../apis/api/authApi";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { GrFormPreviousLink } from "react-icons/gr";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [renderComponent, setRenderComponent] = useState<{
    componentPage?: any;
    title?: string;
  }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [childrenComponent, setChildrenComponent] = useState(null);
  const [hasCreatePostData, setHasCreatePostData] = useState(false);
  const [showCreatePostConfirm, setShowCreatePostConfirm] = useState(false);
  const [step, setStep] = useState<"select" | "compose">("select");
  const [images, setImages] = useState<File[]>([]);

  const navigate = useNavigate();

  const { control, handleSubmit } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    delayError: 200,
    defaultValues: {
      content: '',
    },
  });

  const testServer = async () => {
    try {
      const res: any = await authApi.testApi();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogout = async () => {
    const refreshToken =
      localStorage.getItem(REFRESH_TOKEN) || sessionStorage.getItem(REFRESH_TOKEN);

    if (!refreshToken) {
      toast.error("Token not found, already logged out?");
      return;
    }

    try {
      if (refreshToken) {
        await authApi.logoutApi({ refreshToken });
        toast.success("Logout successful!");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Logout error");
    } finally {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      sessionStorage.removeItem(ACCESS_TOKEN);
      sessionStorage.removeItem(REFRESH_TOKEN);
      
      navigate("/auth/login");
    }
  };

  const showDrawer = (dataPath: any) => {
    if (dataPath.path) {
      navigate(dataPath.path);
      return;
    }

    if (dataPath.popup) {
      setIsModalOpen(true);
      setChildrenComponent(dataPath.component);
      return;
    }

    setOpen(true);
    setRenderComponent({
      componentPage: dataPath?.component,
      title: dataPath?.title,
    });
  };

  const resetForm = () => {
    setShowCreatePostConfirm(false);
    setIsModalOpen(false);
    setHasCreatePostData(false);
    setStep("select");
    setImages([]);
  };

  const _onSubmit = (val: any) => {
    // TODO: gọi API đăng bài
    // message.success("Đăng bài thành công!");
    if (!val.content.trim() && images.length === 0) {
      message.warning("Vui lòng nhập nội dung hoặc chọn ít nhất 1 ảnh");
      return;
    }

    const dataToSubmit: any = {
      content: val.content,
      privacy: 'PUBLIC', // hoặc field bạn muốn
      media: images, // là File[]
    };

    console.log("previews", dataToSubmit);
    
    // resetForm();
    // setHasCreatePostData?.(false);
    // setIsModalOpen(false);
    // setHasCreatePostData(false);
  };

  const items: MenuProps["items"] = [
    {
      icon: <CrownOutlined />,
      label: "Đã lưu",
      key: "1",
    },
    {
      icon: <SettingOutlined />,
      label: "Cài đặt",
      key: "2",
    },
    {
      icon: <SunOutlined />,
      label: "Chuyển chế độ",
      key: "3",
    },
    {
      type: "divider",
    },
    {
      label: "chuyển tài khoản",
      key: "4",
    },
    {
      label: "Đăng xuất",
      key: "5",
    },
  ];

  const handleClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "1":
        console.log("Đã lưu");
        break;
      case "2":
        console.log("Cài đặt");
        break;
      case "3":
        console.log("Chuyển chế độ");
        break;
      case "4":
        console.log("Chuyển tài khoản");
        break;
      case "5":
        handleLogout();
        break;
      default:
        break;
    }
  };

  const listItem = [
    { icon: <HomeOutlined />, path: "/", component: "" },
    {
      icon: <SearchOutlined />,
      path: "",
      component: <Search />,
      title: "Tìm kiếm",
    },
    {
      icon: <BellOutlined />,
      path: "",
      component: <Notify />,
      title: "Thông báo",
    },
    {
      icon: <PlusOutlined />,
      popup: true,
      component: () => (
        <CreatePost
          key={Date.now()}
          setHasData={setHasCreatePostData}
          step={step}
          setStep={setStep}
          images={images}
          setImages={setImages}
          control={control}
        />
      ),
      title: "Tạo bài viết mới",
    },
    { icon: <UserOutlined />, path: "/profile", component: <Profile /> },
  ];

  useEffect(() => {
    testServer();
  }, []);

  return (
    <StyleMainNavbarPC>
      <div onClick={() => navigate("/")}>
        <StarOutlined className="navbar_logo" />
      </div>
      <div className="navbar_items">
        <ul className="navbar_list_item">
          {listItem.map((items, idx) => (
            <>
              <li key={idx} onClick={() => showDrawer(items)}>
                {items.icon}
              </li>
            </>
          ))}
        </ul>
      </div>
      <Dropdown
        menu={{ items, onClick: handleClick }}
        trigger={["click"]}
        placement="topLeft"
        arrow
      >
        <div className="navbar_setting">
          <AlignLeftOutlined />
        </div>
      </Dropdown>
      <Drawer
        title={renderComponent.title}
        placement={"left"}
        closable={false}
        onClose={() => setOpen(false)}
        open={open}
        key={"left"}
      >
        {renderComponent.componentPage}
      </Drawer>
      <ModalStyled
        className={step === "compose" ? "modal-fullwidth" : ""}
        // width={'70%'}
        centered
        title={
          <div
            className={`${
              step === "compose" ? "justify-between" : "justify-end"
            } custom-header-create flex flex-row`}
          >
            {step === "compose" && (
              <>
                <GrFormPreviousLink onClick={() => setStep("select")} />
                <div className="btn_post" onClick={handleSubmit(_onSubmit)}>Post</div>
              </>
            )}
            <p>Create new post</p>
            {images.length > 0 && step === "select" && (
              <div className="btn_prev_post" onClick={() => setStep("compose")}>
                Next
              </div>
            )}
          </div>
        }
        footer={null}
        open={isModalOpen}
        closeIcon={false}
        // onOk={() => {
        //   setShowCreatePostConfirm(false);
        //   setIsModalOpen(false);
        //   setHasCreatePostData(false);
        //   setChildrenComponent(null);
        // }}
        onCancel={() => {
          if (hasCreatePostData) {
            setShowCreatePostConfirm(true);
          } else {
            setIsModalOpen(false);
            setShowCreatePostConfirm(false);
            setStep("select");
            setImages([]);
          }
        }}
      >
        {childrenComponent &&
          React.cloneElement(childrenComponent, {
            setHasData: setHasCreatePostData,
            step,
            setStep,
            setImages,
            images,
            control
          })}
      </ModalStyled>
      <Modal
        open={showCreatePostConfirm}
        onOk={resetForm}
        onCancel={() => setShowCreatePostConfirm(false)}
        title="Discard"
        okText="Ok"
        cancelText="Cancel"
      >
        <p>If you leave, you will lose your edits?</p>
      </Modal>
    </StyleMainNavbarPC>
  );
};

export default Navbar;

const ModalStyled = styled(Modal)`
  min-width: 800px;
  max-width: 80%;

  &.modal-fullwidth {
    width: 55% !important;
  }

  .ant-modal-content {
    position: unset;
    padding: 0;
    overflow: hidden;
  }

  .ant-modal-header {
    margin: 0;
  }

  .custom-header-create {
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #dbdbdb;
    padding: 10px;
    /* justify-content: end; */
    /* cursor: pointer; */
    position: relative;
    height: 45px;
    align-items: center;
  }

  .ant-modal-body {
    min-height: 400px;
    position: relative;
  }

  .ant-upload {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
  }

  .ant-upload .icon-custom-images {
    font-size: 100px;
    justify-items: center;
  }

  .custom-header-create svg {
    font-size: 25px;
    cursor: pointer;
  }

  .custom-header-create .btn_prev_post {
    cursor: pointer;
  }

  .custom-header-create .btn_post {
  }

  .custom-header-create p {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    padding: 10px 0;
  }
`;

const StyleMainNavbarPC = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 76px;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  background-color: #fafafa;
  border-right: 1px solid rgb(219, 219, 219);

  .navbar_logo {
    font-size: 34px;
    padding: 16px 0;
    cursor: pointer;
  }

  .navbar_list_item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
  }

  .navbar_list_item li {
    display: flex;
    width: 60px;
    height: 60px;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    opacity: 0.4;
    transition-duration: 0.2s;
    cursor: pointer;
  }

  .navbar_list_item li:hover,
  .navbar_setting:hover {
    opacity: 1;
    background-color: #82828261;
    border-radius: 12px;
  }

  .navbar_setting {
    width: 54px;
    height: 54px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 21px;
    cursor: pointer;
    opacity: 0.4;
    margin-bottom: 24px;
  }

  .ant-popover {
    left: 85px !important;
  }
`;
