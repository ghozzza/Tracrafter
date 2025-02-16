"use client";
import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { factoryAbi } from "@/lib/abi/collateralAbi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface FormState {
  token1: string;
  token2: string;
  ltv: string;
}

export default function CreatePool() {
  const [formData, setFormData] = useState<FormState>({
    token1: "",
    token2: "",
    ltv: "0",
  });

  const {
    data: hashTransaction,
    isPending: isTransactionPending,
    writeContract: writeTransaction,
  } = useWriteContract();

  const {
    isLoading: isTransactionLoading,
    isSuccess,
    error: waitError,
  } = useWaitForTransactionReceipt({
    hash: hashTransaction,
    onSuccess(data: any) {
      toast.dismiss();
      toast.success("Transaction Successful!", {
        description: (
          <div className="mt-2">
            <p className="text-sm text-gray-500">Transaction Hash:</p>
            <a
              href={`https://pacific-explorer.sepolia-testnet.manta.network/tx/${hashTransaction}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:text-blue-600 break-all"
            >
              {hashTransaction}
            </a>
          </div>
        ),
        duration: 8000,
      });
    },
    onError(error: { message: any; }) {
      toast.error("Transaction Failed", {
        description: error.message || "An unknown error occurred",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCreatePool = async () => {
    const toastId = toast.loading("Creating lending pool...", {
      duration: Infinity,
    });

    try {
      console.log("Sending transaction...");
      const response = await writeTransaction({
        abi: factoryAbi,
        address: "0x5d863542d39F1A6937F212Efa1678E7609b71156" as `0x${string}`,
        functionName: "createLendingPool",
        args: [formData.token1, formData.token2, BigInt(formData.ltv)],
      });

      console.log("Transaction response:", response);

      // Cek apakah response berisi hash transaksi
      if (!response?.hash) {
        throw new Error("Transaction failed or no hash returned.");
      }

      toast.dismiss(toastId);
      toast.success("Transaction Submitted!", {
        description: (
          <div className="mt-2">
            <p className="text-sm text-gray-500">Transaction Hash:</p>
            <a
              href={`https://pacific-explorer.sepolia-testnet.manta.network/tx/${response.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:text-blue-600 break-all"
            >
              {response.hash}
            </a>
          </div>
        ),
        duration: 8000,
      });
    } catch (error) {
      console.error("Transaction error:", error);
      toast.dismiss(toastId);
      toast.error("Failed to create pool", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const isLoading = isTransactionPending || isTransactionLoading;
  const isFormValid =
    formData.token1 && formData.token2 && Number(formData.ltv) > 0;

  return (
    <div className="space-y-4 text-white">
      <div className="space-y-2">
        <Label htmlFor="token1">Token 1 Address</Label>
        <Input
          id="token1"
          value={formData.token1}
          onChange={handleInputChange}
          placeholder="Enter token 1 address"
          className="bg-gray-800/50 border-gray-700"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="token2">Token 2 Address</Label>
        <Input
          id="token2"
          value={formData.token2}
          onChange={handleInputChange}
          placeholder="Enter token 2 address"
          className="bg-gray-800/50 border-gray-700"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ltv">LTV (Loan-to-Value Ratio)</Label>
        <Input
          id="ltv"
          type="number"
          value={formData.ltv}
          onChange={handleInputChange}
          placeholder="Enter LTV percentage"
          className="bg-gray-800/50 border-gray-700"
          disabled={isLoading}
          min="0"
          step="1"
        />
      </div>

      <Button
        onClick={handleCreatePool}
        disabled={isLoading || !isFormValid}
        className="w-full relative bg-[#2ea043] hover:bg-[#2c974b] text-white border-none"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Transaction...
          </div>
        ) : (
          "Create Lending Pool"
        )}
      </Button>

      {isLoading && (
        <p className="text-sm text-gray-400 text-center">
          Please wait while your transaction is being processed
        </p>
      )}
    </div>
  );
}
