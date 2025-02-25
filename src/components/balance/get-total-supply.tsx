"use client";
import { poolAbi } from "@/lib/abi/poolAbi";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { lendingPool } from "@/constants/addresses";

export const SupplyShares = () => {
  const { address, isConnected } = useAccount();
  const { data: supplyShares } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "totalSupplyShares",
    args: [],
  });

  return (
    <div>
      <p className="text-gray-400 text-xs">
        {supplyShares ? (Number(supplyShares) / 1e6).toFixed(2) : "0.00"} shares
      </p>
    </div>
  );
};

export const SupplyAssets = () => {
  const { address, isConnected } = useAccount();
  const { data: supplyAssets } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "totalSupplyAssets",
    args: [],
  });

  return (
    <div>
      <p className="text-gray-400 text-xs">
        {supplyAssets ? (Number(supplyAssets) / 1e6).toFixed(2) : "0.00"} shares
      </p>
    </div>
  );
};
export const BorrowShares = () => {
  const { address, isConnected } = useAccount();
  const { data: borrowShares } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "totalBorrowShares",
    args: [],
  });

  return (
    <div>
      <p className="text-gray-400 text-xs">
        {borrowShares ? (Number(borrowShares) / 1e6).toFixed(2) : "0.00"} shares
      </p>
    </div>
  );
};
