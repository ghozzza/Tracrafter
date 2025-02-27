"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { mockErc20Abi } from "@/lib/abi/mockErc20Abi";
import { poolAbi } from "@/lib/abi/poolAbi";
import { lendingPool, mockWeth } from "@/constants/addresses";
import { ArrowUpRight, Loader2, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const useWethBalance = () => {
  const { address } = useAccount();
  const { data } = useReadContract({
    abi: mockErc20Abi,
    address: mockWeth,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  return data
    ? Number.parseFloat(formatUnits(BigInt(data as bigint), 18)).toFixed(2)
    : "0.00";
};

const AmountInput = ({ value, onChange, token, balance, label }: any) => {
  return (
    <Card className="border border-slate-700 bg-slate-800 shadow-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-300">{label}</h3>
          <Badge
            variant="outline"
            className="bg-purple-900/50 text-purple-300 border-purple-700"
          >
            Withdraw
          </Badge>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-lg border border-slate-700">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-medium text-slate-200"
            placeholder="0.00"
          />
          <div className="flex items-center gap-1 bg-slate-700 px-3 py-1 rounded-md">
            <span className="font-semibold text-slate-200">
              ${token.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
          <span>Available balance</span>
          <span className="font-medium text-slate-300">
            ${balance} {token.toUpperCase()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export const WithdrawDialog = () => {
  const [wethAmount, setWethAmount] = useState("0");
  const [isOpen, setIsOpen] = useState(false);
  const wethBalance = useWethBalance();

  const { writeContract, isPending, isSuccess } = useWriteContract();

  const handleWithdraw = async () => {
    if (!wethAmount || Number.parseFloat(wethAmount) <= 0) {
      toast.error("Please enter a valid amount to withdraw");
      return;
    }

    const amount = BigInt(parseUnits(wethAmount, 18));

    try {
      toast.loading("Withdrawing collateral...");
      await writeContract({
        address: lendingPool,
        abi: poolAbi,
        functionName: "withdrawCollateral",
        args: [amount],
      });

      toast.dismiss();
      toast.success("Withdrawal successful!");
      setWethAmount("0");
      setIsOpen(false);
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast.dismiss();
      toast.error("Withdrawal failed. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 rounded-lg border-0"
          size="sm"
        >
          <ArrowUpRight className="mr-1 h-4 w-4" /> Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl rounded-xl max-w-md w-full mx-auto">
        <DialogHeader className="pb-2 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-6 w-6 text-purple-400" />
            <DialogTitle className="text-xl font-bold text-slate-200">
              Withdraw Collateral
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <AmountInput
            value={wethAmount}
            onChange={setWethAmount}
            token="weth"
            balance={wethBalance}
            label="Withdraw Amount"
          />

          <div className="bg-gray-800/50 p-3 rounded-lg border border-purple-800/50">
            <div className="flex items-start">
              <div className="bg-purple-900/60 p-1 rounded-full mr-2">
                <Wallet className="h-4 w-4 text-purple-300" />
              </div>
              <div>
                <h4 className="text-xs font-medium text-purple-300 mb-1">
                  Withdrawal Information
                </h4>
                <p className="text-xs text-slate-400">
                  Withdrawing collateral may affect your borrowing capacity.
                  Ensure you maintain a healthy position to avoid liquidation.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleWithdraw}
            disabled={
              isPending || !wethAmount || Number.parseFloat(wethAmount) <= 0
            }
            className={`w-full h-12 text-base font-medium rounded-lg ${
              isPending
                ? "bg-slate-700 text-slate-400"
                : "bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Processing Withdrawal...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <ArrowUpRight className="mr-2 h-5 w-5" />
                <span>Withdraw WETH</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
