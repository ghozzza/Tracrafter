"use client";
import { poolAbi } from "@/lib/abi/poolAbi";
import { useAccount, useReadContract } from "wagmi";
import { lendingPool } from "@/constants/addresses";

export const BorrowBalance = () => {
  const { address, isConnected } = useAccount();
  const { data: borrowBalance } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "userBorrowShares",
    args: [address],
  });

  return (
    <div>
      <p className="text-gray-400 text-xs">
        {borrowBalance ? (Number(borrowBalance) / 1e6).toFixed(2) : "0.00"}{" "}
      </p>
    </div>
  );
};
