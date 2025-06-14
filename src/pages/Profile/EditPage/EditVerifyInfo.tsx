/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Button, Input, Form, Alert } from 'antd';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
import userApi from '../../../apis/api/userApi';
import authApi from '../../../apis/api/authApi';
import { ValidateMessage } from '../../../utils/validateMessage';

const EditVerifyInfo = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [dataChoose, setDataChoose] = useState<'password' | 'email' | ''>('');
  const [emailStatus, setEmailStatus] = useState<'verified' | 'noactive' | 'newemail'>('noactive');
  const [cooldown, setCooldown] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [statusAcc, setStatusAcc] = useState<'ACTIVE' | 'NOACTIVE'>('NOACTIVE');

  const handleClickEdit = async (type: 'password' | 'email') => {
    setDataChoose(type);
    if (type === 'email') {
      try {
        const res = await userApi.getCurrentUser();
        setCurrentEmail(res.data?.emailAddress || '');
        setStatusAcc(res.data?.statusAcc || 'NOACTIVE');
        setEmailStatus(res.data?.statusAcc === 'ACTIVE' ? 'verified' : 'noactive');
      } catch (err) {
        toast.error('Unable to load email information');
        console.log(err);
      }
    }
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
    setEmail('');
    setPassword('');
    setEmailStatus(statusAcc === 'ACTIVE' ? 'verified' : 'noactive');
  };

  return (
    <StyleEditVerifyInfo>
      <h2>Authentication Management</h2>

      <Button type="primary" onClick={() => handleClickEdit('password')}>
        Change password
      </Button>

      <Button type="default" onClick={() => handleClickEdit('email')}>
        Email Management
      </Button>

      <Modal
        open={dataChoose === 'password' && showPopup}
        onCancel={handleClose}
        footer={null}
        centered
        title="Change password"
      >
        <ChangePassword onClose={handleClose} />
      </Modal>

      <Modal
        open={dataChoose === 'email' && showPopup}
        onCancel={handleClose}
        footer={null}
        centered
        title="Verify / Change Email"
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
          currentEmail={currentEmail}
        />
      </Modal>
    </StyleEditVerifyInfo>
  );
};

const ChangePassword = ({ onClose }: { onClose: () => void }) => {
  const { control, handleSubmit, reset, getValues } = useForm<any>({
    mode: 'onBlur',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: any) => {
    const { currentPassword, newPassword } = data;
    try {
      await userApi.changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully');
      reset();
      onClose();
    } catch (error) {
      toast.error('Password change failed');
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {['currentPassword', 'newPassword', 'confirmPassword'].map((fieldName) => (
        <Controller
          key={fieldName}
          control={control}
          name={fieldName}
          rules={{
            required: `${fieldName} is required`,
            ...(fieldName === 'confirmPassword' && {
              validate: (val) =>
                val === getValues('newPassword') || 'Passwords do not match'
            })
          }}
          render={({ field, fieldState }) => (
            <FormItem>
              <label className="required" htmlFor={fieldName}>
                {fieldName === 'currentPassword'
                  ? 'Current Password'
                  : fieldName === 'newPassword'
                  ? 'New Password'
                  : 'Confirm Password'}
              </label>
              <Input.Password
                {...field}
                id={fieldName}
                maxLength={255}
                status={fieldState.invalid ? 'error' : ''}
                placeholder={`Input ${fieldName}`}
              />
              <ValidateMessage message={fieldState.error?.message} />
            </FormItem>
          )}
        />
      ))}

      <div className='flex justify-self-end'>
        <Button htmlType="submit" type="primary">
          Submit
        </Button>
      </div>
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
  currentEmail
}: {
  status: 'verified' | 'noactive' | 'newemail';
  cooldown: number;
  setCooldown: (val: number) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  setEmailStatus: (val: 'verified' | 'noactive' | 'newemail') => void;
  currentEmail: string;
}) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendVerification = async () => {
    try {
      if (status === 'newemail') {
        await userApi.changeEmail({ password, newEmail: email });
        toast.success("Change email success!");
        setEmail('');
        setPassword('');
        setEmailStatus('noactive');
      } else {
        await authApi.sendVerifycationEmailApi();
      }
      setMessage('Verification email sent. Please check your inbox.');
      setCooldown(30);
    } catch (err) {
      setMessage('Send failed. Please try again.');
      console.log(err);
    }
  };

  return (
    <Form layout="vertical">
      {(status === 'noactive' || status === 'verified') && (
        <>
          <Form.Item label="Current email" className='!mb-3'>
            <Input value={currentEmail} disabled />
          </Form.Item>
          {status === 'noactive' && (
            <Alert
              message="Your email is not verified."
              type="warning"
              showIcon
              style={{ marginBottom: 12 }}
            />
          )}
          <div className='flex justify-self-end gap-1.5'>
            <Button type="default" onClick={() => setEmailStatus('newemail')}>
              Change email
            </Button>
            {status === 'noactive' && (
              <Button
                type="primary"
                onClick={handleSendVerification}
                disabled={cooldown > 0}
              >
                {cooldown > 0 ? `Resend after ${cooldown}s` : 'Send confirmation code'}
              </Button>
            )}
          </div>
        </>
      )}

      {status === 'newemail' && (
        <>
          <Form.Item
            label="New Email"
            validateStatus={email && !/\S+@\S+\.\S+/.test(email) ? 'error' : ''}
            help={
              email && !/\S+@\S+\.\S+/.test(email) ? 'Invalid email' : ''
            }
          >
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>
          <Form.Item label="Current Password">
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <div className='flex justify-self-end gap-1.5'>
            <Button
              type='default'
              onClick={() => setEmailStatus('noactive')}>
              Back
            </Button>
            <Button
              type="primary"
              onClick={handleSendVerification}
              disabled={cooldown > 0 || !email || !password}
            >
              {cooldown > 0 ? `Wait for ${cooldown}s` : 'Verify new Email'}
            </Button>
          </div>
        </>
      )}

      {message && (
        <Alert
          message={message}
          type="info"
          showIcon
          style={{ marginTop: 12 }}
        />
      )}
    </Form>
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

  label {
    font-size: 14px;
    padding-left: 4px;
  }

  .ant-input {
    margin-top: 8px;
    min-height: 44px;
  }
`;

export default EditVerifyInfo;
