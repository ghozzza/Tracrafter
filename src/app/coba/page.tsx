"use client";

import { Button } from "@/components/ui/button";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { collateralAbi } from "@/lib/abi/collateralAbi";
import { useState } from "react";

export default function CobaPage() {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const { data: oracle, isLoading } = useReadContract({
    address: contractAddress,
    abi: collateralAbi,
    functionName: "oracle",
  });

  const { writeContract, data: txHash } = useWriteContract();
  const { isLoading: isTxLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const [token1, setToken1] = useState("");
  const [token2, setToken2] = useState("");
  const [ltv, setLtv] = useState("");

  const handleCreatePool = () => {
    writeContract({
      address: contractAddress,
      abi: collateralAbi,
      functionName: "createLendingPool",
      args: [token1, token2, BigInt(ltv)], 
    });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-xl font-semibold">Lending Pool Factory</h1>

      <p className="mt-4">
        Oracle Address: {isLoading ? "Loading..." : oracle?.toString()}
      </p>

      <input
        type="text"
        placeholder="Token 1 Address"
        value={token1}
        onChange={(e) => setToken1(e.target.value)}
        className="p-2 mt-4 border border-gray-500 rounded bg-gray-800 text-white"
      />
      <input
        type="text"
        placeholder="Token 2 Address"
        value={token2}
        onChange={(e) => setToken2(e.target.value)}
        className="p-2 mt-2 border border-gray-500 rounded bg-gray-800 text-white"
      />
      <input
        type="number"
        placeholder="LTV (Loan-to-Value)"
        value={ltv}
        onChange={(e) => setLtv(e.target.value)}
        className="p-2 mt-2 border border-gray-500 rounded bg-gray-800 text-white"
      />

      <Button
        variant="default"
        size="lg"
        className="mt-4"
        onClick={handleCreatePool}
        disabled={isTxLoading}
      >
        {isTxLoading ? "Processing..." : "Create Lending Pool"}
      </Button>


      {isSuccess && (
        <p className="mt-4 text-green-400">
          Transaction Successful! Hash: {txHash}
        </p>
      )}
    </div>
  );
}
