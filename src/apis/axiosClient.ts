/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { hideLoading, showLoading } from "../store/loadingSlice";
import { store } from "../store";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let requestCount = 0;
const MIN_LOADING_DURATION = 2000;

const startLoading = () => {
  requestCount++;
  if (requestCount === 1) {
    store.dispatch(showLoading());
  }
};

const stopLoading = () => {
  requestCount--;
  if (requestCount <= 0) {
    store.dispatch(hideLoading());
  }
};

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    startLoading();
    (config as any).metadata = { startTime: new Date() };
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    stopLoading();
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  async (response: AxiosResponse) => {
    const startTime = (response.config as any).metadata?.startTime;
    const timeSpent = new Date().getTime() - startTime.getTime();
    const delay = Math.max(0, MIN_LOADING_DURATION - timeSpent);

    setTimeout(stopLoading, delay);
    return response.data;
  },
  async (error: AxiosError) => {

    const startTime = (error.config as any).metadata?.startTime;
    const timeSpent = startTime ? new Date().getTime() - startTime.getTime() : 0;
    const delay = Math.max(0, MIN_LOADING_DURATION - timeSpent);

    setTimeout(stopLoading, delay);

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
        window.location.href = "/auth/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
