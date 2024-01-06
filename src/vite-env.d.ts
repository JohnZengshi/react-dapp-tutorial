/*
 * @LastEditors: John
 * @Date: 2023-12-29 10:22:01
 * @LastEditTime: 2024-01-06 12:41:03
 * @Author: John
 */
/// <reference types="vite/client" />

interface Window {
  ethereum: any;
  okxwallet: any | undefined;
  unisat: any;
}

interface ImportMetaEnv {
  readonly VITE_BASE_API_URL: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
