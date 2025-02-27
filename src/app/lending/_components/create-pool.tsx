"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SAMPLE_POOLS } from "@/constants/pools";
import SupplyDialog from "./supply-dialog";
import Image from "next/image";
import usdc from "../../../../public/usdc.png";
import { BarChart3, Shield, CreditCard } from "lucide-react";

export default function LendingPool() {
  return (
    <div className="min-h-screen py-10 mt-12 mx-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-[#151726] border-gray-800 shadow-none">
            <CardContent className="py-6 px-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm">Total Value Locked</h3>
                <BarChart3 className="h-5 w-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-gray-200">$247.92M</p>
              <div className="mt-2 text-green-400 text-sm">+5.2% (24h)</div>
            </CardContent>
          </Card>

          <Card className="bg-[#151726] border-gray-800 shadow-none">
            <CardContent className="py-6 px-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm">Total Supplied</h3>
                <Shield className="h-5 w-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-gray-200">$189.45M</p>
              <div className="mt-2 text-green-400 text-sm">+3.7% (24h)</div>
            </CardContent>
          </Card>

          <Card className="bg-[#151726] border-gray-800 shadow-none">
            <CardContent className="py-6 px-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm">Total Borrowed</h3>
                <CreditCard className="h-5 w-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-gray-200">$58.47M</p>
              <div className="mt-2 text-red-400 text-sm">-1.2% (24h)</div>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto">
          <Tabs defaultValue="pools" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-[#151726] border-gray-800">
                <TabsTrigger value="pools">All Pools</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="pools">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SAMPLE_POOLS.filter(
                  (pool) => pool.token.toLowerCase() === "usdc"
                ).map((pool) => (
                  <Card
                    key={pool.id}
                    className="bg-[#0e0f1a] border-gray-800 shadow-none"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
                      <CardTitle className="text-sm font-medium text-white">
                        <div className="flex items-center gap-2">
                          <Image
                            src={usdc}
                            alt="USDC logo"
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          {pool.token}
                        </div>
                      </CardTitle>
                      <div className="text-sm font-medium text-emerald-400">
                        {pool.apy}% APY
                      </div>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <div className="text-2xl font-bold text-white">
                        ${pool.liquidity}M
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Total Liquidity
                      </p>
                      <div className="mt-4">
                        <SupplyDialog
                          poolId={pool.id}
                          token={pool.token}
                          apy={pool.apy}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="my-positions">
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-400">
                  You don't have any active positions
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supply assets to get started
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
