"use client";
import { useState } from "react";
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
import { mockErc20Abi } from "@/lib/abi/mockErc20Abi";
import { poolAbi } from "@/lib/abi/poolAbi";
import { lendingPool, mockWeth } from "@/constants/addresses";

const useWethBalance = () => {
  const { address } = useAccount();
  const { data } = useReadContract({
    abi: mockErc20Abi,
    address: mockWeth,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  return data
    ? parseFloat(formatUnits(BigInt(data as bigint), 18)).toFixed(2)
    : "0.00";
};

const AmountInput = ({ value, onChange, token, balance, label }: any) => {
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

export const WithdrawDialog = () => {
  const [wethAmount, setwethAmount] = useState("0");
  const wethBalance = useWethBalance();

  const { writeContract } = useWriteContract();

  const handleWithdraw = async () => {
    if (!wethAmount) return;
    const amount = BigInt(parseUnits(wethAmount, 18));
    console.log(amount);

    try {
      console.log("Menarik jaminan...");
      await writeContract({
        address: lendingPool,
        abi: poolAbi,
        functionName: "withdrawCollateral",
        args: [amount],
      });

      console.log("Penarikan berhasil!");
    } catch (error) {
      console.error("Penarikan gagal:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Withdraw</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Withdraw Collateral</DialogTitle>
        <AmountInput
          value={wethAmount}
          onChange={setwethAmount}
          token="weth"
          balance={wethBalance}
          label="Amount"
        />
        <Button onClick={handleWithdraw} className="w-full mt-4">
          Withdraw
        </Button>
      </DialogContent>
    </Dialog>
  );
};
