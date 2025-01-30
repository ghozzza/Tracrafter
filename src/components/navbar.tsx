"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { darkTheme, getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, baseSepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import NavbarWallet from "./ui/NavbarWallet";

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },

});

const queryClient = new QueryClient();

export const Navbar = () => {
  return (
    <NavbarWallet />
  )
}
