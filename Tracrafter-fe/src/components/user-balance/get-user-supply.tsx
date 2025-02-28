"use client";
import { useAccount, useBalance } from "wagmi";
import { useEffect, useState } from "react";

const WalletBalance = () => {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  const {
    data: balance,
    isError,
    isLoading,
  } = useBalance({
    address: address,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-4 rounded-lg">Loading wallet info...</div>;
  }

  if (!isConnected) {
    return (
      <div className="p-4 rounded-lg">Please connect your wallet first</div>
    );
  }

  if (isLoading) {
    return <div className="p-4 rounded-lg">Loading balance...</div>;
  }

  if (isError) {
    return <div className="p-4 rounded-lg">Error loading balance</div>;
  }

  return (
    <div className="text-sm text-gray-400">
      {balance?.formatted} {balance?.symbol}
    </div>
  );
};

export default WalletBalance;
