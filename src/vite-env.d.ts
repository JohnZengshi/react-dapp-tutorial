/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_API_URL: string;
  readonly VITE_BASE_URL: string;
  readonly VITE_NETWORK_USDT_ADDRESS: string;
  readonly VITE_CHECK_TRANSACTION_DETAILS_URL: string;
  // 更多环境变量...

  readonly MODE: "development" | "production" | "test";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
