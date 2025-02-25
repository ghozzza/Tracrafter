"use client";
import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { mockErc20Abi } from "@/lib/abi/mockErc20Abi";
import { poolAbi } from "@/lib/abi/poolAbi";
import { lendingPool, mockUsdc } from "@/constants/addresses";
import { useSupplyAssets, useSupplyShares } from "@/hooks/useTotalSuppy";

const useUSDCBalance = () => {
  const { address } = useAccount();
  const [balance, setBalance] = useState("0.00");

  const { data } = useReadContract({
    abi: mockErc20Abi,
    address: mockUsdc,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    if (data) {
      setBalance(parseFloat(formatUnits(BigInt(data as bigint), 6)).toFixed(2));
    }
  }, [data]);

  return balance;
};

const useBorrowBalance = () => {
  const { address } = useAccount();
  const { data: borrowBalance } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "userBorrowShares",
    args: [address],
  });

  return borrowBalance ? (Number(borrowBalance) / 1e6).toFixed(2) : "0.00";
};

const AmountInput = ({ value , onChange, token, balance, label } : any) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2 border rounded-lg px-4 py-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border-none focus:ring-0"
          placeholder="0.00"
        />
        <span className="text-gray-500">{token}</span>
      </div>
      <span className="text-sm text-gray-400">
        Balance: {balance} {token}
      </span>
    </div>
  );
};

export const RepayDialog = () => {
  const supplyShares = useSupplyShares();
  const supplyAssets = useSupplyAssets();

  console.log("supplyShares " + supplyShares);
  console.log("supplyAssets " + supplyAssets);

  const [usdcAmount, setUsdcAmount] = useState("0");
  const [selectedPercentage, setSelectedPercentage] = useState("100");

  const usdcBalance = useUSDCBalance();
  const borrowBalance = useBorrowBalance();

  const { writeContract } = useWriteContract();

  const handleApproveAndRepay = async () => {
    if (!usdcAmount) return;
    const amount = Number(parseUnits(usdcAmount, 6));

    const result = Math.round((amount * supplyAssets) / supplyShares + amount);
    console.log("result " + result);

    try {
      console.log("Approving USDC spending...");
      await writeContract({
        address: mockUsdc,
        abi: mockErc20Abi,
        functionName: "approve",
        args: [lendingPool, BigInt(result)],
      });

      console.log(typeof amount);
      console.log(amount);

      console.log("Approval successful, proceeding to repay...");

      await writeContract({
        address: lendingPool,
        abi: poolAbi,
        functionName: "repayByPosition",
        args: [amount],
      });

      console.log("Repayment successful!");
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Repay</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Repay Loan</DialogTitle>
        <AmountInput
          value={usdcAmount}
          onChange={setUsdcAmount}
          token="USDC"
          balance={usdcBalance}
          label="Amount"
        />
        <div className="flex justify-between items-center mt-4">
          <span className="text-gray-400">
            Borrow Balance: {borrowBalance} USDC
          </span>
          <Select
            onValueChange={setSelectedPercentage}
            value={selectedPercentage}
          >
            <SelectTrigger className="w-[100px] bg-transparent border-gray-700">
              <SelectValue placeholder="100%" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25%</SelectItem>
              <SelectItem value="50">50%</SelectItem>
              <SelectItem value="75">75%</SelectItem>
              <SelectItem value="100">100%</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleApproveAndRepay} className="w-full mt-4">
          Approve & Repay
        </Button>
      </DialogContent>
    </Dialog>
  );
};
