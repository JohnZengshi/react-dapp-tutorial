/*
 * @LastEditors: John
 * @Date: 2023-12-29 10:31:13
 * @LastEditTime: 2024-02-25 23:06:35
 * @Author: John
 */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import viteCompression from "vite-plugin-compression";
import { createHtmlPlugin } from "vite-plugin-html";
import { nodePolyfills } from "vite-plugin-node-polyfills";
// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    server: {
      // host: "192.168.10.167",
      host: "192.168.5.172",
      // https: true,
      proxy: {
        "/dev": {
          // target: "http://192.168.10.166:8096"
          target: "http://192.168.5.212:8096",
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
      nodePolyfills(),
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
