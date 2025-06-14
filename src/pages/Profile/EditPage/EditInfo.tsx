/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Input, Select, DatePicker, Form } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { UploadOutlined } from '@ant-design/icons';
import userApi from '../../../apis/api/userApi';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const EditInfo = () => {
  const { control, handleSubmit, reset } = useForm();
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await userApi.getCurrentUser();
        const user = res.data;

        setAvatar(user.avatar);

        reset({
          nameDisplay: user.nameDisplay || '',
          bio: user.bio || '',
          gender: user.gender || undefined,
          phoneNumber: user.phoneNumber || '',
          dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth) : null,
        });
      } catch (err) {
        toast.error('Unable to load user information');
        console.log(err);
      }
    };

    fetchData();
  }, [reset]);

  const onSubmit = async (data: any) => {
    try {
      const cleanData: any = {
        nameDisplay: data.nameDisplay,
        bio: data.bio,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth?.toISOString() || null,
      };
      await userApi.updateProfile(cleanData);
      toast.success('Information has been updated');
      navigate('/profile');
    } catch (err) {
      toast.error('Update failed');
      console.log(err);
    }
  };

  const handleChangeAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await userApi.updateAvatar(formData);

      if (res?.data?.avatar) {
        setAvatar(res.data.avatar);
      }

      toast.success('Avatar image updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update avatar');
    }
  };

  return (
    <StyleEditInfo>
      <h2>Edit profile</h2>

      <div className="form-item">
        <label>Avatar:</label>
        <div className="avatar-upload">
          {avatar && <img src={avatar} alt="Avatar" className="avatar-preview" />}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleChangeAvatar(file);
            }}
          />
          <Button icon={<UploadOutlined />} onClick={() => fileInputRef.current?.click()}>
            Change profile picture
          </Button>
        </div>
      </div>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="form-edit">
        <div className="form-item">
          <label>Display name:</label>
          <Controller
            name="nameDisplay"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Enter display name" />}
          />
        </div>

        <div className="form-item">
          <label>Biography:</label>
          <Controller
            name="bio"
            control={control}
            render={({ field }) => <Input.TextArea {...field} placeholder="Introduce yourself" rows={4} />}
          />
        </div>

        <div className="form-item">
          <label>Gender:</label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select gender" onChange={field.onChange} value={field.value}>
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
                <Select.Option value="Unknown">Unknown</Select.Option>
              </Select>
            )}
          />
        </div>

        <div className="form-item">
          <label>Phone number:</label>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Enter phone number" />}
          />
        </div>

        <div className="form-item">
          <label>Date of birth:</label>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                style={{ width: '100%' }}
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />
        </div>

        <div className="form-item">
          <Button type="primary" htmlType="submit">Save changes</Button>
        </div>
      </Form>
    </StyleEditInfo>
  );
};

const StyleEditInfo = styled.div`
  h2 {
    margin-bottom: 24px;
    font-size: 20px;
    font-weight: 600;
  }

  .form-edit {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-item label {
    display: block;
    font-weight: 500;
    margin-bottom: 6px;
  }

  .form-item {
    display: flex;
    flex-direction: column;
  }

  .avatar-upload {
    display: flex;
    flex-direction: row;
    gap: 12px;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin-bottom: 20px;
  }

  .avatar-preview {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export default EditInfo;
