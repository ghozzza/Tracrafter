"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { factoryAbi } from "@/lib/abi/factoryAbi";
import { factory,hxAddress } from "@/constants/addresses";
import { TOKEN_OPTIONS } from "@/constants/tokenOption";
import { SAMPLE_POOLS } from "@/constants/pools";
import SupplyDialog from "./supply-dialog";
import Image from "next/image";

export default function LendingPool() {
  const [token1, setToken1] = useState("");
  const [token2, setToken2] = useState("");
  const [ltv, setLtv] = useState(0);

  const {
    data: hashTransaction,
    isPending: isTransactionPending,
    writeContract: writeTransaction,
  } = useWriteContract();

  const { isLoading: isTransactionLoading, isSuccess } =
    useWaitForTransactionReceipt({
      hash: hashTransaction,
    });

  const filteredToken1Options = TOKEN_OPTIONS.filter(
    (token) => token.address !== token2
  );
  const filteredToken2Options = TOKEN_OPTIONS.filter(
    (token) => token.address !== token1
  );

  const handleCreatePool = async () => {
    const newLtv = Number(ltv) * 10 ** 16;
    await writeTransaction({
      abi: factoryAbi,
      address: factory,
      functionName: "createLendingPool",
      args: [token1, token2, BigInt(newLtv)],
    });
  };

  const handleLTV = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) <= 70) {
      setLtv(Number(e.target.value));
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setToken1("");
      setToken2("");
      setLtv(0);
    }
  }, [isSuccess]);

  const isButtonDisabled = isTransactionPending || isTransactionLoading;

  return (
    <div className="w-full min-h-screen pt-20 px-4 pb-8">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-background/50 backdrop-blur">
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Create Pool
            </TabsTrigger>
            <TabsTrigger
              value="pools"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Available Pools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-6">
            <div className="max-w-md mx-auto space-y-4 p-6 rounded-lg bg-black/50 backdrop-blur border border-gray-800">
              <div className="space-y-2">
                <Label htmlFor="token1" className="text-gray-200">
                  Token 1
                </Label>
                <Select
                  onValueChange={(value) => setToken1(value)}
                  disabled={isButtonDisabled}
                  value={token1}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-300">
                    <SelectValue placeholder="Select Token 1" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {filteredToken1Options.map((token) => (
                      <SelectItem
                        key={token.name}
                        value={token.address}
                        className="text-gray-300 focus:bg-gray-800 focus:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <Image
                            src={token.logo}
                            alt={`${token.name} logo`}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                          {token.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="token2" className="text-gray-200">
                  Token 2
                </Label>
                <Select
                  onValueChange={(value) => setToken2(value)}
                  disabled={isButtonDisabled}
                  value={token2}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-300">
                    <SelectValue placeholder="Select Token 2" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {filteredToken2Options.map((token) => (
                      <SelectItem
                        key={token.name}
                        value={token.address}
                        className="text-gray-300 focus:bg-gray-800 focus:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <Image
                            src={token.logo}
                            alt={`${token.name} logo`}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                          {token.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ltv" className="text-gray-200">
                  LTV
                </Label>
                <Input
                  id="ltv"
                  value={ltv !== 0 ? ltv : ""}
                  onChange={handleLTV}
                  disabled={isButtonDisabled}
                  placeholder="1-70"
                  className="bg-gray-900 border-gray-700 text-gray-300"
                />
              </div>

              <Button
                onClick={handleCreatePool}
                disabled={isButtonDisabled || !token1 || !token2}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/20 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50"
              >
                {isButtonDisabled ? "Processing..." : "Create Lending Pool"}
              </Button>

              {isSuccess && hashTransaction && (
                <div className="mt-4">
                  <p className="text-gray-400">Transaction Hash:</p>
                  <a
                    href={`${hxAddress}${hashTransaction}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 break-all"
                  >
                    {hashTransaction}
                  </a>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pools" className="mt-6">
            <div className="rounded-lg border border-gray-800 bg-black/50 backdrop-blur overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-200">Pool</TableHead>
                      <TableHead className="text-right text-gray-200">
                        Liquidity
                      </TableHead>
                      <TableHead className="text-right text-gray-200">
                        APY
                      </TableHead>
                      <TableHead className="text-right text-gray-200">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SAMPLE_POOLS.map((pool) => (
                      <TableRow
                        key={pool.id}
                        className="border-gray-800 hover:bg-gray-900/50"
                      >
                        <TableCell className="font-medium text-white">
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
                        </TableCell>
                        <TableCell className="text-right text-gray-300">
                          ${pool.liquidity}
                        </TableCell>
                        <TableCell className="text-right text-emerald-400">
                          {pool.apy}%
                        </TableCell>
                        <TableCell className="text-right">
                          <SupplyDialog
                            poolId={pool.id}
                            token={pool.token}
                            apy={pool.apy}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
