"use client";

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
import { factoryAbi } from "@/lib/abi/collateralAbi";
import { factory } from "@/lib/utils/contractAddress";
import SupplyDialog from "./supply-dialog";

const TOKEN_OPTIONS = [
  { name: "WETH", address: "0xa7A93C5F0691a5582BAB12C0dE7081C499aECE7f" },
  { name: "WBTC", address: "0xC014F158EbADce5a8e31f634c0eb062Ce8CDaeFe" },
  { name: "PEPE", address: "0x1E713E704336094585c3e8228d5A8d82684e4Fb0" },
  { name: "MANTA", address: "0xe2e80f81589c80cb1d20a7846a350644281e0177" },
];

const USDC_ADDRESS = "0xA61Eb0D33B5d69DC0D0CE25058785796296b1FBd";

const SAMPLE_POOLS = [
  {
    id: 1,
    token: "WETH",
    liquidity: "31.79M",
    apy: "14.45",
    duration: "7 days",
  },
  {
    id: 2,
    token: "WBTC",
    liquidity: "134.77M",
    apy: "16.19",
    duration: "35 days",
  },
  {
    id: 3,
    token: "PEPE",
    liquidity: "36.82M",
    apy: "4.025",
    duration: "35 days",
  },
  {
    id: 4,
    token: "MANTA",
    liquidity: "3.51M",
    apy: "16.03",
    duration: "56 days",
  },
];

export default function LendingPool() {
  const [token1, setToken1] = useState("");
  const [ltv, setLtv] = useState<number>(0);

  const {
    data: hashTransaction,
    isPending: isTransactionPending,
    writeContract: writeTransaction,
  } = useWriteContract();

  const { isLoading: isTransactionLoading, isSuccess } =
    useWaitForTransactionReceipt({
      hash: hashTransaction,
    });

  const handleCreatePool = async () => {
    const newLtv = Number(ltv) * 10 ** 16;
    await writeTransaction({
      abi: factoryAbi,
      address: factory,
      functionName: "createLendingPool",
      args: [token1, USDC_ADDRESS, BigInt(newLtv)],
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
      setLtv(0);
    }
  }, [isSuccess]);

  const isButtonDisabled = isTransactionPending || isTransactionLoading;

  return (
    <div className="w-full space-y-6">
      <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-lg p-6">
        <Tabs defaultValue="pools" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-background/50 backdrop-blur">
            <TabsTrigger
              value="pools"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Available Pools
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              Create Pool
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pools" className="space-y-4">
            <div className="rounded-lg border border-gray-800 bg-black/50 backdrop-blur">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-200">Pool</TableHead>
                    <TableHead className="text-gray-200">Duration</TableHead>
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
                        {pool.token}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {pool.duration}
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
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <div className="space-y-4 p-6 rounded-lg bg-black/50 backdrop-blur border border-gray-800">
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
                    {TOKEN_OPTIONS.map((token) => (
                      <SelectItem
                        key={token.name}
                        value={token.address}
                        className="text-gray-300 focus:bg-gray-800 focus:text-white"
                      >
                        {token.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="token2" className="text-gray-200">
                  Token 2
                </Label>
                <Input
                  id="token2"
                  value="USDC"
                  disabled
                  className="bg-gray-900 border-gray-700 text-gray-300"
                />
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
                disabled={isButtonDisabled}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/20 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50"
              >
                {isButtonDisabled ? "Processing..." : "Create Lending Pool"}
              </Button>

              {isSuccess && hashTransaction && (
                <div className="mt-4">
                  <p className="text-gray-400">Transaction Hash:</p>
                  <a
                    href={`https://pacific-explorer.sepolia-testnet.manta.network/tx/${hashTransaction}`}
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
        </Tabs>
      </div>
    </div>
  );
}
