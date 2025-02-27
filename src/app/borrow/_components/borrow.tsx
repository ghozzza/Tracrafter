"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Settings,
  ChevronUp,
  ChevronDown,
  Wallet,
  HandCoins,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BorrowToken from "./token-supply";
import AssetsToBorrow from "./asset-to-borrow";
import { BorrowBalance } from "@/components/user-balance/borrow-balance";
import { useAccount, useReadContract } from "wagmi";
import { poolAbi } from "@/lib/abi/poolAbi";
import {
  lendingPool,
  mockEna,
  mockUsdc,
  mockUsde,
  mockWbtc,
  mockWeth,
} from "@/constants/addresses";
import { position } from "../../../constants/addresses";
import { Address } from "viem";
import { TOKEN_OPTIONS } from "@/constants/tokenOption";
import { useSupplyAssets, useSupplyShares } from "@/hooks/useTotalSuppy";
import { positionAbi } from "@/lib/abi/positionAbi";
import Link from "next/link";
import PositionToken from "./PositionToken";

interface AssetItem {
  id: string;
  name: string;
  network: string;
  icon: string;
  available: number;
  apy: number;
  borrowed?: number;
}

const mockAssets: AssetItem[] = [
  {
    id: "usdc",
    name: "USDC",
    network: "ethereum",
    icon: "#usdc",
    available: 100,
    apy: 23.78,
    borrowed: 0.01,
  },
];

export default function BorrowPage() {
  const { address } = useAccount();
  const { data: totalSupplyAssets } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "totalSupplyAssets",
    args: [],
  });
  const { data: totalSupplyShares } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "totalSupplyShares",
    args: [],
  });

  const [isExpanded, setIsExpanded] = useState(true);

  /**
   * @dev Check Wallet Address
   */
  const { data: checkAvailability } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "addressPosition",
    args: [address],
  });
  const addressPosition = checkAvailability;
  /************************************************ */

  /**
   * @dev fit the collateral token name
   */
  const { data: collateralAddress } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "collateralToken",
  });
  const { data: borrowAddress } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "borrowToken",
  });
  /************************************************ */

  /**
   * @dev collaterals that user have in lending pool
   */
  const { data: userCollateral } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "userCollaterals",
    args: [address],
  });
  /************************************************ */
  /**
   * @dev borrow shares that user have in lending pool
   */
  const { data: userBorrowShares } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "userBorrowShares",
    args: [address],
  });
  /************************************************ */
  const findNameToken = (address: Address | unknown) => {
    const token = TOKEN_OPTIONS.find((asset) => asset.address === address);
    return token?.name;
  };

  const convertRealAmount = (amount: number | unknown, decimal: number) => {
    const realAmount = Number(amount) ? Number(amount) / decimal : 0; // convert to USDC
    return realAmount;
  };

  const convertBorrowShares = (amount: Number | unknown, decimal: number) => {
    const realAmount = convertRealAmount(amount, decimal);
    if (Number(totalSupplyAssets) && Number(totalSupplyShares)) {
      const result =
        (realAmount * Number(totalSupplyAssets)) / Number(totalSupplyShares);
      return result.toFixed(2);
    }
  };
  /************************************************ */
  /**
   * @dev getPositionId
   */

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl space-y-8 mt-5">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-4xl font-bold text-white">
            <HandCoins className="h-12 w-12 text-blue-500" />
            <h1>Borrow</h1>
          </div>
          <p className="text-slate-400">The Best DeFi Yields In 1-Click</p>
        </div>

        <Card className="bg-slate-900/50 border-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CardTitle className="text-xl text-white">
                  Your Position
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {isExpanded && (
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <div className="space-y-1 text-center">
                    <div className="text-sm text-slate-400">Collateral</div>
                    <div className="text-lg font-medium text-white">
                      {userCollateral
                        ? convertRealAmount(userCollateral, 1e18).toFixed(5)
                        : "0"}{" "}
                      ${findNameToken(collateralAddress)}
                    </div>
                  </div>
                  <div className="space-y-1 text-center">
                    <div className="text-sm text-slate-400">Debt</div>
                    <div className="text-lg font-medium text-white">
                      {userBorrowShares
                        ? convertBorrowShares(userBorrowShares, 1e6)?.toString()
                        : "0"}{" "}
                      ${findNameToken(borrowAddress)}
                    </div>
                  </div>
                  <div className="space-y-1 text-center">
                    <div className="text-sm text-slate-400">APY</div>
                    <div className="text-lg font-medium text-white">
                      {userBorrowShares ? "14.45%" : "0"}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {checkAvailability ===
                  "0x0000000000000000000000000000000000000000" ? (
                    <div className="flex items-center justify-center gap-4 text-xl text-white">
                      <span className="text-2xl">No positions available</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 justify-center content-center text-center text-white ">
                      <div className="">Assets</div>
                      <div className="">Value</div>
                      <div className="">Actions</div>
                      {/* WETH */}
                      <PositionToken
                        name={findNameToken(mockWeth)}
                        address={mockWeth}
                        decimal={1e18}
                        addressPosition={addressPosition}
                      />
                      {/* WBTC */}
                      <PositionToken
                        name={findNameToken(mockWbtc)}
                        address={mockWbtc}
                        decimal={1e8}
                        addressPosition={addressPosition}
                      />
                      {/* USDE */}
                      <PositionToken
                        name={findNameToken(mockUsde)}
                        address={mockUsde}
                        decimal={1e8}
                        addressPosition={addressPosition}
                      />
                      {/* USDC */}
                      <PositionToken
                        name={findNameToken(mockUsdc)}
                        address={mockUsdc}
                        decimal={1e6}
                        addressPosition={addressPosition}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <AssetsToBorrow />
      </div>
    </div>
  );
}
