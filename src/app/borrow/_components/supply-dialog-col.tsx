"use client";

import { useState, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { parseUnits } from "viem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { poolAbi } from "@/lib/abi/poolAbi";
import { mockErc20Abi } from "@/lib/abi/mockErc20Abi";
import { lendingPool, mockWeth } from "@/constants/addresses";
import { Loader2 } from "lucide-react";

interface SupplyDialogProps {
  token: string | undefined;
}

export default function SupplyDialogCol({ token }: SupplyDialogProps) {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [hasPosition, setHasPosition] = useState(false);

  const { data: positionAddress, refetch: refetchPosition } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "addressPosition",
    args: [
      typeof window !== "undefined"
        ? (window as any).ethereum?.selectedAddress
        : undefined,
    ],
  });

  useEffect(() => {
    if (
      positionAddress &&
      positionAddress !== "0x0000000000000000000000000000000000000000"
    ) {
      setHasPosition(true);
    } else {
      setHasPosition(false);
    }
  }, [positionAddress]);

  const {
    data: approveHash,
    isPending: isApprovePending,
    writeContract: approveTransaction,
  } = useWriteContract();

  const {
    data: supplyHash,
    isPending: isSupplyPending,
    writeContract: supplyTransaction,
  } = useWriteContract();

  const {
    data: positionHash,
    isPending: isPositionPending,
    writeContract: createPositionTransaction,
  } = useWriteContract();

  const { isLoading: isApproveLoading } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const { isLoading: isSupplyLoading, isSuccess } =
    useWaitForTransactionReceipt({
      hash: supplyHash,
    });

  const { isLoading: isPositionLoading } = useWaitForTransactionReceipt({
    hash: positionHash,
  });

  const handleSupply = async () => {
    try {
      if (!amount || parseFloat(amount) <= 0) {
        toast.error("Please enter a valid amount to supply");
        return;
      }

      const decimals = 18;
      const parsedAmount = parseUnits(amount, decimals);

      if (!hasPosition) {
        toast.loading("Creating position...");

        await createPositionTransaction({
          address: lendingPool,
          abi: poolAbi,
          functionName: "createPosition",
          args: [],
        });

        toast.dismiss();
        toast.success("Position created successfully!");
        await refetchPosition();
      }

      toast.loading("Approving token for supply...");

      await approveTransaction({
        abi: mockErc20Abi,
        address: mockWeth,
        functionName: "approve",
        args: [lendingPool, parsedAmount],
      });

      toast.dismiss();
      toast.loading(`Supplying ${token} as collateral...`);

      await supplyTransaction({
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

  const isProcessing =
    isApprovePending ||
    isSupplyPending ||
    isApproveLoading ||
    isSupplyLoading ||
    isPositionPending ||
    isPositionLoading;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-500 to-teal-400 text-white">
          Supply {token}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate-100">
        <DialogHeader>
          <DialogTitle>Supply {token} as Collateral</DialogTitle>
          {!hasPosition && (
            <DialogDescription>
              You need to create a position before supplying collateral.
            </DialogDescription>
          )}
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
