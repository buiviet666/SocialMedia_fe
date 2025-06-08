/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { Button, Divider, Input, Switch } from "antd";
import logo from "../../assets/images/logoMain.png";
import { useState } from "react";
import toast from "react-hot-toast";
import authApi from "../../apis/api/authApi";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { ValidateMessage } from "../../utils/validateMessage";

interface AdminLoginForm {
  identifier: string;
  password: string;
  rememberLogin: boolean;
}

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm<AdminLoginForm>({
    defaultValues: {
      identifier: "",
      password: "",
      rememberLogin: false,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const _onSubmit = async (val: AdminLoginForm) => {
    setLoading(true);
    try {
      const res: any = await authApi.loginApi(val);
      const { accessToken, refreshToken, user } = res.data;

      if (user.role !== "ADMIN") {
        toast.error("Bạn không có quyền truy cập hệ thống quản trị.");
        return;
      }

      if (val.rememberLogin) {
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, refreshToken);
        localStorage.setItem("userId", user._id);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem(ACCESS_TOKEN, accessToken);
        sessionStorage.setItem(REFRESH_TOKEN, refreshToken);
        sessionStorage.setItem("userId", user._id);
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      toast.success("Đăng nhập quản trị thành công!");
      navigate("/admin");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyleLogin className="flex justify-center items-center h-screen px-4">
      <div className="w-full max-w-[400px] p-6 rounded-xl shadow-xl bg-white">
        <div className="text-center mb-8">
          <img src={logo} alt="logo" className="mx-auto w-[200px]" />
          <h2 className="text-2xl font-semibold mt-4">Admin Login</h2>
        </div>
        <form onSubmit={handleSubmit(_onSubmit)}>
          <Controller
            name="identifier"
            control={control}
            rules={{ required: "Username or Email is required" }}
            render={({ field, fieldState }) => (
              <FormItem>
                <label htmlFor="identifier" className="required">
                  Username or Email
                </label>
                <Input
                  {...field}
                  id="identifier"
                  maxLength={255}
                  status={fieldState.invalid ? "error" : ""}
                  placeholder="Enter Username or Email"
                />
                <ValidateMessage message={fieldState.error?.message} />
              </FormItem>
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            }}
            render={({ field, fieldState }) => (
              <FormItem>
                <label htmlFor="password" className="required">
                  Password
                </label>
                <Input.Password
                  {...field}
                  id="password"
                  maxLength={255}
                  status={fieldState.invalid ? "error" : ""}
                  placeholder="Enter Password"
                />
                <ValidateMessage message={fieldState.error?.message} />
              </FormItem>
            )}
          />

          <Controller
            name="rememberLogin"
            control={control}
            render={({ field }) => (
              <div className="flex items-center mb-4">
                <Switch checked={field.value} onChange={field.onChange} />
                <span className="ml-2">Remember me</span>
              </div>
            )}
          />

          <Button
            htmlType="submit"
            className="w-full button-custom"
            type="primary"
            loading={loading}
          >
            Sign in as Admin
          </Button>
          <Divider />
        </form>
      </div>
    </StyleLogin>
  );
};

export default AdminLogin;

const StyleLogin = styled.div`
  .button-custom {
    height: 40px;
    font-weight: 500;
    font-size: 14px;
    span {
      color: #fff;
    }
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
    padding-left: 4px;
  }
`;
