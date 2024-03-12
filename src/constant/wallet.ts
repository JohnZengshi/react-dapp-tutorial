/*
 * @LastEditors: John
 * @Date: 2024-02-21 15:31:59
 * @LastEditTime: 2024-03-12 16:56:46
 * @Author: John
 */

import { TYPE_ADDRESS } from "@/types";
import { defineChain } from "viem/utils";

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

export const sepoliaTestNetwork = defineChain({
  id: 11155111,
  name: "Sepolia test network",
  nativeCurrency: {
    name: "SepoliaETH",
    symbol: "ETH",
    decimals: 0,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.sepolia.org"],
      webSocket: undefined,
    },
  },
  blockExplorers: {
    default: {
      name: "",
      url: "https://sepolia.etherscan.io",
    },
  },
});

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
      ? [TYPE_ADDRESS, string]
      : T extends ETHEREUM_RPC.PERSONAL_SIGN
      ? [TYPE_ADDRESS, TYPE_ADDRESS]
      : T extends ETHEREUM_RPC.ETH_SUBSCRIBE
      ? ["newHeads" | "logs" | "newPendingTransactions" | "syncing"]
      : any;
  }) => Promise<
    T extends ETHEREUM_RPC.EthRequestAccounts
      ? TYPE_ADDRESS[]
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
    ethereum?: Ethereum & { isTokenPocket?: boolean };
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
    bitkeep?: { ethereum?: Ethereum };
  }
}
