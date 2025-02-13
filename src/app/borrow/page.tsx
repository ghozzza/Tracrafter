"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Settings, ChevronDown, Zap, ArrowUpDown, Wallet, ChevronUp } from "lucide-react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AssetItem {
  id: string;
  name: string;
  icon: string;
  available: number;
  apy: number;
  borrowed?: number
}

const mockAssets: AssetItem[] = [
  { id: "usdc", name: "USDC", icon: "#usdc", available: 100, apy: 23.78, borrowed: 0.01 },
  { id: "btcb", name: "BTCB", icon: "#btc", available: 10, apy: 0.27 },
  { id: "bnb", name: "BNB", icon: "#bnb", available: 20, apy: 1.96 },
  { id: "usdt", name: "USDT", icon: "#usdt", available: 30, apy: 8.54 },
  { id: "eth", name: "ETH", icon: "#eth", available: 15, apy: 5.4 },
];

export default function BorrowPage() {
  const { data: hashTransaction, isPending, writeContract } = useWriteContract();
  const { isLoading: isTransactionLoading } = useWaitForTransactionReceipt({
    hash: hashTransaction,
  });

  const [isExpanded, setIsExpanded] = useState(true)
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [ascending, setAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 3;

  const borrowPowerUsed = 3.13

  const sortedAssets = [...mockAssets].sort((a, b) => {
    if (!sortBy) return 0;
    return ascending ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
  });

  const filteredAssets = sortedAssets.filter((asset) =>
    asset.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl space-y-8 mt-5">

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-4xl font-bold text-white">
            <Wallet className="h-12 w-12 text-blue-500" />
            <h1>Borrow</h1>
          </div>
          <p className="text-slate-400">The Best DeFi Yields In 1-Click</p>
        </div>

        <Card className="bg-slate-900/50 border-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CardTitle className="text-xl text-white">Your borrows</CardTitle>
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
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="text-slate-400">
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          {isExpanded && (
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-slate-400">Balance</div>
                    <div className="text-lg font-medium text-white">$0.01</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-slate-400">APY</div>
                    <div className="text-lg font-medium text-white">23.78%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-slate-400">Borrow power used</div>
                    <div className="text-lg font-medium text-white">{borrowPowerUsed}%</div>
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
                          <tr key={asset.id} className="border-t border-slate-800">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20" />
                                <span className="font-medium text-white">{asset.name}</span>
                              </div>
                            </td>
                            <td className="py-3 text-white">${asset.borrowed}</td>
                            <td className="py-3 text-white">{asset.apy}%</td>
                            <td className="py-3">
                              <Select defaultValue="variable">
                                <SelectTrigger className="w-[100px] bg-[#31323d] border-none">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="variable">Variable</SelectItem>
                                  <SelectItem value="fixed">Fixed</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-3">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
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

        {/* Search */}
        <input
          type="text"
          placeholder="Search asset..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded-md border border-gray-600 bg-slate-800 text-white w-full mb-4"
        />

        {/* Assets to Borrow */}
        <Card className="bg-slate-900/50 border-none shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-medium text-slate-200">Assets to borrow</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-slate-400">
                <div className="col-span-3">Asset</div>
                <div className="col-span-3 flex items-center cursor-pointer" onClick={() => { setSortBy('available'); setAscending(!ascending); }}>
                  Available <ArrowUpDown className="w-4 h-4 ml-1" />
                </div>
                <div className="col-span-3 flex items-center cursor-pointer" onClick={() => { setSortBy('apy'); setAscending(!ascending); }}>
                  APY, variable <ArrowUpDown className="w-4 h-4 ml-1" />
                </div>
                <div className="col-span-3">Action</div>
              </div>

              {paginatedAssets.map((asset) => (
                <div key={asset.id} className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-[#31323d] rounded-lg">
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10" />
                    <span className="font-medium text-slate-400">{asset.name}</span>
                  </div>
                  <div className="col-span-3 text-slate-400">{asset.available}</div>
                  <div className="col-span-3 text-slate-400">{asset.apy}%</div>
                  <div className="col-span-3 flex gap-2">
                    <Button
                      className="bg-gradient-to-r from-pink-600 to-purple-600  text-white  hover:from-purple-600 hover:to-pink-600 border-none"
                    >
                      Borrow
                    </Button>
                    <Button
                      className="hidden bg-gradient-to-r from-pink-600 to-purple-600  text-white  hover:from-purple-600 hover:to-pink-600 border-none"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-700 hover:bg-gray-600 px-6"
          >
            Previous
          </Button>
          <span className="text-white">Page {currentPage} of {totalPages}</span>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
