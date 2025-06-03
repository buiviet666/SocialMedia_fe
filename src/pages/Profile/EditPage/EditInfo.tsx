import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Input, Select, DatePicker, Form, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { UploadOutlined } from '@ant-design/icons';
import userApi from '../../../apis/api/userApi';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const EditInfo = () => {
  const { control, handleSubmit, setValue, reset } = useForm();
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await userApi.getCurrentUser();
        const user = res.data?.data || res.data?.user || res.data;

        // Fill avatar
        setAvatar(user.avatar);

        // Reset toàn bộ form với dữ liệu từ API
        reset({
          nameDisplay: user.nameDisplay || '',
          bio: user.bio || '',
          gender: user.gender || undefined,
          phone: user.phone || '',
          birthDate: user.birthDate ? moment(user.birthDate) : undefined,
        });
      } catch (err) {
        toast.error('Không thể tải thông tin người dùng');
      }
    };

    fetchData();
  }, [reset]);

  const onSubmit = async (data: any) => {
    try {
      const cleanData = {
        nameDisplay: data.nameDisplay,
        bio: data.bio,
        gender: data.gender,
        phone: data.phone,
        birthDate: data.birthDate?.toISOString() || null,
      };
      await userApi.updateProfile(cleanData);
      message.success('Thông tin đã được cập nhật');
      navigate('/profile');
    } catch (err) {
      message.error('Cập nhật thất bại');
    }
  };

  const handleChangeAvatar = async (file: File) => {
    console.log("file:", file);
    
    try {
      const formData = new FormData();
      formData.append('avatar', file); // key phải đúng với tên backend đang đọc

      const res = await userApi.updateAvatar(formData);

      if (res?.data?.avatar) {
        setAvatar(res.data.avatar); // Cập nhật avatar preview
      }

      message.success('Ảnh đại diện đã được cập nhật');
    } catch (err) {
      console.error('Lỗi khi upload ảnh:', err);
      message.error('Cập nhật ảnh đại diện thất bại');
    }
  };

  return (
    <StyleEditInfo>
      <h2>Chỉnh sửa hồ sơ</h2>

      <div className="form-item">
        <label>Ảnh đại diện:</label>
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
              // e.target.value = '';
            }}
          />
          <Button icon={<UploadOutlined />} onClick={() => fileInputRef.current?.click()}>
            Đổi ảnh đại diện
          </Button>
        </div>
      </div>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="form-edit">
        <div className="form-item">
          <label>Tên hiển thị:</label>
          <Controller
            name="nameDisplay"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Nhập tên hiển thị" />}
          />
        </div>

        <div className="form-item">
          <label>Tiểu sử:</label>
          <Controller
            name="bio"
            control={control}
            render={({ field }) => <Input.TextArea {...field} placeholder="Giới thiệu bản thân" rows={4} />}
          />
        </div>

        <div className="form-item">
          <label>Giới tính:</label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Chọn giới tính" onChange={field.onChange} value={field.value}>
                <Select.Option value="Male">Nam</Select.Option>
                <Select.Option value="Female">Nữ</Select.Option>
                <Select.Option value="Other">Khác</Select.Option>
                <Select.Option value="Unknown">Không xác định</Select.Option>
              </Select>
            )}
          />
        </div>

        <div className="form-item">
          <label>Số điện thoại:</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Nhập số điện thoại" />}
          />
        </div>

        <div className="form-item">
          <label>Ngày sinh:</label>
          <Controller
            name="birthDate"
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
          <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
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
