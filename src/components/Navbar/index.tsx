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
import { Drawer, Dropdown, MenuProps, Modal } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Search from "../Search";
import Notify from "../Notify";
import CreatePost from "../Post/CreatePost";
import Profile from "../../pages/Profile";
import { useDispatch } from "react-redux";
import authApi from "../../apis/api/authApi";
import { logout as logoutAction } from "../../store/authSlice";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [renderComponent, setRenderComponent] = useState<{
    componentPage?: any;
    title?: string;
  }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [childrenComponent, setChildrenComponent] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      console.log(refreshToken);

      await authApi.logoutApi({ refreshToken });
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      dispatch(logoutAction());
      navigate("/login");
    }
  };

  const showDrawer = (dataPath: any) => {
    if (dataPath.path) {
      navigate(dataPath.path);
      return;
    }

    if (dataPath.popup) {
      setIsModalOpen(true);
      setChildrenComponent(dataPath?.component);
      return;
    }

    setOpen(true);
    setRenderComponent({
      componentPage: dataPath?.component,
      title: dataPath?.title,
    });
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
      component: <CreatePost />,
      title: "Tạo bài viết mới",
    },
    { icon: <UserOutlined />, path: "/profile", component: <Profile /> },
  ];

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
      <Modal
        title="Tạo bài viết mới"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        {childrenComponent}
      </Modal>
      {/* <ModalPopup isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Đây là nội dung của Modal</h2>
        <p>Bạn có thể đặt bất kỳ nội dung nào ở đây.</p>
        <button onClick={() => setIsModalOpen(false)}>Đóng</button>
      </ModalPopup> */}
    </StyleMainNavbarPC>
  );
};

export default Navbar;

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
