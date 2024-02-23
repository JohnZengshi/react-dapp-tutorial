/*
 * @LastEditors: John
 * @Date: 2024-02-21 15:31:59
 * @LastEditTime: 2024-02-23 09:53:37
 * @Author: John
 */
export const WALLET_ARBITRUM_ONE = {
  chainId: "0xa4b1", // 42161
  rpcUrls: ["https://arbitrum.llamarpc.com"],
  blockExplorerUrls: ["https://arbiscan.io"],
  chainName: "Arbitrum One",
  nativeCurrency: {
    symbol: "ETH",
    decimals: 18,
  },
};

export const WALLET_TEST = {
  chainId: "0x66eee", // 421614
  rpcUrls: ["https://arbitrum-sepolia.blockpi.network/v1/rpc/public"],
  blockExplorerUrls: ["https://arbitrum-sepolia.blockpi.network"],
  chainName: "Arbitrum test",
  nativeCurrency: {
    symbol: "ETH",
    decimals: 18,
  },
};

export const WALLET_ETHEREUM = {
  chainId: "0x1",
};

export enum ETHEREUM_RPC {
  EthRequestAccounts = "eth_requestAccounts",
  WalletSwitchEthereumChain = "wallet_switchEthereumChain",
  WalletAddEthereumChain = "wallet_addEthereumChain",
  EthSendTransaction = "eth_sendTransaction",
  EthSign = "eth_sign",
  PERSONAL_SIGN = "personal_sign",
}

export type ethereum = {
  on: any;
  removeListener: any;
  request: <T extends ETHEREUM_RPC>({
    method,
  }: {
    method: T;
    params?: T extends ETHEREUM_RPC.WalletAddEthereumChain
      ? Partial<{
          chainId: string;
          rpcUrls: string[];
          blockExplorerUrls: string[];
          chainName: string;
          nativeCurrency: {
            symbol: string;
            decimals: number;
          };
        }>[]
      : T extends ETHEREUM_RPC.EthSendTransaction
      ? Partial<{
          from: string;
          to: string;
          value: string;
          data: string;
          gas: string;
        }>[]
      : T extends ETHEREUM_RPC.EthSign
      ? [string, string]
      : T extends ETHEREUM_RPC.PERSONAL_SIGN
      ? [string, string]
      : any;
  }) => Promise<
    T extends ETHEREUM_RPC.EthRequestAccounts
      ? string[]
      : T extends
          | ETHEREUM_RPC.EthSendTransaction
          | ETHEREUM_RPC.EthSign
          | ETHEREUM_RPC.PERSONAL_SIGN
      ? string
      : void
  >;
};

declare global {
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
}
