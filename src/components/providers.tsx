"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

export const config = createConfig(
  getDefaultConfig({
    chains: [base],
    // transports: {
    //   [base.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_API_URL),
    // },
    walletConnectProjectId: process.env.PROJECT_ID as string,
    appName: "Coin the Meme",
    appDescription: "Your App Description",
  })
);

const queryClient = new QueryClient();

import { ReactNode } from "react";

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
