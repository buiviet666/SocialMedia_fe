import React, { useState } from "react";
import styled from "styled-components";
import { Button, Input, Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ValidateMessage } from "../../../utils/validateMessage";
import userApi from "../../../apis/api/userApi";

const { Title } = Typography;

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordPage = () => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      await userApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Đổi mật khẩu thành công!");
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Đổi mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyleChangePasswordPage>
      <Title level={3}>Đổi mật khẩu</Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormItem>
          <label className="required">Mật khẩu hiện tại</label>
          <Controller
            name="currentPassword"
            control={control}
            rules={{ required: "Vui lòng nhập mật khẩu hiện tại" }}
            render={({ field }) => (
              <>
                <Input.Password {...field} placeholder="Nhập mật khẩu hiện tại" />
                <ValidateMessage message={errors.currentPassword?.message} />
              </>
            )}
          />
        </FormItem>

        <FormItem>
          <label className="required">Mật khẩu mới</label>
          <Controller
            name="newPassword"
            control={control}
            rules={{
              required: "Vui lòng nhập mật khẩu mới",
              minLength: { value: 6, message: "Ít nhất 6 ký tự" },
            }}
            render={({ field }) => (
              <>
                <Input.Password {...field} placeholder="Nhập mật khẩu mới" />
                <ValidateMessage message={errors.newPassword?.message} />
              </>
            )}
          />
        </FormItem>

        <FormItem>
          <label className="required">Xác nhận mật khẩu mới</label>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Vui lòng xác nhận mật khẩu",
              validate: (val) =>
                val === watch("newPassword") || "Mật khẩu không khớp",
            }}
            render={({ field }) => (
              <>
                <Input.Password {...field} placeholder="Xác nhận mật khẩu mới" />
                <ValidateMessage message={errors.confirmPassword?.message} />
              </>
            )}
          />
        </FormItem>

        <Button type="primary" htmlType="submit" loading={loading}>
          Xác nhận thay đổi
        </Button>
      </form>
    </StyleChangePasswordPage>
  );
};

export default ChangePasswordPage;

const StyleChangePasswordPage = styled.div`
  max-width: 500px;
  background: white;
  padding: 32px;
  border-radius: 12px;
  margin: 0 auto;

  .required {
    font-weight: 500;
    display: block;
    margin-bottom: 8px;
  }
`;

const FormItem = styled.div`
  margin-bottom: 24px;
`;
