import axios, {
    AxiosResponse,
    InternalAxiosRequestConfig,
  } from "axios";
  
  // ⚠️ Lưu ý: dùng VITE_ thay vì REACT_APP_ nếu dùng Vite
  const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  
  axiosClient.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error) => Promise.reject(error)
  );
  
  export default axiosClient;
  