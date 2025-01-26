"use client";

import React, { useState } from "react";
import { Table } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavbarFix } from "@/components/fix-navbar";
import { ArrowDownUp, Zap } from "lucide-react";

interface BorrowDataItem {
  id: number;
  asset: string;
  availableToBorrow: string;
  borrowRate: string;
  collateralRequired: string;
  volatility: string;
}

const mockBorrowData: BorrowDataItem[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  asset: ["ETH", "USDC", "DAI", "WBTC", "LINK"][i % 5],
  availableToBorrow: (Math.random() * 1000).toFixed(2),
  borrowRate: (Math.random() * 10).toFixed(2),
  collateralRequired: (Math.random() * 5000).toFixed(2),
  volatility: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
}));

export default function BorrowPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortKey, setSortKey] = useState<
    | keyof Pick<
        BorrowDataItem,
        "availableToBorrow" | "borrowRate" | "collateralRequired"
      >
    | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 10;

  const filteredAndSortedData = mockBorrowData
    .filter((item) =>
      item.asset.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortKey) return 0;
      const valueA = parseFloat(a[sortKey]);
      const valueB = parseFloat(b[sortKey]);
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    });

  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (
    key: keyof Pick<
      BorrowDataItem,
      "availableToBorrow" | "borrowRate" | "collateralRequired"
    >
  ) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const getVolatilityColor = (volatility: string) => {
    switch (volatility) {
      case "Low":
        return "bg-green-600/20 text-green-400";
      case "Medium":
        return "bg-yellow-600/20 text-yellow-400";
      case "High":
        return "bg-red-600/20 text-red-400";
      default:
        return "bg-gray-600/20 text-gray-400";
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <NavbarFix />
      <div className="min-h-screen  text-white flex justify-center items-center p-8">
        <Card className="w-full max-w-6xl mx-auto mt-10 bg-gray-800/60 backdrop-blur-lg border-none shadow-2xl rounded-2xl p-6">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
              Borrow Marketplace
            </CardTitle>
            <div className="flex justify-center items-center mb-6">
              <Input
                placeholder="Search assets"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-1/2 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  {[
                    "Asset",
                    "Available to Borrow",
                    "Borrow Rate",
                    "Collateral Required",
                  ].map((label, index) => (
                    <th
                      key={label}
                      onClick={() =>
                        handleSort(
                          [
                            "availableToBorrow",
                            "borrowRate",
                            "collateralRequired",
                          ][index] as keyof Pick<
                            BorrowDataItem,
                            | "availableToBorrow"
                            | "borrowRate"
                            | "collateralRequired"
                          >
                        )
                      }
                      className="text-center cursor-pointer hover:bg-gray-700 transition-colors group p-4"
                    >
                      <div className="flex items-center justify-center">
                        {label}
                        <ArrowDownUp
                          className="ml-2 opacity-50 group-hover:opacity-100 transition-opacity"
                          size={16}
                        />
                      </div>
                    </th>
                  ))}
                  <th className="text-center">Volatility</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-700/50 transition-colors text-center"
                  >
                    <td className="font-semibold text-purple-300 p-4">
                      {item.asset}
                    </td>
                    <td className="p-4">{item.availableToBorrow}</td>
                    <td className="p-4">{item.borrowRate}%</td>
                    <td className="p-4">{item.collateralRequired}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs inline-block ${getVolatilityColor(
                          item.volatility
                        )}`}
                      >
                        {item.volatility}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="outline"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 border-none"
                      >
                        <Zap size={16} className="mr-2" /> Borrow
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="flex justify-center items-center mt-8 text-white space-x-6">
              <div>
                Page {currentPage} of {totalPages}
              </div>
              <div className="space-x-4">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-700 hover:bg-gray-600 px-6"
                >
                  Previous
                </Button>
                <Button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
