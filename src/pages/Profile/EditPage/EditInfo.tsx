import React from 'react';
import styled from 'styled-components';
import CartUser from '../../../components/CartUser';
import { Button, Input, Select, DatePicker, Form } from 'antd';
import { useForm, Controller } from 'react-hook-form';

const EditInfo = () => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log('Form data:', data);
  };

  return (
    <StyleEditInfo>
      <h2>Chỉnh sửa hồ sơ</h2>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="form-edit">
        <div className="form-item">
          <label>Ảnh đại diện:</label>
          <CartUser
            dataItem={{ name: "Tên", des: "Mô tả", avatar: "link ảnh" }}
            onChangeAvatar={() => console.log("Đổi ảnh!")}
            />
        </div>

        <div className="form-item">
          <label>Tên người dùng:</label>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            render={({ field }) => <Input {...field} placeholder="Nhập tên" />}
          />
        </div>

        <div className="form-item">
          <label>Tiểu sử:</label>
          <Controller
            name="bio"
            control={control}
            defaultValue=""
            render={({ field }) => <Input.TextArea {...field} placeholder="Giới thiệu bản thân" rows={4} />}
          />
        </div>

        <div className="form-item">
          <label>Giới tính:</label>
          <Controller
            name="gender"
            control={control}
            defaultValue={undefined}
            render={({ field }) => (
              <Select {...field} placeholder="Chọn giới tính" onChange={field.onChange} value={field.value}>
                <Select.Option value="male">Nam</Select.Option>
                <Select.Option value="female">Nữ</Select.Option>
                <Select.Option value="other">Khác</Select.Option>
              </Select>
            )}
          />
        </div>

        <div className="form-item">
          <label>Số điện thoại:</label>
          <Controller
            name="phone"
            control={control}
            defaultValue=""
            render={({ field }) => <Input {...field} placeholder="Nhập số điện thoại" />}
          />
        </div>

        <div className="form-item">
          <label>Ngày sinh:</label>
          <Controller
            name="birthDate"
            control={control}
            defaultValue={null}
            render={({ field }) => <DatePicker {...field} style={{ width: '100%' }} onChange={field.onChange} />}
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
`;

export default EditInfo;
