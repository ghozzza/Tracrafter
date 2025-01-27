"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { Wallet2, LineChart, PiggyBank } from "lucide-react";
import { usePathname } from "next/navigation";

const ButtonConnectWallet = () => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        return (
          <div className="relative group">
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
                <span>
                  {account ? `${account.displayName}` : "Connect Wallet"}
                </span>
              </div>
            </button>

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

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className="flex items-center space-x-2 text-gray-300 hover:text-white 
        transition-colors group relative overflow-hidden py-2"
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-green-500/10 to-yellow-500/0 
        opacity-0 group-hover:opacity-100 transition-opacity"
      />
      {children}
      {isActive && (
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 
          animate-gradient-x bg-gradient-to-r from-blue-400 via-green-500 to-yellow-500"
        />
      )}
    </Link>
  );
};

export const NavbarWallet: React.FC = () => {
  return (
    <nav className="relative z-50">
      {/* Updated background to match landing page */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d21] to-[#15162c]" />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md border-b border-white/10" />
      <div className="relative flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        <div className="flex items-center space-x-8">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-green-500 to-yellow-400 
              animate-gradient-x bg-[length:200%_100%] 
              bg-clip-text text-transparent 
              hover:opacity-80 transition-opacity"
          >
            MyDApp
          </Link>

          <div className="flex items-center space-x-6">
            <NavLink href="/borrow">
              <PiggyBank className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Borrow</span>
            </NavLink>

            <NavLink href="/lending">
              <LineChart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Lending</span>
            </NavLink>
          </div>
        </div>

        <ButtonConnectWallet />
      </div>
    </nav>
  );
};


export default NavbarWallet;
