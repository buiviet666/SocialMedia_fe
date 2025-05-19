/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { Button, Divider, Input, Switch } from "antd";
import imgbg from "../../../assets/images/Rectangle 2756.png";
import logo from "../../../assets/images/logoMain.png";
import authApi from "../../../apis/api/authApi";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ValidateMessage } from "../../../utils/validateMessage";

interface LoginFormValues {
  identifier: string;
  password: string;
  rememberLogin: boolean;
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm<LoginFormValues>({
    mode: "onBlur",
    reValidateMode: "onChange",
    delayError: 200,
    defaultValues: {
      identifier: "",
      password: "",
      rememberLogin: false
    },
  });

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
    if (token) {
      navigate("/", { replace: true });
    }
  }, []);

  const _onSubmit = async (val: any) => {
    setLoading(true);
    try {
      const res: any = await authApi.loginApi(val);
      if (res?.statusCode === 200) {
        const { accessToken, refreshToken } = res.data;
        if (val.rememberLogin) {
          localStorage.setItem(ACCESS_TOKEN, accessToken);
          localStorage.setItem(REFRESH_TOKEN, refreshToken);
        } else {
          sessionStorage.setItem(ACCESS_TOKEN, accessToken);
          sessionStorage.setItem(REFRESH_TOKEN, refreshToken);
        }

        navigate("/");
        toast.success("Login successful!");
      } else {
        toast.error(res?.message || "Login failed");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Please check again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyleLogin className="flex h-screen">
      <div className=" max-md:hidden grow-7">
        <img src={imgbg} alt="img" className="w-full h-full" />
      </div>
      <div className="grow-3 px-12 pt-12 flex flex-col">
        <div>
          <img className="w-[150px] md:w-[300px] mx-auto" src={logo} />
          <div className="pt-12">
            <h2 className="text-2xl font-medium">Nice to see you again</h2>
            <form onSubmit={handleSubmit(_onSubmit)} className="pt-6">
              <Controller
                control={control}
                name="identifier"
                rules={{
                  required: "Username or Email is required",
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <label className="required" htmlFor="identifier">
                      User name & Email
                    </label>
                    <Input
                      {...field}
                      id="identifier"
                      className="custom_input_username"
                      maxLength={255}
                      status={fieldState.invalid ? "error" : ""}
                      placeholder="Enter Username or Email"
                    />
                      <ValidateMessage message={fieldState.error?.message}/>
                  </FormItem>
                )}
              />
              <Controller
                control={control}
                name="password"
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <label className="required" htmlFor="password">
                      Password
                    </label>
                    <Input.Password
                      {...field}
                      id="password"
                      className="custom_input_password"
                      maxLength={255}
                      status={fieldState.invalid ? "error" : ""}
                      placeholder="Enter Password"
                    />
                      <ValidateMessage message={fieldState.error?.message}/>
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Controller
                  name="rememberLogin"
                  control={control}
                  render={({ field }) => (
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                      <Switch checked={field.value} onChange={field.onChange} />
                      <span style={{ marginLeft: 8 }}>Remember me</span>
                    </div>
                  )}
                />
                <div className="text-[#007AFF] cursor-pointer hover_link">
                  <span>Forgot password?</span>
                </div>
              </div>
              <div className="py-8 justify-self-center w-full">
                <Button
                  htmlType="submit"
                  className="w-full button-custom"
                  type="primary"
                  loading={loading}
                >
                  Sign in
                </Button>
              </div>
              <Divider />
              {/* <div className="pt-8 pb-6 justify-self-center w-full">
                <Button className="w-full button-custom button-custom-another">
                  sign in with google
                </Button>
              </div> */}
              <div className="whitespace-nowrap text-center">
                Dont have an account?{" "}
                <span
                  className="text-[#007AFF] cursor-pointer hover_link"
                  onClick={() => navigate("/auth/register")}
                >
                  Sign in now
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </StyleLogin>
  );
};

export default Login;

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

  .custom_input_username {
    height: 50px;
  }

  .custom_input_password input {
    margin: 0;
    min-height: 40px;
  }
`;

const StyleLogin = styled.div`
  .button-custom {
    height: 40px;

    span {
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
    }
  }

  .button-custom-another {
    background-color: #333333;
  }

  .button-custom-another:hover {
    opacity: 0.9;
    background-color: #333333 !important;
    border: 1px solid #333333 !important;
  }

  .button-custom-another:hover span {
    color: #ffffff;
  }

  .hover_link:hover {
    text-decoration: underline;
  }
`;
