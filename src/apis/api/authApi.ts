/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosClient";

type GenericObject = Partial<Record<string, unknown>>;

const authApi = {
    testApi: () => axiosClient.get("/"),
    loginApi: (data: GenericObject) => axiosClient.post("/auth/login", data),
    registerApi: (data: GenericObject) => axiosClient.post("/auth/register", data),
    logoutApi: (data: GenericObject) => axiosClient.post("/auth/logout", data),
    sendVerifycationEmailApi: () => axiosClient.post("/auth/send-verification-email"),
    verifyEmailApi: (token: any) => axiosClient.get(`/auth/verify-email?token=${token}`),
    sendForgotPasswordEmailApi: (data: GenericObject) => axiosClient.post("/auth/send-forgot-password", data),
    verifyForgotPasswordEmailApi: (data: GenericObject) => axiosClient.post("/auth/reset-password", data),
    changePasswordApi: (data: GenericObject) => axiosClient.post("/users/change-password", data),
}

export default authApi;