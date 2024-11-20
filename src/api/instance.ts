import axios from "axios";
import type { ApiResponse } from "@/types";

const instance = axios.create({
  baseURL: "/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResponse;
    if (res.code !== 0) {
      // 统一错误处理
      console.error(res.message || "请求失败");
      return Promise.reject(new Error(res.message || "请求失败"));
    }
    return res.data;
  },
  (error) => {
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);

export default instance;
