"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { collateralAbi } from "@/lib/abi/collateralAbi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function LendingPage() {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as String;
  const [activeTab, setActiveTab] = useState("pool");

  // States remain the same
  const [token1, setToken1] = useState("");
  const [token2, setToken2] = useState("");
  const [ltv, setLtv] = useState("0");
  const [positionToken, setPositionToken] = useState("");
  const [amount, setAmount] = useState("0");
  const [flashloanToken, setFlashloanToken] = useState("");

  const { writeContract, data: txHash } = useWriteContract();
  const {
    isLoading: isTxLoading,
    isSuccess,
    data: txReceipt,
  } = useWaitForTransactionReceipt({ hash: txHash });

  // Handlers remain the same
  const handleCreatePool = () => {
    writeContract({
      address: contractAddress,
      abi: collateralAbi,
      functionName: "createLendingPool",
      args: [token1, token2, BigInt(ltv)],
    });
  };

  const handleCreatePosition = () => {
    writeContract({
      address: contractAddress,
      abi: collateralAbi,
      functionName: "createPosition",
      args: [positionToken],
    });
  };

  const handleOperation = (operation: string) => {
    let args: any[] = [BigInt(amount)];
    if (operation === "flashloan") {
      args = [flashloanToken, BigInt(amount)];
    }
    writeContract({
      address: contractAddress,
      abi: collateralAbi,
      functionName: operation,
      args: args,
    });
  };

  return (
    <div className="container mx-auto mt-16 p-4 min-h-screen bg-[#0d1117]">
      <Card className="bg-[#161b22] border-[#317dd4]">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-100">
            Lending Dashboard
          </CardTitle>
          <CardDescription className="text-gray-400">
            Manage your lending and borrowing activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-3 bg-[#21262d]">
              <TabsTrigger
                value="pool"
                className="data-[state=active]:bg-[#4989ff] data-[state=active]:text-white text-gray-300"
              >
                Create Lending Pool
              </TabsTrigger>
              <TabsTrigger
                value="position"
                className="data-[state=active]:bg-[#4989ff] data-[state=active]:text-white text-gray-300"
              >
                Create Position
              </TabsTrigger>
              <TabsTrigger
                value="operations"
                className="data-[state=active]:bg-[#4989ff] data-[state=active]:text-white text-gray-300"
              >
                Operations
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pool" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token1" className="text-gray-300">
                  Token 1 Address
                </Label>
                <Input
                  id="token1"
                  value={token1}
                  onChange={(e) => setToken1(e.target.value)}
                  className="bg-[#0d1117] border-[#317dd4] text-gray-200 placeholder-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token2" className="text-gray-300">
                  Token 2 Address
                </Label>
                <Input
                  id="token2"
                  value={token2}
                  onChange={(e) => setToken2(e.target.value)}
                  className="bg-[#0d1117] border-[#317dd4] text-gray-200 placeholder-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ltv" className="text-gray-300">
                  LTV
                </Label>
                <Input
                  id="ltv"
                  type="number"
                  value={ltv}
                  onChange={(e) => setLtv(e.target.value)}
                  className="bg-[#0d1117] border-[#317dd4] text-gray-200 placeholder-gray-500"
                />
              </div>
              <Button
                onClick={handleCreatePool}
                disabled={isTxLoading}
                className="w-full bg-[#2ea043] hover:bg-[#2c974b] text-white border-none"
              >
                {isTxLoading ? "Processing..." : "Create Lending Pool"}
              </Button>
            </TabsContent>
            <TabsContent value="position" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="positionToken" className="text-gray-300">
                  Position Token Address
                </Label>
                <Input
                  id="positionToken"
                  value={positionToken}
                  onChange={(e) => setPositionToken(e.target.value)}
                  className="bg-[#0d1117] border-[#317dd4] text-gray-200 placeholder-gray-500"
                />
              </div>
              <Button
                onClick={handleCreatePosition}
                disabled={isTxLoading}
                className="w-full bg-[#2ea043] hover:bg-[#2c974b] text-white border-none"
              >
                {isTxLoading ? "Processing..." : "Create Position"}
              </Button>
            </TabsContent>
            <TabsContent value="operations" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-300">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-[#0d1117] border-[#317dd4] text-gray-200 placeholder-gray-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleOperation("supply")}
                  className="bg-[#2ea043] hover:bg-[#2c974b] text-white border-none"
                >
                  Supply
                </Button>
                <Button
                  onClick={() => handleOperation("withdraw")}
                  className="bg-[#2ea043] hover:bg-[#2c974b] text-white border-none"
                >
                  Withdraw
                </Button>
                <Button
                  onClick={() => handleOperation("borrow")}
                  className="bg-[#2ea043] hover:bg-[#2c974b] text-white border-none"
                >
                  Borrow
                </Button>
                <Button
                  onClick={() => handleOperation("repay")}
                  className="bg-[#2ea043] hover:bg-[#2c974b] text-white border-none"
                >
                  Repay
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="flashloanToken" className="text-gray-300">
                  Flashloan Token Address
                </Label>
                <Input
                  id="flashloanToken"
                  value={flashloanToken}
                  onChange={(e) => setFlashloanToken(e.target.value)}
                  className="bg-[#0d1117] border-[#317dd4] text-gray-200 placeholder-gray-500"
                />
              </div>
              <Button
                onClick={() => handleOperation("flashloan")}
                className="w-full bg-[#2ea043] hover:bg-[#2c974b] text-white border-none"
              >
                Flashloan
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {isSuccess && (
        <div className="mt-4 p-4 bg-[#238636]/20 border border-[#238636] rounded-md">
          <p className="text-[#2ea043]">
            Transaction Successful! Hash: {txHash}
          </p>
        </div>
      )}
    </div>
  );
}
