/*
 * @LastEditors: John
 * @Date: 2023-12-29 10:31:13
 * @LastEditTime: 2024-01-18 10:16:20
 * @Author: John
 */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import viteCompression from "vite-plugin-compression";
import { createHtmlPlugin } from "vite-plugin-html";
// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
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
    plugins: [
      react(),
      viteCompression({ deleteOriginFile: false }),
      createHtmlPlugin({
        minify: false,
        inject: {
          data: { BASE_URL: loadEnv(mode, process.cwd())["VITE_BASE_URL"] },
        },
      }),
    ],
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
};
