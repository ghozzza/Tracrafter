"use client";

import { Button } from "@/components/ui/button";
import  Navbar  from "@/components/navbar";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { abi } from "@/lib/abi";

const LandingPage = () => {
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
    <div>
      <Navbar />
      <div>
        <Button onClick={handleTransaction} variant="default" size="lg">
          Get Started
        </Button>
        {balance?.toString()}
      </div>
    </div>
  );
};

export default LandingPage;
