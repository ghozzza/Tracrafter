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
import { lendingPool, mockUsdc, priceFeed } from "@/constants/addresses";
import { useSupplyAssets, useSupplyShares } from "@/hooks/useTotalSuppy";
import { priceAbi } from "@/lib/abi/price-abi";

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

const AmountInput = ({
  value,
  onChange,
  token,
  balance,
  label,
  price,
}: any) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2 rounded-lg py-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border-none focus:ring-0"
          placeholder="0.00"
        />
        <span className="text-gray-500">Shares Debt</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-gray-400">
          Position Balance: {balance} ${token}
        </span>
        <span className="text-sm text-gray-400">
          Amount: {(value / price).toFixed(5)} {token}
        </span>
      </div>
    </div>
  );
};

export const RepaySelectedToken = (props: any) => {
  const supplyShares = useSupplyShares();
  const supplyAssets = useSupplyAssets();

  const [valueAmount, setValueAmount] = useState("0");
  const [selectedPercentage, setSelectedPercentage] = useState("100");

  const usdcBalance = useUSDCBalance();
  const borrowBalance = useBorrowBalance();

  const { writeContract } = useWriteContract();

  const debtEquals = () => {
    return Number(
      (Number(borrowBalance) * Number(totalBorrowAssets)) /
        Number(totalBorrowShares)
    );
  };

  const { data: realPrice } = useReadContract({
    address: priceFeed,
    abi: priceAbi,
    functionName: "getPrice",
    args: [props.address, mockUsdc],
  });
  /*********** Function */
  const handleApproveAndRepay = async () => {
    if (!valueAmount) return;
    const amount = Number(valueAmount) * 1e6;
    console.log(amount);
    console.log(valueAmount)
    console.log(realPrice);
    console.log(props.decimal);
    // 407917658
    const result = Math.round(amount + amount);

    try {
      console.log("Approving USDC spending...");
      await writeContract({
        address: mockUsdc,
        abi: mockErc20Abi,
        functionName: "approve",
        args: [lendingPool, BigInt(result)],
      });
      console.log("Approval successful, proceeding to repay...");

      await writeContract({
        address: lendingPool,
        abi: poolAbi,
        functionName: "repayWithSelectedToken",
        args: [BigInt(amount), props.address],
      });

      console.log("Repayment successful!");
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Repay</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Repay Loan</DialogTitle>
        <AmountInput
          value={valueAmount}
          onChange={setValueAmount}
          token={props.name}
          balance={props.balance}
          label="Amount"
          price={realPrice ? Number(realPrice) / 1e6 : 1}
        />
        <div className="flex justify-between items-center mt-4">
          <span className="text-gray-400">
            Debt: {borrowBalance} Shares
            <br />
            Equals to {debtEquals().toFixed(3)} USDC
          </span>

        </div>
        <Button onClick={handleApproveAndRepay} className="w-full mt-4">
          Repay
        </Button>
      </DialogContent>
    </Dialog>
  );
};
