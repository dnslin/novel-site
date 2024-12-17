import axios from "axios";
import type { ApiResponse } from "@/types";

const instance = axios.create({
  baseURL: "/api",
  timeout: 6 * 1000 * 10,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResponse;
    if (res.code !== 200) {
      return Promise.reject(new Error(res.message || "请求失败"));
    }
    return res.result;
  },
  (error) => {
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);

export default instance;
