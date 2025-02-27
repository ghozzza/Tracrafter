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
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { poolAbi } from "@/lib/abi/poolAbi";
import { mockErc20Abi } from "@/lib/abi/mockErc20Abi";
import { lendingPool, mockWeth } from "@/constants/addresses";
import { ArrowRight, Loader2, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      if (!amount || Number.parseFloat(amount) <= 0) {
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
        <Button
          className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 rounded-lg"
          size="sm"
        >
          <Shield className="mr-1 h-4 w-4" /> Supply
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl rounded-xl">
        <DialogHeader className="pb-2 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-400" />
            <DialogTitle className="text-xl font-bold text-slate-200">
              Supply {token} as Collateral
            </DialogTitle>
          </div>
          {!hasPosition && (
            <DialogDescription className="mt-2 text-amber-300 bg-amber-900/30 p-2 rounded-lg border border-amber-700/50 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-amber-400" />
              You need to create a position before supplying collateral.
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Card className="border border-slate-700 bg-slate-800 shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-slate-300">
                  Supply Amount
                </h3>
                <Badge
                  variant="outline"
                  className="bg-emerald-900/50 text-emerald-300 border-emerald-700"
                >
                  Collateral
                </Badge>
              </div>

              <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-lg border border-slate-700">
                <Input
                  placeholder={`Enter amount of ${token} to supply`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isProcessing}
                  type="number"
                  min="0"
                  step="0.01"
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-medium text-slate-200"
                />
                <div className="flex items-center gap-1 bg-slate-700 px-3 py-1 rounded-md">
                  <span className="font-semibold text-slate-200">{token}</span>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-400 flex items-center">
                <ArrowRight className="h-3 w-3 mr-1 text-emerald-400" />
                Supplying assets as collateral enables borrowing and earns
                interest
              </div>
            </CardContent>
          </Card>

          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <h4 className="text-xs font-medium text-slate-300 mb-2">
              Transaction Steps:
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                    !hasPosition
                      ? "bg-emerald-900/70 text-emerald-300"
                      : "bg-emerald-600 text-slate-200"
                  }`}
                >
                  {hasPosition ? "✓" : "1"}
                </div>
                <span
                  className={
                    hasPosition
                      ? "text-slate-500 line-through"
                      : "text-slate-300"
                  }
                >
                  Create position
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full mr-2 flex items-center justify-center bg-emerald-900/70 text-emerald-300">
                  {hasPosition ? "1" : "2"}
                </div>
                <span className="text-slate-300">Approve token</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full mr-2 flex items-center justify-center bg-emerald-900/70 text-emerald-300">
                  {hasPosition ? "2" : "3"}
                </div>
                <span className="text-slate-300">Supply collateral</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSupply}
            disabled={isProcessing || !amount}
            className={`w-full h-12 text-base font-medium rounded-lg ${
              isProcessing
                ? "bg-slate-700 text-slate-400"
                : "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Processing Transaction...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Shield className="mr-2 h-5 w-5" />
                <span>{`Supply ${token} as Collateral`}</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
