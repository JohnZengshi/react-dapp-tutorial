/*
 * @LastEditors: John
 * @Date: 2023-12-29 10:22:01
 * @LastEditTime: 2024-02-21 15:29:53
 * @Author: John
 */
/// <reference types="vite/client" />

type ethereum = {
  on: any;
  removeListener: any;
  request: ({
    method,
  }: {
    method:
      | "eth_requestAccounts"
      | "wallet_switchEthereumChain"
      | "wallet_addEthereumChain";
    params?: Partial<{
      chainId: string;
      rpcUrls: string[];
      blockExplorerUrls: string[];
      chainName: string;
      nativeCurrency: {
        symbol: string;
        decimals: number;
      };
    }>[];
  }) => Promise<string[]>;
};
interface Window {
  ethereum?: ethereum;
  okxwallet:
    | ({
        bitcoin: any;
      } & ethereum)
    | undefined;
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
