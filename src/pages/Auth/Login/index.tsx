import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { Button, Divider, Input, Switch } from "antd";
import imgbg from "../../../assets/images/Rectangle 2756.png";
import logo from "../../../assets/images/logoMain.png";
import authApi from "../../../apis/api/authApi";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants";
import { useState } from "react";
import { login } from "../../../store/authSlice";

const Login = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dataUser, setDataUser] = useState(null);

  if (user) {
    return <Navigate to="/" replace />;
  }
  console.log(dataUser);

  const { control, handleSubmit } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    delayError: 200,
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const _onSubmit = async (val: any) => {
    try {
      const res: any = await authApi.loginApi(val);
      localStorage.setItem(ACCESS_TOKEN, res?.data?.accessToken);
      localStorage.setItem(REFRESH_TOKEN, res?.data?.refreshToken);
      setDataUser(res?.data);
      dispatch(
        login({
          id: res.data.user.id,
          name: res.data.user.userName,
        })
      );
      navigate("/");
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

  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
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
                  required: {
                    value: true,
                    message: "validation.required",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <label className="required" htmlFor="identifier">
                      User name & Email
                    </label>
                    <Input
                      className="custom_input_username"
                      id="identifier"
                      maxLength={255}
                      {...field}
                      onBlur={() => field.onChange((field.value || "").trim())}
                      status={fieldState.invalid ? "error" : ""}
                      placeholder="Enter Username or Email"
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
                      Password
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
              <div className="pt-5 flex justify-between ">
                <div className="flex flex-row items-center">
                  <Switch onChange={onChange} />
                  <span className="ml-1.5">Remember me</span>
                </div>
                <div className="text-[#007AFF] cursor-pointer hover_link">
                  Forgot password?
                </div>
              </div>
              <div className="py-8 justify-self-center w-full">
                <Button
                  htmlType="submit"
                  className="w-full button-custom"
                  type="primary"
                >
                  Sign in
                </Button>
              </div>
              <Divider />
              <div className="pt-8 pb-6 justify-self-center w-full">
                <Button className="w-full button-custom button-custom-another">
                  sign in with google
                </Button>
              </div>
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
        {/* <div className="mt-auto pb-2 text-right">hello 😋</div> */}
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
