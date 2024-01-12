/*
 * @LastEditors: John
 * @Date: 2023-12-29 10:31:13
 * @LastEditTime: 2024-01-12 15:27:54
 * @Author: John
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import basicSsl from "@vitejs/plugin-basic-ssl";
import postCssPxToRem from "postcss-pxtorem";
import autoprefixer from "autoprefixer";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // host: "192.168.10.167",
    // https: true,
    proxy: {
      "/dev": {
        target: "http://192.168.10.166:8086",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev/, ""),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/mixin.scss";`,
      },
    },
  },
});
