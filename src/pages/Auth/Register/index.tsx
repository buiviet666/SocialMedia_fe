/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import imgbg2 from "../../../assets/images/wallpaper2.jpg";
import { Button, Input } from "antd";
import logo from "../../../assets/images/logoMain.png";
import authApi from "../../../apis/api/authApi";
import toast from "react-hot-toast";
import { useState } from "react";
import { ValidateMessage } from "../../../utils/validateMessage";

interface RegisterFormValues {
  userName: string;
  emailAddress: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

const Register = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataRegister, setDataRegister] = useState();
console.log("dataRegister", dataRegister);

  const { control, handleSubmit, watch } = useForm<RegisterFormValues>({
    mode: "onBlur",
    reValidateMode: "onChange",
    delayError: 200,
    defaultValues: {
      userName: "",
      password: "",
      emailAddress: "",
      phoneNumber: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const _onSubmit = async (val: any) => {
    setLoading(true);
    try {
      const res: any = await authApi.registerApi(val);
      if (res?.statusCode === 201) {
        navigate("/auth/login");
        toast.success('Account registration successful!');
      } else {
        setDataRegister(res?.errorMessages);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Please check again");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <StyledRegister className="flex h-screen">
      <div className="grow-4 p-12 flex flex-col h-screen overflow-scroll overflow-x-hidden">
        <div>
          <img className="w-[150px] md:w-[300px] mx-auto" src={logo} />
          <div className="pt-12">
            <h2 className="text-2xl font-medium">Nice to meet you</h2>
            <form onSubmit={handleSubmit(_onSubmit)} className="pt-6">
              <Controller
                control={control}
                name="userName"
                rules={{
                  required: "User name is required",
                  minLength: { value: 3, message: "Minimum 3 characters" },
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <label className="required" htmlFor="userName">
                      User Name
                    </label>
                    <Input
                      {...field}
                      id="userName"
                      className="custom_input_username"
                      maxLength={255}
                      status={fieldState.invalid ? "error" : ""}
                      placeholder="Enter Username"
                    />
                      <ValidateMessage message={fieldState.error?.message} />
                  </FormItem>
                )}
              />
              <Controller
                control={control}
                name="emailAddress"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <label className="required" htmlFor="emailAddress">
                      Email
                    </label>
                    <Input
                      {...field}
                      id="emailAddress"
                      className="custom_input_username"
                      maxLength={255}
                      status={fieldState.invalid ? "error" : ""}
                      placeholder="Enter your email address"
                    />
                      <ValidateMessage message={fieldState.error?.message} />
                  </FormItem>
                )}
              />
              <Controller
                control={control}
                name="phoneNumber"
                rules={{
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: "Invalid phone number",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <label className="required" htmlFor="phoneNumber">
                      Phone Number
                    </label>
                    <Input
                      {...field}
                      id="phoneNumber"
                      className="custom_input_username"
                      maxLength={255}
                      status={fieldState.invalid ? "error" : ""}
                      placeholder="Enter your phone number"
                    />
                      <ValidateMessage message={fieldState.error?.message} />
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
                      <ValidateMessage message={fieldState.error?.message} />
                  </FormItem>
                )}
              />
              <Controller
                control={control}
                name="confirmPassword"
                rules={{
                  required: "Please confirm your password",
                  validate: (value) => value === watch("password") || "Passwords do not match",
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <label className="required" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <Input.Password
                      id="confirmPassword"
                      maxLength={255}
                      {...field}
                      status={fieldState.invalid ? "error" : ""}
                      placeholder="Re-enter your password"
                    />
                    <ValidateMessage message={fieldState.error?.message} />
                  </FormItem>
                )}
              />
              <Controller
                name="agreeToTerms"
                control={control}
                rules={{
                  validate: (value) => value || "You must agree to the terms",
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                      <span>
                        I agree to the{" "}
                        <a href="/terms" className="text-blue-600 underline">
                          Terms of Service
                        </a>
                      </span>
                    </label>
                    <ValidateMessage message={fieldState.error?.message} />
                  </FormItem>
                )}
              />
              <div className="py-8 justify-self-center w-full">
                <Button
                  htmlType="submit"
                  className="w-full button-custom"
                  type="primary"
                  loading={loading}
                >
                  Sign up
                </Button>
              </div>
              <div className="whitespace-nowrap text-center">
                Already a user?{" "}
                <span
                  className="text-[#007AFF] cursor-pointer hover_link"
                  onClick={() => navigate("/auth/login")}
                >
                  Login now
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className=" max-md:hidden grow-6">
        <img src={imgbg2} alt="img" className="w-full h-full" />
      </div>
    </StyledRegister>
  );
};

export default Register;

const StyledRegister = styled.div``;

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
