"use client";
import React, { useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockErc20Abi } from "@/lib/abi/mockErc20Abi";
import { Address } from "viem";
import { ghoza, mockWeth } from "@/constants/addresses";

const MOCK_WETH_ADDRESS: Address = mockWeth;

const MintMockWBTC = () => {
  const [mintAmount, setMintAmount] = useState<string>("");
  const address: Address = ghoza;

  const { data: txHash, writeContract } = useWriteContract();
  const { isLoading: isWaitingForTx } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleMint = async () => {
    if (!mintAmount || isNaN(Number(mintAmount)) || Number(mintAmount) <= 0) {
      alert("Masukkan jumlah token yang valid!");
      return;
    }

    if (!address) {
      alert("Hubungkan wallet terlebih dahulu!");
      return;
    }

    const mintAmountBigInt = BigInt(Number(mintAmount) * 10 ** 18); // WBTC = 8 decimals

    try {
      console.log(`⏳ Minting ${mintAmount} WBTC ke ${address}...`);
      await writeContract({
        abi: mockErc20Abi,
        address: MOCK_WETH_ADDRESS,
        functionName: "mint",
        args: [address, mintAmountBigInt], // Mint ke pengguna
      });

      console.log(`✅ Mint transaction sent!`);
    } catch (error) {
      console.error("❌ Minting failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold">Mint Mock WBTC</h1>
      <p className="text-gray-400">Mint test WBTC tokens.</p>

      <Input
        type="number"
        placeholder="Enter amount"
        value={mintAmount}
        onChange={(e) => setMintAmount(e.target.value)}
        className="bg-gray-800 text-white border border-gray-600"
      />

      <Button
        onClick={handleMint}
        disabled={isWaitingForTx}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isWaitingForTx ? "Minting..." : "Mint WBTC"}
      </Button>

      {txHash && (
        <p className="text-sm text-gray-400">
          ✅ Minting Success!{" "}
          <a
            href={`https://testnet-explorer.riselabs.xyz/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline"
          >
            View on Explorer
          </a>
        </p>
      )}
    </div>
  );
};

export default MintMockWBTC;
