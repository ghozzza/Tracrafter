"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PiggyBank, LineChart, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const ButtonConnectWallet = dynamic(() => import("./ui/ButtonConnectWallet"), {
  ssr: false,
});

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group relative overflow-hidden py-2"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-green-500/10 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      {children}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 animate-gradient-x bg-gradient-to-r from-blue-400 via-green-500 to-yellow-500" />
      )}
    </Link>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('nav')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  const closeMenu = (): void => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d21] to-[#15162c]" />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md border-b border-white/10" />

      {/* Main navbar content */}
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
          <div className="hidden md:flex items-center space-x-6">
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
        
        <div className="hidden md:flex items-center space-x-6">
          <ButtonConnectWallet />
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
          aria-label="Toggle menu"
          type="button"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeMenu}
              role="presentation"
            />
            <div 
              className="fixed top-0 right-0 h-full w-64 bg-[#0d0d21] transform transition-transform duration-300 ease-in-out border-l border-white/10"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile menu"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/10">
                <span className="text-lg font-semibold text-white">Menu</span>
                <button
                  onClick={closeMenu}
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Close menu"
                  type="button"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <NavLink href="/borrow" onClick={closeMenu}>
                  <PiggyBank className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Borrow</span>
                </NavLink>

                <NavLink href="/lending" onClick={closeMenu}>
                  <LineChart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Lending</span>
                </NavLink>

                <div className="pt-4 border-t border-white/10">
                  <ButtonConnectWallet />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;