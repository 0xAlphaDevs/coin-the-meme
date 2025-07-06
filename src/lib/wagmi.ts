"use client";

import { createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    walletConnect({ projectId: process.env.PROJECT_ID as string }), // Get from WalletConnect Cloud
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});
