"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet2 } from "lucide-react";

const ButtonConnectWallet = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        openConnectModal,
        openAccountModal,
        mounted,
      }) => {
        return (
          <div className="relative group">
            {!account ? (
              <button
                onClick={openConnectModal}
                className="relative z-10 px-6 py-3 rounded-full
                  bg-gradient-to-r from-[#0057a3] via-[#008f68] to-[#ffd700]
                  animate-gradient-x bg-[length:200%_100%]
                  text-white font-medium
                  transform transition-all duration-1500 
                  hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]
                  hover:scale-[1.02]
                  border border-[#3f3f9f]/30"
              >
                <div className="flex items-center space-x-2">
                  <Wallet2 className="w-5 h-5" />
                  <span>Connect Wallet</span>
                </div>
              </button>
            ) : (
              <button
                onClick={openAccountModal}
                className="relative z-10 px-6 py-3 rounded-full
                  bg-gradient-to-r from-[#0057a3] via-[#008f68] to-[#ffd700]
                  animate-gradient-x bg-[length:200%_100%]
                  text-white font-medium
                  transform transition-all duration-1500 
                  hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]
                  hover:scale-[1.02]
                  border border-[#3f3f9f]/30"
              >
                <div className="flex items-center space-x-2">
                  <span>{account?.displayName}</span>
                </div>
              </button>
            )}

            {/* Glow effect */}
            <div
              className="absolute inset-0 -z-10
                bg-gradient-to-r from-blue-600/20 via-green-600/20 to-yellow-600/20
                animate-gradient-x bg-[length:200%_100%]
                rounded-full blur-xl
                opacity-0 group-hover:opacity-100
                transition-opacity duration-500"
            />
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ButtonConnectWallet;
