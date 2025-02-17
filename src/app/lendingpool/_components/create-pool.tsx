"use client";
import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { factoryAbi } from "@/lib/abi/collateralAbi";

const TOKEN_OPTIONS = [
  { name: "WETH", address: "0xa7A93C5F0691a5582BAB12C0dE7081C499aECE7f" },
  { name: "WBTC", address: "0xC014F158EbADce5a8e31f634c0eb062Ce8CDaeFe" },
  { name: "PEPE", address: "0x1E713E704336094585c3e8228d5A8d82684e4Fb0" },
  { name: "MANTA", address: "0xe2e80f81589c80cb1d20a7846a350644281e0177" },
];

const USDC_ADDRESS = "0xA61Eb0D33B5d69DC0D0CE25058785796296b1FBd";

export default function CreatePool() {
  const [token1, setToken1] = useState("");
  const [ltv, setLtv] = useState("");

  const {
    data: hashTransaction,
    isPending: isTransactionPending,
    writeContract: writeTransaction,
  } = useWriteContract();

  const { isLoading: isTransactionLoading, isSuccess } =
    useWaitForTransactionReceipt({
      hash: hashTransaction,
    });

  const handleCreatePool = async () => {
    await writeTransaction({
      abi: factoryAbi,
      address: "0x5d863542d39F1A6937F212Efa1678E7609b71156",
      functionName: "createLendingPool",
      args: [token1, USDC_ADDRESS, BigInt(ltv)], // USDC is fixed as token2
    });
  };

  useEffect(() => {
    if (isSuccess) {
      // Reset form to default values after successful transaction
      setToken1("");
      setLtv("");
    }
  }, [isSuccess]);

  const isButtonDisabled = isTransactionPending || isTransactionLoading;

  return (
    <div className="space-y-4 text-white">
      <Label htmlFor="token1">Token 1</Label>
      <Select
        onValueChange={(value) => setToken1(value)}
        disabled={isButtonDisabled}
        value={token1}
      >
        <SelectTrigger className="bg-gray-800/50 border-gray-700">
          <SelectValue placeholder="Select Token 1" />
        </SelectTrigger>
        <SelectContent>
          {TOKEN_OPTIONS.map((token) => (
            <SelectItem key={token.name} value={token.address}>
              {token.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label htmlFor="token2">Token 2</Label>
      <Input
        id="token2"
        value="USDC"
        disabled
        className="bg-gray-800/50 border-gray-700 text-white"
      />

      <Label htmlFor="ltv">LTV</Label>
      <Input
        id="ltv"
        type="number"
        value={ltv}
        onChange={(e) => setLtv(e.target.value)}
        disabled={isButtonDisabled}
        placeholder="1-70"
      />

      <Button onClick={handleCreatePool} disabled={isButtonDisabled}>
        {isButtonDisabled ? "Processing..." : "Create Lending Pool"}
      </Button>

      {isSuccess && hashTransaction && (
        <div className="mt-4">
          <p className="text-sm text-gray-400">Transaction Hash:</p>
          <a
            href={`https://pacific-explorer.sepolia-testnet.manta.network/tx/${hashTransaction}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:text-blue-600 break-all"
          >
            {hashTransaction}
          </a>
        </div>
      )}
    </div>
  );
}
