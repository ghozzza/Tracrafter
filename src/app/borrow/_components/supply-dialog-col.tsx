"use client";

import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { poolAbi } from "@/lib/abi/poolAbi";
import { lendingPool } from "@/constants/addresses";
import { Loader2 } from "lucide-react";

interface SupplyDialogProps {
  token: string;
}

export default function SupplyDialog({ token }: SupplyDialogProps) {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: writeHash,
    writeContract,
    isPending: isWritePending,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: writeHash,
  });

  const handleSupply = async () => {
    try {
      if (!amount || parseFloat(amount) <= 0) {
        toast.error("Please enter a valid amount to supply");
        return;
      }

      const decimals = 18; 
      const parsedAmount = parseUnits(amount, decimals);

      console.log("🏦 Supplying collateral...");
      toast.loading(`Supplying ${token} as collateral...`);

      await writeContract({
        address: lendingPool,
        abi: poolAbi,
        functionName: "supplyCollateralByPosition",
        args: [parsedAmount],
      });
      toast.dismiss();
      toast.success(`Successfully supplied ${amount} ${token} as collateral!`);
      setAmount("");
    } catch (error) {
      console.error("Supply error:", error);
      toast.dismiss();
      toast.error("Failed to supply collateral");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setIsOpen(false);
    }
  }, [isSuccess]);

  const isProcessing = isWritePending || isConfirming;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-500 to-teal-400 text-white">
          Supply {token}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Supply {token} as Collateral</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2 pt-4">
            <p className="text-sm text-slate-400">
              Supply your asset as collateral.
            </p>
            <div className="flex items-center space-x-2">
              <Input
                placeholder={`Enter amount of ${token} to supply`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isProcessing}
                type="number"
                min="0"
                step="0.01"
              />
              <span>{token}</span>
            </div>
          </div>

          <Button
            onClick={handleSupply}
            disabled={isProcessing || !amount}
            className={`w-full ${
              isProcessing ? "bg-green-400" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              `Supply ${token}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
