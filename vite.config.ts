/*
 * @LastEditors: John
 * @Date: 2023-12-29 10:31:13
 * @LastEditTime: 2024-01-09 15:27:59
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
    host: "192.168.10.167",
    // https: true,
    proxy: {
      "/api": {
        target: "http://192.168.10.150:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
