"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BorrowDialog from "./borrow-dialog";
import { useReadContract } from "wagmi";
import { lendingPool } from "@/constants/addresses";
import { poolAbi } from "@/lib/abi/poolAbi";
import { useEffect, useState } from "react";
import SupplyDialog from "./supply-dialog-col";

interface AssetItem {
  id: string;
  name: string;
  available: number;
  apy: number;
}

export default function AssetsToBorrow() {
  const [hasPosition, setHasPosition] = useState(false);
  const [collateralBalance, setCollateralBalance] = useState<string>("0");

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

  // Gunakan hook useEffect untuk mendeteksi perubahan posisi
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

  // Pisahkan useReadContract untuk membaca saldo collateral
  const { data: balance } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "getTokenBalancesByPosition",
    args: hasPosition ? [positionAddress, "WBTC"] : undefined, // Hanya jalankan jika ada posisi
  });

  useEffect(() => {
    if (balance) {
      setCollateralBalance(balance.toString());
    }
  }, [balance]);

  return (
    <Card className="bg-slate-900/50 border-none shadow-xl p-4">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-slate-200">
          Lending Pool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-slate-300 text-lg font-semibold">Supply</div>
        <div className="grid grid-cols-12 gap-4 bg-[#31323d] p-4 rounded-lg">
          <div className="col-span-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10" />
            <span className="font-medium text-slate-400">WETH</span>
          </div>
          <div className="col-span-4 text-slate-400">{collateralBalance}</div>
          <div className="col-span-4 flex justify-end">
            <SupplyDialog token="WBTC" />
          </div>
        </div>

        <div className="text-slate-300 text-lg font-semibold mt-6">Borrow</div>
        <div className="grid grid-cols-12 gap-4 bg-[#31323d] p-4 rounded-lg">
          <div className="col-span-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10" />
            <span className="font-medium text-slate-400">USDC</span>
          </div>
          <div className="col-span-4 text-slate-400">-</div>
          <div className="col-span-4 flex justify-end">
            <BorrowDialog token="USDC" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
