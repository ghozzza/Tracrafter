"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BorrowDialog from "./borrow-dialog";
import { useReadContract } from "wagmi";
import { lendingPool } from "@/constants/addresses";
import { poolAbi } from "@/lib/abi/poolAbi";
import { useEffect, useState } from "react";
import SupplyDialog from "./supply-dialog-col";
import { RepayDialog } from "./repay-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { TOKEN_OPTIONS } from "@/constants/tokenOption";
import { useSupplyAssets, useSupplyShares } from "@/hooks/useTotalSuppy";
import usdc from "../../../../public/usdc.png";
import weth from "../../../../public/weth.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { WithdrawDialog } from "./withdraw-dialog-col";

interface AssetItem {
  id: string;
  name: string;
  available: number;
  apy: number;
}

export default function AssetsToBorrow() {
  const [hasPosition, setHasPosition] = useState(false);
  const [collateralBalance, setCollateralBalance] = useState<string | number>(
    "0"
  );
  const [borrowBalance, setBorrowBalance] = useState<string | number>("0");
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window as any).ethereum?.selectedAddress
    ) {
      setUserAddress((window as any).ethereum.selectedAddress);
    }
  }, []);

  const { data: positionAddress } = useReadContract({
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

  const { data: balance } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "userCollaterals",
    args: hasPosition ? [window.ethereum?.selectedAddress] : undefined,
  });

  const { data: collateralToken } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "collateralToken",
  });

  const getSymbol = (tokenAddress: any) => {
    return tokenAddress
      ? `$${TOKEN_OPTIONS.find((t) => t.address === tokenAddress)?.name}`
      : undefined;
  };
  useEffect(() => {
    if (balance) {
      setCollateralBalance(Number(balance) / 10 ** 18);
    }
  }, [balance]);

  const { data: userBorrowShares } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "userBorrowShares",
    args: userAddress ? [userAddress] : undefined,
  });

  useEffect(() => {
    if (userBorrowShares) {
      setBorrowBalance(Number(userBorrowShares));
    }
  }, [userBorrowShares]);

  const totalSupplyAssets = useSupplyAssets();
  const totalSupplyShares = useSupplyShares();

  const convertBorrowShares = (amount: Number | unknown, decimal: number) => {
    const realAmount = Number(amount) / decimal;
    const result = (realAmount * totalSupplyAssets) / totalSupplyShares;
    return result.toFixed(2);
  };

  return (
    <Card className="bg-slate-900/50 border-none shadow-xl p-4">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-slate-200">
          Lending Pool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-slate-300 text-lg font-semibold">Collateral</div>
        <div className="grid grid-cols-12 gap-4 bg-[#31323d] p-4 rounded-lg">
          <div className="col-span-4 flex items-center gap-2">
            <Image
              src={weth}
              alt="USDC logo"
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="font-medium text-slate-400">
              {getSymbol(collateralToken) ?? (
                <Skeleton className="h-6 w-[100px] bg-slate-400" />
              )}
            </span>
          </div>
          <div className="col-span-5 mx-2 text-slate-400 mt-1">
            {collateralBalance != 0 ? collateralBalance : 0}
          </div>
          <div className="flex flex-row gap-2">
            <div className="col-span-4 flex ">
              {getSymbol(collateralToken) ? (
                <SupplyDialog token={getSymbol(collateralToken)} />
              ) : (
                <Skeleton className="h-8 w-[150px] bg-slate-400" />
              )}
            </div>
            <div className="col-span-4 flex ">
              <WithdrawDialog />
            </div>
          </div>
        </div>

        <div className="text-slate-300 text-lg font-semibold mt-6">Borrow</div>
        <div className="grid grid-cols-12 gap-4 bg-[#31323d] p-4 rounded-lg">
          <div className="col-span-4 flex items-center gap-2">
            <Image
              src={usdc}
              alt="USDC logo"
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="font-medium text-slate-400">$USDC</span>
          </div>
          <div className="col-span-4 text-slate-400 mt-1">
            {convertBorrowShares(borrowBalance, 1e6)}
          </div>
          <div className="col-span-4 flex gap-2 justify-end">
            <BorrowDialog token="USDC" />
            <RepayDialog />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
