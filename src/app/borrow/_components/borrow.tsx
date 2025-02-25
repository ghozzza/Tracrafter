"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, ChevronUp, ChevronDown, Wallet } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BorrowToken from "./token-supply";
import AssetsToBorrow from "./asset-to-borrow";

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
  const [isExpanded, setIsExpanded] = useState(true);
  const borrowPowerUsed = 3.13;

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl space-y-8 mt-5">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-4xl font-bold text-white">
            <Wallet className="h-12 w-12 text-blue-500" />
            <h1>Borrow</h1>
            <h1>
              <BorrowToken />
            </h1>
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
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">E-Mode</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#31323d] text-white border-none hover:bg-[#31323d]/80"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    DISABLED
                  </Button>
                </div>
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
                  <div className="space-y-1">
                    <div className="text-sm text-slate-400">Collateral</div>
                    <div className="text-lg font-medium text-white">$0.10</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-slate-400">Debt</div>
                    <div className="text-lg font-medium text-white">$0.01</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-slate-400">APY</div>
                    <div className="text-lg font-medium text-white">23.78%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-slate-400">
                      Borrow power used
                    </div>
                    <div className="text-lg font-medium text-white">
                      {borrowPowerUsed}%
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-sm text-slate-400">
                        <th className="text-left py-2">Asset</th>
                        <th className="text-left py-2">Debt</th>
                        <th className="text-left py-2">APY</th>
                        <th className="text-left py-2">APY type</th>
                        <th className="text-right py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockAssets
                        .filter((asset) => asset.borrowed)
                        .map((asset) => (
                          <tr
                            key={asset.id}
                            className="border-t border-slate-800"
                          >
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20" />
                                <span className="font-medium text-white">
                                  {asset.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 text-white">
                              ${asset.borrowed}
                            </td>
                            <td className="py-3 text-white">{asset.apy}%</td>
                            <td className="py-3">
                              <Select defaultValue="variable">
                                <SelectTrigger className="w-[100px] bg-[#31323d] border-none">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="variable">
                                    Variable
                                  </SelectItem>
                                  <SelectItem value="fixed">Fixed</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-3">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  Switch
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-slate-600 text-slate-600 hover:bg-slate-400"
                                >
                                  Repay
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <AssetsToBorrow assets={mockAssets} />
      </div>
    </div>
  );
}
