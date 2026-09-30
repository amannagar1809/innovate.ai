import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://innovate-ai-be.onrender.com/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      window.localStorage.removeItem("access_token");
    }

    return Promise.reject(error);
  }
);

export default api;
export type { AxiosRequestConfig };
