import { MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import EditInfo from './EditInfo';
import EditVerifyInfo from './EditVerifyInfo';
import AdvancedAccountSetting from './AdvancedAccountSetting';

const EditPage = () => {
  const [current, setCurrent] = useState('info');
  type MenuItem = Required<MenuProps>['items'][number];

  const items: MenuItem[] = [
    {
      label: 'Chỉnh sửa thông tin người dùng',
      key: 'info',
      icon: <MailOutlined />,
    },
    {
      label: 'Đổi thông tin tài khoản',
      key: 'password',
      icon: <MailOutlined />,
    },
    {
      label: 'Cài đặt nâng cao tài khoản',
      key: 'advanced',
      icon: <SettingOutlined />,
    },
  ];

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  return (
    <StyleEditPage>
      <div className="edit-container">
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} className="edit-menu" />
        <div className="edit-content">
          {current === 'info' && <EditInfo />}
          {current === 'password' && <EditVerifyInfo />}
          {current === 'advanced' && <AdvancedAccountSetting />}
        </div>
      </div>
    </StyleEditPage>
  );
};

const StyleEditPage = styled.div`
  .edit-container {
    max-width: 700px;
    margin: 0 auto;
    padding: 32px 16px;
  }

  .edit-menu {
    margin-bottom: 24px;
  }

  .edit-content {
    background: #fff;
    padding: 24px;
    border: 1px solid #eaeaea;
    border-radius: 8px;
  }
`;

export default EditPage;
