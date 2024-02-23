/*
 * @LastEditors: John
 * @Date: 2023-12-29 10:22:01
 * @LastEditTime: 2024-02-22 11:45:58
 * @Author: John
 */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_API_URL: string;
  readonly VITE_BASE_URL: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
