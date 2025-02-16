"use client";
import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { factoryAbi } from "@/lib/abi/collateralAbi";

export default function CreatePool() {
  const [token1, setToken1] = useState("");
  const [token2, setToken2] = useState("");
  const [ltv, setLtv] = useState("0");

  const {
    data: hashTransction,
    isPending: isTransctionPending,
    writeContract: writeTransaction,
  } = useWriteContract();

  const { isLoading: isTransactionLoading, isSuccess } =
    useWaitForTransactionReceipt({
      hash: hashTransction,
    });

  const handleCreatePool = async () => {
    await writeTransaction({
      abi: factoryAbi,
      address: "0x5d863542d39F1A6937F212Efa1678E7609b71156",
      functionName: "createLendingPool",
      args: [token1, token2, BigInt(ltv)], // Convert LTV to BigInt
    });
  };

  const isButtonDisabled = isTransctionPending || isTransactionLoading;

  return (
    <div className="space-y-4 text-white">
      <Label htmlFor="token1">Token 1 Address</Label>
      <Input
        id="token1"
        value={token1}
        onChange={(e) => setToken1(e.target.value)}
        disabled={isButtonDisabled} // Disable input while transaction is pending
      />
      <Label htmlFor="token2">Token 2 Address</Label>
      <Input
        id="token2"
        value={token2}
        onChange={(e) => setToken2(e.target.value)}
        disabled={isButtonDisabled} // Disable input while transaction is pending
      />
      <Label htmlFor="ltv">LTV</Label>
      <Input
        id="ltv"
        type="number"
        value={ltv}
        onChange={(e) => setLtv(e.target.value)}
        disabled={isButtonDisabled} // Disable input while transaction is pending
      />
      <Button
        onClick={handleCreatePool}
        disabled={isButtonDisabled} // Disable button while transaction is pending
      >
        {isButtonDisabled ? "Processing..." : "Create Lending Pool"}
      </Button>

      {/* Display transaction hash after success */}
      {isSuccess && hashTransction && (
        <div className="mt-4">
          <p className="text-sm text-gray-400">Transaction Hash:</p>
          <a
            href={`https://pacific-explorer.sepolia-testnet.manta.network/tx/${hashTransction}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:text-blue-600 break-all"
          >
            {hashTransction}
          </a>
        </div>
      )}
    </div>
  );
}
