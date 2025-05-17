import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import imgbg from "../../../assets/images/Rectangle 2756.png";
import { Button, Divider, Input } from "antd";
import logo from "../../../assets/images/logoMain.png";
import authApi from "../../../apis/api/authApi";

const Register = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    delayError: 200,
    defaultValues: {
      userName: "",
      password: "",
      emailAddress: "",
      phoneNumber: "",
      // fullName: "",
    },
  });

  const _onSubmit = async (val: any) => {
    try {
      const res: any = await authApi.registerApi(val);
      if (res?.statusCode === 201) {
        navigate("/auth/login");
      }
    } catch (error) {
      console.log(error);
    }
    // if (onSubmit) {
    //     const emitVal = {
    //         ...val,
    //     };
    //     onSubmit(emitVal);
    //     setBlock(false);
    // }
    console.log(val);
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <StyledRegister className="flex h-screen">
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
                name="userName"
                rules={{
                  required: {
                    value: true,
                    message: "validation.required",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <label className="required" htmlFor="userName">
                      User Name
                    </label>
                    <Input
                      className="custom_input_username"
                      id="userName"
                      maxLength={255}
                      {...field}
                      onBlur={() => field.onChange((field.value || "").trim())}
                      status={fieldState.invalid ? "error" : ""}
                      placeholder="Enter Username"
                    />
                    {/* <ValidateMessage
                    message={fieldState.error?.message}
                    params={{ field: "Mã dịch vụ" }}
                  /> */}
                  </FormItem>
                )}
              />
              {/* <Controller
                control={control}
                name="fullName"
                rules={{
                  required: {
                    value: true,
                    message: "validation.required",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <label className="required" htmlFor="fullName">
                      Full Name
                    </label>
                    <Input
                      className="custom_input_username"
                      id="fullName"
                      maxLength={255}
                      {...field}
                      onBlur={() => field.onChange((field.value || "").trim())}
                      status={fieldState.invalid ? "error" : ""}
                      placeholder="Enter your fullname"
                    />
                  </FormItem>
                )}
              /> */}
              <Controller
                control={control}
                name="emailAddress"
                rules={{
                  required: {
                    value: true,
                    message: "validation.required",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <label className="required" htmlFor="emailAddress">
                      Email
                    </label>
                    <Input
                      className="custom_input_username"
                      id="emailAddress"
                      maxLength={255}
                      {...field}
                      onBlur={() => field.onChange((field.value || "").trim())}
                      status={fieldState.invalid ? "error" : ""}
                      placeholder="Enter your email address"
                    />
                    {/* <ValidateMessage
                    message={fieldState.error?.message}
                    params={{ field: "Mã dịch vụ" }}
                  /> */}
                  </FormItem>
                )}
              />
              <Controller
                control={control}
                name="phoneNumber"
                rules={{
                  required: {
                    value: true,
                    message: "validation.required",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <label className="required" htmlFor="phoneNumber">
                      Phone Number
                    </label>
                    <Input
                      className="custom_input_username"
                      id="phoneNumber"
                      maxLength={255}
                      {...field}
                      onBlur={() => field.onChange((field.value || "").trim())}
                      status={fieldState.invalid ? "error" : ""}
                      placeholder="Enter your phone number"
                    />
                    {/* <ValidateMessage
                    message={fieldState.error?.message}
                    params={{ field: "Mã dịch vụ" }}
                  /> */}
                  </FormItem>
                )}
              />
              <Controller
                control={control}
                name="password"
                rules={{
                  required: {
                    value: true,
                    message: "validation.required",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <label className="required" htmlFor="password">
                      Create Password
                    </label>
                    <Input.Password
                      className="custom_input_password"
                      id="password"
                      maxLength={255}
                      {...field}
                      onBlur={() => field.onChange((field.value || "").trim())}
                      status={fieldState.invalid ? "error" : ""}
                      placeholder="Enter Password"
                    />
                    {/* <ValidateMessage
                    message={fieldState.error?.message}
                    params={{ field: "Mã dịch vụ" }}
                  /> */}
                  </FormItem>
                )}
              />
              <div className="py-8 justify-self-center w-full">
                <Button
                  htmlType="submit"
                  className="w-full button-custom"
                  type="primary"
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
        {/* <div className="mt-auto pb-2 text-right">hello 😋</div> */}
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
