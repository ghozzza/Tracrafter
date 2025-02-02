"use client";

import { Button } from "@/components/ui/button";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { abi } from "@/lib/abi";

export default function LandingPage() {
  const {
    data: hashTransction,
    isPending: isTransctionPending,
    writeContract: writeTransaction,
  } = useWriteContract();
  const { isLoading: isTransactionLoading } = useWaitForTransactionReceipt({
    hash: hashTransction,
  });
  const handleTransaction = async () => {
    await writeTransaction({
      abi: abi,
      address: "0x0ff609e5cc4ed4c967dac6584685183674cbaa24",
      functionName: "transfer",
      args: ["0x61F2B7781b3cb4B8eB77FC1aFd4F23179303AD66", 0],
    });
  };

  const { data: balance } = useReadContract({
    address: "0x0ff609e5cc4ed4c967dac6584685183674cbaa24",
    abi: abi,
    functionName: "balanceOf",
    args: ["0x61F2B7781b3cb4B8eB77FC1aFd4F23179303AD66"],
  });

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
      <Button onClick={handleTransaction} variant="default" size="lg">
        Get Started
      </Button>
      <p className="mt-4">{balance?.toString()}</p>
      <h1 className="text-xl font-semibold">Hello</h1>
    </div>
  );
}
