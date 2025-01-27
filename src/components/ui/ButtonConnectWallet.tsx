"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { Wallet2, LineChart, PiggyBank } from "lucide-react";
import { usePathname } from "next/navigation";

const ButtonConnectWallet: React.FC = () => {
  return (
    <ConnectButton.Custom>
      {({ account, openConnectModal, mounted }) => {
        const ready = mounted;
        return (
          <div className="relative group">
            <button
              onClick={openConnectModal}
              className="relative z-10 px-6 py-3 rounded-xl
                bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                animate-gradient-x bg-[length:200%_100%]
                text-white font-semibold 
                transform transition-all duration-300 
                hover:shadow-lg hover:shadow-purple-500/25
                group-hover:scale-105 
                backdrop-blur-sm"
              disabled={!ready}
            >
              <div className="flex items-center space-x-2">
                <Wallet2 className="w-5 h-5" />
                <span>
                  {account ? `${account.displayName}` : "Connect Wallet"}
                </span>
              </div>
            </button>

            <div
              className="absolute inset-0 
                bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                animate-gradient-x bg-[length:200%_100%]
                rounded-xl 
                opacity-0 group-hover:opacity-100 
                transition-all duration-500 
                blur-xl 
                -z-10"
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
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/10 to-indigo-500/0 
        opacity-0 group-hover:opacity-100 transition-opacity" />
      {children}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 
          animate-gradient-x bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600" />
      )}
    </Link>
  );
};

export const NavbarWallet: React.FC = () => {
  return (
    <nav className="relative z-50">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 animate-gradient-x bg-[length:200%_100%]" />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md border-b border-white/10" />
      <div className="relative flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        <div className="flex items-center space-x-8">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 
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

// Add this to your global CSS or Tailwind config
const style = `
@keyframes gradient-x {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient-x {
  animation: gradient-x 15s ease infinite;
}
`;

export default NavbarWallet;
