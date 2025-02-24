import React from "react";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { poolAbi } from "@/lib/abi/poolAbi";

const BorrowToken = () => {
  const { address } = useAccount();

  const { data: userSupply, isLoading: isReadingSupply } = useReadContract({
    abi: poolAbi,
    address: "0x0e97Aee95F59B4e5738Be38300364d39297aa991",
    functionName: "userSupplyShares",
    args: [address],
  });

  return (
    <div>
      {isReadingSupply ? (
        <span className="text-gray-400 text-xs">Loading supply...</span>
      ) : (
        <span className="text-gray-400 text-xs">
          {userSupply ? (Number(userSupply) / 1e6).toFixed(2) : "0.000000"}{" "}
          shares
        </span>
      )}
    </div>
  );
};

export default BorrowToken;
