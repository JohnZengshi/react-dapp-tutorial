/*
 * @LastEditors: John
 * @Date: 2023-12-29 10:22:01
 * @LastEditTime: 2024-01-18 09:40:08
 * @Author: John
 */
/// <reference types="vite/client" />

interface Window {
  ethereum?: any;
  okxwallet: { bitcoin: any } | undefined;
  unisat:
    | {
        requestAccounts: () => Promise<string[]>;
        getAccounts: () => Promise<string[]>;
        getPublicKey: () => Promise<string>;
        getBalance: () => Promise<{
          confirmed: number;
          unconfirmed: number;
          total: number;
        }>;
        getNetwork: () => Promise<string>;
        sendBitcoin: (to: string, coast: number) => Promise<string>;
        signMessage: (message: string) => Promise<string>;
        on: (event: string, handle: any) => void;
        removeListener: (event: string, handle: any) => void;
      }
    | undefined;
}

interface ImportMetaEnv {
  readonly VITE_BASE_API_URL: string;
  readonly VITE_BASE_URL: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
