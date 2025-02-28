"use client";

import { useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
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
import { lendingPool, mockUsdc, priceFeed } from "@/constants/addresses";
import { priceAbi } from "@/lib/abi/price-abi";
import { ArrowDown, CreditCard, DollarSign, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useBorrowBalance } from "@/hooks/useBorrowBalance";
import { useWethBalance } from "@/hooks/useTokenBalance";

const AmountInput = ({
  value,
  onChange,
  token,
  balance,
  label,
  price,
  debtValue,
}: any) => {
  const wethBalance = useWethBalance();
  const borrowBalance = useBorrowBalance();
  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-700">{label}</h3>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Repay
          </Badge>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-medium"
            placeholder="0.00"
          />
          <div className="flex items-center gap-1 bg-slate-200 px-3 py-1 rounded-md">
            <DollarSign className="h-4 w-4 text-slate-700" />
            <span className="font-semibold text-slate-700">Shares</span>
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Position Balance: {balance} ${token}
          </span>
          <button
            className="text-xs p-1 text-blue-700 border border-blue-700 rounded-md hover:bg-blue-400"
            onClick={() => onChange(borrowBalance)}
          >
            max
          </button>
        </div>
        <span>
          Amount: {(value / price).toFixed(5)} {token}
        </span>
      </CardContent>
    </Card>
  );
};

export const RepaySelectedToken = (props: any) => {
  const [valueAmount, setValueAmount] = useState("0");
  const [isOpen, setIsOpen] = useState(false);
  const borrowBalance = useBorrowBalance(); // Use the imported hook
  const { writeContract, isPending } = useWriteContract();

  const { data: totalBorrowAssets } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "totalBorrowAssets",
    args: [],
  });

  const { data: totalBorrowShares } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "totalBorrowShares",
    args: [],
  });

  const { data: realPrice } = useReadContract({
    address: priceFeed,
    abi: priceAbi,
    functionName: "getPrice",
    args: [props.address, mockUsdc],
  });

  const debtEquals = () => {
    if (
      !totalBorrowAssets ||
      !totalBorrowShares ||
      !borrowBalance ||
      Number(totalBorrowShares) === 0
    ) {
      return 0;
    }
    return Number(
      (Number(borrowBalance) * Number(totalBorrowAssets)) /
        Number(totalBorrowShares)
    );
  };

  const handleApproveAndRepay = async () => {
    if (!valueAmount || Number.parseFloat(valueAmount) <= 0) {
      toast.error("Please enter a valid amount to repay");
      return;
    }

    const amount = Number(valueAmount) * 1e6;
    const result = Math.round(amount + amount);

    try {
      toast.loading("Approving USDC spending...");
      await writeContract({
        address: mockUsdc,
        abi: mockErc20Abi,
        functionName: "approve",
        args: [lendingPool, BigInt(result)],
      });

      toast.loading("Repaying loan...");
      await writeContract({
        address: lendingPool,
        abi: poolAbi,
        functionName: "repayWithSelectedToken",
        args: [BigInt(amount), props.address],
      });

      toast.dismiss();
      toast.success("Repayment successful!");
      setValueAmount("0");
      setIsOpen(false);
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.dismiss();
      toast.error("Repayment failed. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 rounded-lg">
          <ArrowDown className="mr-2 h-4 w-4" /> Repay
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-white to-slate-50 border-0 shadow-xl rounded-xl">
        <DialogHeader className="pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-blue-500" />
            <DialogTitle className="text-xl font-bold text-slate-800">
              Repay Loan
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <AmountInput
            value={valueAmount}
            onChange={setValueAmount}
            token={props.name}
            balance={props.balance}
            label="Repay Amount"
            price={realPrice ? Number(realPrice) / 1e6 : 1}
            debtValue={debtEquals()}
          />

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <div className="flex items-start">
              <div className="bg-blue-100 p-1 rounded-full mr-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="text-xs font-medium text-blue-700 mb-1">
                  Debt Information
                </h4>
                <p className="text-xs text-blue-600">
                  Debt: {borrowBalance} Shares
                  <br />
                  Equals to {debtEquals().toFixed(4)} USDC
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleApproveAndRepay}
            disabled={
              isPending || !valueAmount || Number.parseFloat(valueAmount) <= 0
            }
            className={`w-full h-12 text-base font-medium rounded-lg ${
              isPending
                ? "bg-slate-200 text-slate-500"
                : "bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Processing Repayment...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <ArrowDown className="mr-2 h-5 w-5" />
                <span>Repay {props.name}</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
