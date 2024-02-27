/*
 * @LastEditors: John
 * @Date: 2024-02-21 15:31:59
 * @LastEditTime: 2024-02-27 11:03:26
 * @Author: John
 */

type chainType = {
  chainId: string;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  chainName: string;
  nativeCurrency: {
    symbol: string;
    decimals?: number;
  };
};

export const WALLET_ARBITRUM_ONE: chainType = {
  chainId: "0xa4b1", // 42161
  rpcUrls: ["https://arbitrum.llamarpc.com"],
  blockExplorerUrls: ["https://explorer.arbitrum.io"],
  chainName: "Arbitrum One",
  nativeCurrency: {
    symbol: "ETH",
    decimals: 18,
  },
};

export const WALLET_TEST: chainType = {
  chainId: "0xaa36a7", // 11155111
  rpcUrls: ["https://rpc.sepolia.org"],
  blockExplorerUrls: ["https://sepolia.etherscan.io"],
  chainName: "Sepolia test network",
  nativeCurrency: {
    symbol: "ETH",
    decimals: 18,
  },
};

export const WALLET_ETHEREUM: Pick<chainType, "chainId"> = {
  chainId: "0x1",
};

export enum ETHEREUM_RPC {
  EthRequestAccounts = "eth_requestAccounts",
  WalletSwitchEthereumChain = "wallet_switchEthereumChain",
  WalletAddEthereumChain = "wallet_addEthereumChain",
  EthSendTransaction = "eth_sendTransaction",
  EthSign = "eth_sign", // OKX
  PERSONAL_SIGN = "personal_sign",
  ETH_SUBSCRIBE = "eth_subscribe",
}

export type Ethereum = {
  on: any;
  removeListener: any;
  request: <T extends ETHEREUM_RPC>({
    method,
  }: {
    method: T;
    params?: T extends
      | ETHEREUM_RPC.WalletAddEthereumChain
      | ETHEREUM_RPC.WalletSwitchEthereumChain
      ? Partial<{
          chainId: string;
          rpcUrls: string[];
          blockExplorerUrls: string[];
          chainName: string;
          nativeCurrency: {
            symbol: string;
            decimals?: number;
          };
        }>[]
      : T extends ETHEREUM_RPC.EthSendTransaction
      ? Partial<{
          from: string;
          to: string;
          value: string;
          data: string;
          gas: string;
          gasPrice?: string;
        }>[]
      : T extends ETHEREUM_RPC.EthSign
      ? [string, string]
      : T extends ETHEREUM_RPC.PERSONAL_SIGN
      ? [string, string]
      : T extends ETHEREUM_RPC.ETH_SUBSCRIBE
      ? ["newHeads" | "logs" | "newPendingTransactions" | "syncing"]
      : any;
  }) => Promise<
    T extends ETHEREUM_RPC.EthRequestAccounts
      ? string[]
      : T extends
          | ETHEREUM_RPC.EthSendTransaction
          | ETHEREUM_RPC.EthSign
          | ETHEREUM_RPC.PERSONAL_SIGN
          | ETHEREUM_RPC.ETH_SUBSCRIBE
      ? string
      : void
  >;
};

declare global {
  interface Window {
    ethereum?: Ethereum;
    okxwallet:
      | ({
          bitcoin: any;
        } & Ethereum)
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
