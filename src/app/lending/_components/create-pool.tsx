"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SAMPLE_POOLS } from "@/constants/pools";
import SupplyDialog from "./supply-dialog";
import Image from "next/image";

export default function LendingPool() {
  return (
    <div className="w-full min-h-screen pt-20 px-4 pb-8">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="pools" className="w-full">
          <TabsContent value="pools" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SAMPLE_POOLS.map((pool) => (
                <Card
                  key={pool.id}
                  className="bg-black/50 backdrop-blur border-gray-800"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">
                      <div className="flex items-center gap-2">
                        <Image
                          src={pool.logo || "/placeholder.svg"}
                          alt={`${pool.token} logo`}
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
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      ${pool.liquidity}
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
        </Tabs>
      </div>
    </div>
  );
}
