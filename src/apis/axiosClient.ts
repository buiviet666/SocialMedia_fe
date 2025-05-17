import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const isUnauthorized = error.response?.status === 401;
    const isNotRetrying = !originalRequest._retry;
    const isNotRefreshEndpoint = !originalRequest.url?.includes("/auth/resetAccessToken");

    if (isUnauthorized && isNotRetrying && isNotRefreshEndpoint) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        if (!refreshToken) throw new Error('No refresh token');

        // Gọi API refresh để lấy accessToken mới
        const res = await axios.post(`${import.meta.env.VITE_BASE_API}/auth/resetAccessToken`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = res.data.data;
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, newRefreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Gửi lại request cũ với token mới
        return axiosClient(originalRequest);
      } catch (err) {
        // Nếu refreshToken cũng hết hạn → logout
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
