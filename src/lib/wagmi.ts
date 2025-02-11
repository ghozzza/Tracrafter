import { http } from "wagmi";
import { arbitrum, baseSepolia } from "wagmi/chains";
import { createConfig } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const config = getDefaultConfig({
  appName: "MyDApp",
  projectId: "YOUR_PROJECT_ID", // Get from WalletConnect Cloud
  chains: [baseSepolia, arbitrum],
  transports: {
    [baseSepolia.id]: http(),
    [arbitrum.id]: http(),
  },
});
