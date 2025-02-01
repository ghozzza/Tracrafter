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
        
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <div className="relative group">
                    <button
                      onClick={openConnectModal}
                      type="button"
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
                    <div className="absolute inset-0 -z-10
                      bg-gradient-to-r from-blue-600/20 via-green-600/20 to-yellow-600/20
                      animate-gradient-x bg-[length:200%_100%]
                      rounded-full blur-xl
                      opacity-0 group-hover:opacity-100
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
                    className="relative z-10 px-6 py-3 rounded-full
                      bg-red-500
                      text-white font-medium
                      transform transition-all
                      hover:bg-red-600"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="relative group">
                  <button
                    onClick={openAccountModal}
                    type="button"
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
                      <span>{account.displayName}</span>
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginLeft: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                  <div className="absolute inset-0 -z-10
                    bg-gradient-to-r from-blue-600/20 via-green-600/20 to-yellow-600/20
                    animate-gradient-x bg-[length:200%_100%]
                    rounded-full blur-xl
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-500"
                  />
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ButtonConnectWallet;