"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet2 } from "lucide-react";

const ButtonConnectWallet = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openChainModal,
        openConnectModal,
        openAccountModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";

        if (!ready) {
          return (
            <div
              aria-hidden={true}
              className="opacity-0 pointer-events-none user-select-none"
            />
          );
        }

        if (!account || !chain) {
          return (
            <div className="relative group">
              <button
                onClick={openConnectModal}
                type="button"
                className="relative z-10 px-6 py-2 rounded-full bg-gradient-to-r from-[#b721ff] to-[#21d4fd] 
                  animate-gradient-x bg-[length:200%_100%] text-white font-medium transform transition-all duration-1500 
                  hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-[1.02] border border-[#3f3f9f]/30"
              >
                <div className="flex items-center space-x-2">
                  <Wallet2 className="w-5 h-5" />
                  <span>Connect Wallet</span>
                </div>
              </button>
              <div
                className="absolute inset-0 -z-10 bg-gradient-to-r from-[#b721ff]/20 to-[#21d4fd]/20 
                animate-gradient-x bg-[length:200%_100%] rounded-full blur-xl opacity-0 group-hover:opacity-100 
                transition-opacity duration-500"
              />
            </div>
          );
        }

        if (chain.unsupported) {
          return (
            <button
              onClick={openChainModal}
              type="button"
              className="relative z-10 px-6 py-2 rounded-full bg-red-500 text-white font-medium transition-all hover:bg-red-600"
            >
              Wrong network
            </button>
          );
        }

        return (
          <div className="relative group flex items-center space-x-4">
            <button
              onClick={openChainModal}
              type="button"
              className="flex items-center gap-1 relative z-10 p-2 rounded-full bg-gradient-to-r from-[#b721ff] to-[#21d4fd] 
                animate-gradient-x bg-[length:200%_100%] text-white font-medium transform transition-all duration-1500 
                hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-[1.02] border border-[#3f3f9f]/30"
            >
              {chain.hasIcon && chain.iconUrl && (
                <img
                  src={chain.iconUrl}
                  alt={chain.name || "Chain icon"}
                  className="w-4 h-4 rounded-full"
                  style={{ background: chain.iconBackground }}
                />
              )}
              <span>{chain.name}</span>
            </button>
            <button
              onClick={openAccountModal}
              type="button"
              className="relative z-10 px-5 py-2 rounded-full bg-gradient-to-r from-[#b721ff] to-[#21d4fd] 
                animate-gradient-x bg-[length:200%_100%] text-white font-medium transform transition-all duration-1500 
                hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-[1.02] border border-[#3f3f9f]/30"
            >
              <span>{account.displayName}</span>
              <span>
                {account.displayBalance ? ` (${account.displayBalance})` : ""}
              </span>
            </button>
            <div
              className="absolute inset-0 -z-10 bg-gradient-to-r from-[#b721ff]/20 to-[#21d4fd]/20 
              animate-gradient-x bg-[length:200%_100%] rounded-full blur-xl opacity-0 group-hover:opacity-100 
              transition-opacity duration-500"
            />
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ButtonConnectWallet;
