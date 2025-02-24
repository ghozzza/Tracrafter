"use client";

import { useAccount, useReadContract } from "wagmi";
import { erc20Abi } from "viem";
import { formatUnits } from "viem/utils";
import { useState, useEffect } from "react";

const USDC_CONTRACT = "0x373e1981F97607B4073Ee8bB23e3810CdAAAD1f8";

export default function USDCBalance() {
  const { address } = useAccount();
  const [balance, setBalance] = useState("0");

  const { data, isLoading, refetch } = useReadContract({
    abi: erc20Abi,
    address: USDC_CONTRACT,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    if (data) {
      setBalance(formatUnits(BigInt(data), 6)); // USDC memiliki 6 desimal
    }
  }, [data]);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <p className="text-sm text-gray-100">{balance} USDC</p>
      )}
    </div>
  );
}
