import axios from "axios";
import type { ApiResponse } from "@/types";
import { useUserStore } from "@/stores/user";

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
    if (res.code === 500 && res.message.includes("请登录...")) {
      // token 失效，清除用户信息
      const userStore = useUserStore();
      userStore.clearUser();
      return Promise.reject(new Error("登录已过期，请重新登录"));
    }

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
