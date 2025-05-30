/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { hideLoading, showLoading } from "../store/loadingSlice";
import { store } from "../store";

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime?: Date;
    minLoading?: number;
  };
}

const getToken = (key: string): string | null => {
  return localStorage.getItem(key) || sessionStorage.getItem(key);
};

const setToken = (key: string, value: string) => {
  if (localStorage.getItem(key)) {
    localStorage.setItem(key, value);
  } else {
    sessionStorage.setItem(key, value);
  }
};

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
    const customConfig = config as CustomAxiosRequestConfig;
    startLoading();

    customConfig.metadata = {
      startTime: new Date(),
      minLoading: customConfig.metadata?.minLoading ?? MIN_LOADING_DURATION,
    };

    const token = getToken(ACCESS_TOKEN);
    if (token && customConfig.headers) {
      customConfig.headers.Authorization = `Bearer ${token}`;
    }

    return customConfig;
  },
  (error) => {
    stopLoading();
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  async (response: AxiosResponse) => {
    const customConfig = response.config as CustomAxiosRequestConfig;
    const metadata = customConfig.metadata;
    const timeSpent =
      new Date().getTime() - (metadata?.startTime?.getTime() ?? 0);
    const delay = Math.max(0, (metadata?.minLoading ?? MIN_LOADING_DURATION) - timeSpent);

    setTimeout(stopLoading, delay);
    return response.data;
  },
  async (error: AxiosError) => {
    const customConfig = error.config as CustomAxiosRequestConfig;
    const metadata = customConfig?.metadata;
    const timeSpent =
      new Date().getTime() - (metadata?.startTime?.getTime() ?? 0);
    const delay = Math.max(0, (metadata?.minLoading ?? MIN_LOADING_DURATION) - timeSpent);

    setTimeout(stopLoading, delay);

    const originalRequest = customConfig as CustomAxiosRequestConfig & { _retry?: boolean };
    const isUnauthorized = error.response?.status === 401;
    const isNotRetrying = !originalRequest._retry;
    const isNotRefreshEndpoint = !originalRequest.url?.includes("/auth/resetAccessToken");

    if (isUnauthorized && isNotRetrying && isNotRefreshEndpoint) {
      originalRequest._retry = true;

      try {
        const refreshToken = getToken(REFRESH_TOKEN);
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(`${import.meta.env.VITE_BASE_API}/auth/resetAccessToken`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

        setToken(ACCESS_TOKEN, accessToken);
        setToken(REFRESH_TOKEN, newRefreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return axiosClient(originalRequest);
      } catch (err) {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        sessionStorage.removeItem(ACCESS_TOKEN);
        sessionStorage.removeItem(REFRESH_TOKEN);
        window.location.href = "/auth/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
