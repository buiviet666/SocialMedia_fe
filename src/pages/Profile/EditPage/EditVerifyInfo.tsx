import { Modal, Button, Input, Form, Alert } from 'antd';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import userApi from '../../../apis/api/userApi';
import { Controller, useForm } from 'react-hook-form';
import authApi from '../../../apis/api/authApi';
import { ValidateMessage } from '../../../utils/validateMessage';

const EditVerifyInfo = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [dataChoose, setDataChoose] = useState('');
  const [emailStatus, setEmailStatus] = useState<'verified' | 'noactive' | 'newemail'>('noactive');
  const [cooldown, setCooldown] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleClickEdit = (data: 'password' | 'email') => {
    setDataChoose(data);
    setShowPopup(true);
  };

  const handleSaveEmail = () => {
    if (email.trim()) {
      setEmailStatus('newemail');
    }
  };

  const handleClose = () => {
    setShowPopup(false);
    setEmail('');
    setPassword('');
    setEmailStatus('noactive');
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
        onCancel={handleClose}
        footer={null}
        centered
        title="Đổi mật khẩu"
      >
        <ChangePassword onClose={handleClose} />
      </Modal>

      <Modal
        open={dataChoose === 'email' && showPopup}
        onCancel={handleClose}
        footer={null}
        centered
        title="Xác thực/Thay đổi Email"
      >
        <ChangeEmail
          status={emailStatus}
          cooldown={cooldown}
          setCooldown={setCooldown}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          setEmailStatus={setEmailStatus}
        />
      </Modal>
    </StyleEditVerifyInfo>
  );
};

const ChangePassword = ({ onClose }: { onClose: () => void }) => {
  const { control, handleSubmit, reset } = useForm<any>({
      mode: "onBlur",
      reValidateMode: "onChange",
      delayError: 200,
      defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "false"
      },
    });

  const onSubmit = async (data: any) => {
    const { currentPassword, newPassword, confirmPassword } = data;

    console.log("data", data); // kiểm tra lại tại đây

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }

    try {
      await userApi.changePassword({
        currentPassword,
        newPassword,
      });

      toast.success("Đổi mật khẩu thành công");
      reset();
      onClose();
    } catch (error) {
      toast.error("Đổi mật khẩu thất bại");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="currentPassword"
        rules={{
          required: "password is required",
        }}
        render={({ field, fieldState }) => (
          <FormItem>
            <label className="required" htmlFor="currentPassword">
              Current password
            </label>
            <Input.Password
              {...field}
              id="currentPassword"
              className="custom_input_username"
              maxLength={255}
              status={fieldState.invalid ? "error" : ""}
              placeholder="Enter Current Password"
            />
              <ValidateMessage message={fieldState.error?.message}/>
          </FormItem>
        )}
      />

      <Controller
        control={control}
        name="newPassword"
        rules={{
          required: "newPassword is required",
        }}
        render={({ field, fieldState }) => (
          <FormItem>
            <label className="required" htmlFor="newPassword">
              Current password
            </label>
            <Input.Password
              {...field}
              id="newPassword"
              className="custom_input_username"
              maxLength={255}
              status={fieldState.invalid ? "error" : ""}
              placeholder="Enter New Password"
            />
              <ValidateMessage message={fieldState.error?.message}/>
          </FormItem>
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: "ConfirmPassword is required",
        }}
        render={({ field, fieldState }) => (
          <FormItem>
            <label className="required" htmlFor="confirmPassword">
              Current password
            </label>
            <Input.Password
              {...field}
              id="confirmPassword"
              className="custom_input_username"
              maxLength={255}
              status={fieldState.invalid ? "error" : ""}
              placeholder="Enter Confirm Password"
            />
              <ValidateMessage message={fieldState.error?.message}/>
          </FormItem>
        )}
      />

      <Button htmlType="submit" type="primary">
        Lưu
      </Button>
    </form>
  );
};

const ChangeEmail = ({
  status,
  cooldown,
  setCooldown,
  email,
  setEmail,
  password,
  setPassword,
  setEmailStatus,
}: {
  status: 'verified' | 'noactive' | 'newemail';
  cooldown: number;
  setCooldown: (val: number) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  setEmailStatus: (val: 'verified' | 'noactive' | 'newemail') => void;
}) => {
  const [message, setMessage] = useState('');

  const handleSendVerification = async () => {
    try {
      if (status === "newemail") {
        if (!password) {
          setMessage("Vui lòng nhập mật khẩu để xác thực");
          return;
        }
        await userApi.changeEmail({ password, newEmail: email });
      } else {
        await authApi.sendVerifycationEmailApi(); // bạn bảo giữ nguyên tên này
      }

      setMessage("Đã gửi mã xác nhận tới email của bạn.");
      setCooldown(30);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) clearInterval(interval);
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setMessage("Gửi thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      {(status === 'noactive' || status === 'verified') && (
        <Form layout="vertical">
          <Form.Item label="Email hiện tại">
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
          <Form.Item label="Email mới">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>
          <Form.Item label="Mật khẩu hiện tại">
            <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Item>
          <Button
            type="primary"
            onClick={handleSendVerification}
            disabled={cooldown > 0 || !email || !password}
          >
            {cooldown > 0 ? `Chờ ${cooldown}s` : 'Xác thực Email'}
          </Button>
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

const FormItem = styled.div`
  margin-bottom: 16px;

  .ant-input {
    margin-top: 8px;
    min-height: 48px;
    padding: 14px 16px;
  }

  label {
    font-size: 14px;
    padding-left: 16px;
  }

  /* .custom_input_username {
    height: 50px;
  } */

  /* .custom_input_password input {
    margin: 0;
    min-height: 40px;
  } */
`;

export default EditVerifyInfo;