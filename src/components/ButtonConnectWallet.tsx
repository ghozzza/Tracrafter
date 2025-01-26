import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const ButtonConnectWallet = () => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        return (
          <div className="relative group">
            <button
              onClick={openConnectModal}
              className="relative z-10 px-6 py-3 rounded-full 
              bg-gradient-to-r from-teal-400 to-blue-500 
              text-white font-semibold 
              transform transition-all duration-300 
              group-hover:scale-105 
              group-hover:shadow-2xl"
            >
              {account ? `Connected: ${account.displayName}` : "Connect Wallet"}
            </button>

            <div
              className="absolute inset-0 
              bg-gradient-to-r from-green-300 via-teal-500 to-blue-600 
              rounded-full 
              opacity-0 group-hover:opacity-100 
              transition-all duration-500 
              blur-sm 
              -z-10 
              bg-[length:400%_400%] 
              animate-gradient-border"
            ></div>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};