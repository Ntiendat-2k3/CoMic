import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://otruyenapi.com/v1/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Xử lý interceptor cho request
apiClient.interceptors.request.use(
  (config) => {
    // Thêm xử lý token tại đây nếu cần
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

export default apiClient;
