/*
 * @LastEditors: John
 * @Date: 2024-03-06 11:26:45
 * @LastEditTime: 2024-03-11 14:41:57
 * @Author: John
 */
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { WagmiProvider } from "wagmi";
import { arbitrum, mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WALLET_TEST, sepoliaTestNetwork } from "@/constant/wallet";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "64bcc85442224cb68c2bd788a3e67742";

// 2. Create wagmiConfig
const metadata = {
  name: "roos",
  description: "roos dapp",
  url: "https://www.roospro.com", // origin must match your domain & subdomain
  icons: ["https://www.roospro.com/favicon.ico"],
};

const chains = [mainnet, arbitrum, sepoliaTestNetwork] as const;
export const config = defaultWagmiConfig({
  chains, // required
  projectId, // required
  metadata, // required
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  enableCoinbase: true, // Optional - true by default
  // ...wagmiOptions // Optional - Override createConfig parameters
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  defaultChain: mainnet,
  themeVariables: {
    // "--w3m-accent": BASE_CSS_VAR.main_color,
  },
});

export function WalletProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
