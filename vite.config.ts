import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import compressPlugin from "vite-plugin-compression";
import removeConsole from "vite-plugin-remove-console";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

export default defineConfig({
  plugins: [vue(), compressPlugin(), removeConsole(), visualizer()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@client": path.resolve(__dirname, "./src/client"),
    },
  },
  server: {
    proxy: {
      // 配置代理
      "/api": {
        target: "http://localhost:8100/v1", // 后端服务地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // 移除 /api 前缀
      },
    },
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
