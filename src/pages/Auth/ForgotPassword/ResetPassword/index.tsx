/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input } from "antd";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ValidateMessage } from "../../../../utils/validateMessage";
import authApi from "../../../../apis/api/authApi";
import logo from "../../../../assets/images/logoMain.png";
import imgbg2 from "../../../../assets/images/wallpaper2.jpg";

interface RegisterFormValues {
  token: string;
  newPassword: string;
}

export default function ResetPassword () {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    
    const { control, handleSubmit } = useForm<RegisterFormValues>({
        mode: "onBlur",
        reValidateMode: "onChange",
        delayError: 200,
        defaultValues: {
            token: token || "",
            newPassword: ""
        },
    });

    const _onSubmit = async (val: any) => {
        setLoading(true);
        try {
            const res: any = await authApi.verifyForgotPasswordEmailApi(val);
            if (res?.statusCode === 200) {
                toast.success("Password changed successfully, please log in with the new password you just changed!");
                navigate("/auth/login");
            }
        } catch (e: any) {
            toast.error(e?.response?.data?.message || "Please check again");
            toast.error("Please verify againt!");
            if (e?.response?.data?.message === "Token is invalid or expired") {
                navigate("/auth/login");
            }
        } finally {
            setLoading(false);
        }
    };
    
    return (
    <StyledResetPassword>
        <div className="grow-4 p-12 flex flex-col h-screen overflow-scroll overflow-x-hidden">
            <img className="w-[150px] md:w-[300px] mx-auto" src={logo} />
            <div className="pt-12">
                <h2 className="text-2xl font-medium">Try to remember password or find by email!</h2>
                <form onSubmit={handleSubmit(_onSubmit)} className="pt-6">
                    <Controller
                        control={control}
                        name="newPassword"
                        rules={{
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Minimum 6 characters",
                            },
                        }}
                        render={({ field, fieldState }) => (
                        <FormItem>
                            <label className="required" htmlFor="newPassword">
                                New Password
                            </label>
                            <Input
                                {...field}
                                id="newPassword"
                                className="custom_input_username"
                                maxLength={255}
                                status={fieldState.invalid ? "error" : ""}
                                placeholder="Enter your newPassword address"
                            />
                            <ValidateMessage message={fieldState.error?.message} />
                        </FormItem>
                    )}/>
                
                    <div className="py-8 justify-self-center w-full">
                        <Button
                            htmlType="submit"
                            className="w-full button-custom"
                            type="primary"
                            loading={loading}
                        >
                            Submit
                        </Button>
                    </div>
                    <div className="whitespace-nowrap text-center">
                        Back to login?{" "}
                        <span
                            className="text-[#007AFF] cursor-pointer hover_link"
                            onClick={() => navigate("/auth/login")}>Login now
                        </span>
                    </div>
                </form>
            </div>
        </div>
        <div className=" max-md:hidden grow-6">
            <img src={imgbg2} alt="img" className="w-full h-full" />
        </div>
    </StyledResetPassword>
  );
};

const StyledResetPassword = styled.div`
    display: flex;
    height: 100vh;
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