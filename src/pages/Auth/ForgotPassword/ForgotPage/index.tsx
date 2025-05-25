/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input } from "antd";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { ValidateMessage } from "../../../../utils/validateMessage";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authApi from "../../../../apis/api/authApi";
import logo from "../../../../assets/images/logoMain.png";
import toast from "react-hot-toast";
import imgbg2 from "../../../../assets/images/wallpaper2.jpg";
interface RegisterFormValues {
  email: string;
}

export default function ForgotPage () {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState<number>(0);

    const { control, handleSubmit } = useForm<RegisterFormValues>({
        mode: "onBlur",
        reValidateMode: "onChange",
        delayError: 200,
        defaultValues: {
            email: "",
        },
    });

    const _onSubmit = async (val: any) => {
        setLoading(true);
        try {
            const res: any = await authApi.sendForgotPasswordEmailApi(val);
            if (res?.statusCode === 200) {
                toast.success("We have sent you an email please check your inbox!");
                setCooldown(60);
            }
        } catch (e: any) {
            toast.error(e?.response?.data?.message || "Please check again");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setInterval(() => {
                setCooldown(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [cooldown]);

    return (
    <StyledForgotPassword>
        <div className="grow-4 p-12 flex flex-col h-screen overflow-scroll overflow-x-hidden">
            <img className="w-[150px] md:w-[300px] mx-auto" src={logo} />
            <div className="pt-12">
                <h2 className="text-2xl font-medium">Try to remember password or find by email!</h2>
                <form onSubmit={handleSubmit(_onSubmit)} className="pt-6">
                    <Controller
                        control={control}
                        name="email"
                        rules={{
                        required: "Email is required",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email format",
                        },
                        }}
                        render={({ field, fieldState }) => (
                        <FormItem>
                            <label className="required" htmlFor="email">
                                Email
                            </label>
                            <Input
                                {...field}
                                id="email"
                                className="custom_input_username"
                                maxLength={255}
                                status={fieldState.invalid ? "error" : ""}
                                placeholder="Enter your email address"
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
                            disabled={cooldown > 0 || loading}
                        >
                            {cooldown > 0 ? `Wait ${cooldown}s` : "Submit"}
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
    </StyledForgotPassword>
  );
}

const StyledForgotPassword = styled.div`
    display: flex;
    height: 100vh;

    .button-custom[disabled] {
        background-color: #d9d9d9 !important;
        cursor: not-allowed;
        color: #999 !important;
        border-color: #d9d9d9 !important;
        opacity: 0.8;
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