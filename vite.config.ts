import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import removeConsole from "vite-plugin-remove-console";
import path from "path";

export default defineConfig({
  plugins: [
    vue(),
    removeConsole({
      includes: ["log", "warn", "error", "debug", "info"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // 配置代理
      "/api": {
        target: "http://localhost:12341", // 移除多余的 /api
        changeOrigin: true,
      },
    },
  },
  build: {
    minify: "esbuild",
  },
});
