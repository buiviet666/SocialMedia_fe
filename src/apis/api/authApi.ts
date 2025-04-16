import axiosClient from "../axiosClient";

type GenericObject = Partial<Record<string, unknown>>;

const authApi = {
    loginApi: (data: GenericObject) => axiosClient.post("/auth/login", data),
    registerApi: (data: GenericObject) => axiosClient.post("/auth/register", data),
    logoutApi: (data: GenericObject) => axiosClient.post("/auth/logout", data),
    sendVerifycationEmailApi: (data: GenericObject) => axiosClient.post("/auth/send-verification-email", data),
    verifyEmailApi: (token: GenericObject) => axiosClient.get(`/auth/verify-email/${token}`),
    sendForgotPasswordEmailApi: (data: GenericObject) => axiosClient.post("/auth/send-forgot-password", data),
    verifyForgotPasswordEmailApi: (data: GenericObject) => axiosClient.post("/auth/reset-password", data),
    changePasswordApi: (data: GenericObject) => axiosClient.post("/users/change-password", data),
}

export default authApi;