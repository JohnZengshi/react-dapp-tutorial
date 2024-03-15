/*
 * @LastEditors: John
 * @Date: 2024-03-08 09:44:08
 * @LastEditTime: 2024-03-15 17:34:20
 * @Author: John
 */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_API_URL: string;
  readonly VITE_BASE_URL: string;
  readonly VITE_NETWORK_USDT_ADDRESS: `0x${string}`;
  readonly VITE_CONTRACT_ADDRESS: `0x${string}`;
  readonly VITE_CHECK_TRANSACTION_DETAILS_URL: string;
  // 更多环境变量...

  readonly MODE: "development" | "production" | "test";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
