import { Modal, Button, Input, Form, Alert } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';

const EditVerifyInfo = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [dataChoose, setDataChoose] = useState('');
  const [emailStatus, setEmailStatus] = useState<'verified' | 'noactive' | 'newemail'>('noactive');
  const [cooldown, setCooldown] = useState(0);
  const [email, setEmail] = useState('');

  const handleClickEdit = (data: 'password' | 'email') => {
    setDataChoose(data);
    setShowPopup(true);
  };

  const handleSaveEmail = () => {
    if (email.trim()) {
      setEmailStatus('newemail');
    }
  };

  return (
    <StyleEditVerifyInfo>
      <h2>Xác thực thông tin</h2>

      <Button type="primary" onClick={() => handleClickEdit('password')}>
        Đổi mật khẩu
      </Button>

      <Button type="default" onClick={() => handleClickEdit('email')}>
        Quản lý Email
      </Button>

      <Modal
        open={dataChoose === 'password' && showPopup}
        onOk={() => console.log('Submit Password')}
        onCancel={() => setShowPopup(false)}
        okText="Lưu"
        cancelText="Hủy"
        centered
        title="Đổi mật khẩu"
      >
        <ChangePassword />
      </Modal>

      <Modal
        open={dataChoose === 'email' && showPopup}
        onOk={handleSaveEmail}
        onCancel={() => setShowPopup(false)}
        okText="Lưu"
        cancelText="Hủy"
        centered
        title="Xác thực/Thay đổi Email"
      >
        <ChangeEmail
          status={emailStatus}
          cooldown={cooldown}
          setCooldown={setCooldown}
          email={email}
          setEmail={setEmail}
          setEmailStatus={setEmailStatus}
        />
      </Modal>
    </StyleEditVerifyInfo>
  );
};

const ChangePassword = () => {
  return (
    <Form layout="vertical">
      <Form.Item label="Mật khẩu hiện tại" name="oldPassword">
        <Input.Password />
      </Form.Item>
      <Form.Item label="Mật khẩu mới" name="newPassword">
        <Input.Password />
      </Form.Item>
      <Form.Item label="Xác nhận mật khẩu mới" name="confirmPassword">
        <Input.Password />
      </Form.Item>
    </Form>
  );
};

const ChangeEmail = ({
  status,
  cooldown,
  setCooldown,
  email,
  setEmail,
  setEmailStatus
}: {
  status: 'verified' | 'noactive' | 'newemail';
  cooldown: number;
  setCooldown: (val: number) => void;
  email: string;
  setEmail: (val: string) => void;
  setEmailStatus: (val: 'verified' | 'noactive' | 'newemail') => void;
}) => {
  const [message, setMessage] = useState('');

  const handleSendVerification = () => {
    setMessage('Đã gửi mã xác nhận tới email của bạn.');
    setCooldown(30);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) clearInterval(interval);
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div>
      {(status === 'noactive' || status === 'verified') && (
        <Form layout="vertical">
          <Form.Item label="Email hiện tại" name="currentEmail">
            <Input value="user@email.com" disabled />
          </Form.Item>
          <Button type="default" onClick={() => setEmailStatus('newemail')}>
            Thay đổi email
          </Button>
          {status === 'noactive' && (
            <div style={{ marginTop: 16 }}>
              <Alert
                message="Email của bạn chưa được xác thực."
                type="warning"
                showIcon
                style={{ marginBottom: 12 }}
              />
              <Button
                type="primary"
                onClick={handleSendVerification}
                disabled={cooldown > 0}
              >
                {cooldown > 0 ? `Gửi lại sau ${cooldown}s` : 'Gửi mã xác nhận'}
              </Button>
            </div>
          )}
        </Form>
      )}

      {status === 'newemail' && (
        <Form layout="vertical">
          <Form.Item label="Email mới" name="newEmail">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>
          {email && (
            <Button type="primary" onClick={handleSendVerification} disabled={cooldown > 0}>
              {cooldown > 0 ? `Chờ ${cooldown}s` : 'Xác thực Email'}
            </Button>
          )}
          <p style={{ marginTop: 10 }}>{message}</p>
        </Form>
      )}
    </div>
  );
};

const StyleEditVerifyInfo = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  h2 {
    margin-bottom: 16px;
  }

  button {
    max-width: 220px;
  }
`;

export default EditVerifyInfo;