import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import compressPlugin from "vite-plugin-compression";
import removeConsole from "vite-plugin-remove-console";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    vue(),
    compressPlugin(), // gzip压缩
    removeConsole(), // 生产环境移除console
    visualizer(), // 分析包体积
  ],
  build: {
    minify: "terser", // 压缩
    terserOptions: {
      compress: {
        drop_console: true, // 移除console
        drop_debugger: true, // 移除debugger
      },
    },
  },
});
