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

interface AssetsToBorrowProps {
  assets: AssetItem[];
}

export default function AssetsToBorrow({ assets }: AssetsToBorrowProps) {
  const [hasPosition, setHasPosition] = useState(false);
  const [collateralBalances, setCollateralBalances] = useState<
    Record<string, string>
  >({});

  // Cek apakah user memiliki posisi
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

  // Ambil saldo collateral
  useEffect(() => {
    if (hasPosition) {
      assets.forEach(async (asset) => {
        const { data: balance } = await useReadContract({
          address: lendingPool,
          abi: poolAbi,
          functionName: "getTokenBalancesByPosition",
          args: [positionAddress, asset.name],
        });
        setCollateralBalances((prev) => ({
          ...prev,
          [asset.name]: balance?.toString() || "0",
        }));
      });
    }
  }, [hasPosition, assets]);

  return (
    <Card className="bg-slate-900/50 border-none shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium text-slate-200">
          Assets to Borrow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-slate-400">
            <div className="col-span-3">Asset</div>
            <div className="col-span-2">Available</div>
            <div className="col-span-2">APY</div>
            <div className="col-span-3">Collateral</div>
            <div className="col-span-2">Action</div>
          </div>

          {assets.map((asset) => (
            <div
              key={asset.id}
              className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-[#31323d] rounded-lg"
            >
              <div className="col-span-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10" />
                <span className="font-medium text-slate-400">{asset.name}</span>
              </div>
              <div className="col-span-2 text-slate-400">{asset.available}</div>
              <div className="col-span-2 text-slate-400">{asset.apy}%</div>
              <div className="col-span-3 text-slate-400">
                {collateralBalances[asset.name] || "0"}
              </div>
              <div className="col-span-2 flex gap-2">
                <SupplyDialog token={asset.name} />
              </div>
              <div className="col-span-2 flex gap-2">
                <BorrowDialog token={asset.name} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
