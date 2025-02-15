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
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const [activeTab, setActiveTab] = useState("pool");

  // Create Lending Pool States
  const [token1, setToken1] = useState("");
  const [token2, setToken2] = useState("");
  const [ltv, setLtv] = useState("0");

  // Create Position States
  const [positionToken, setPositionToken] = useState("");

  // Operation States
  const [amount, setAmount] = useState("0");
  const [flashloanToken, setFlashloanToken] = useState("");

  const { writeContract, data: txHash } = useWriteContract();
  const {
    isLoading: isTxLoading,
    isSuccess,
    data: txReceipt,
  } = useWaitForTransactionReceipt({ hash: txHash });

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
    <div className="container mx-auto mt-16 p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pool">Create Lending Pool</TabsTrigger>
          <TabsTrigger value="position">Create Position</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>
        <TabsContent value="pool">
          <Card>
            <CardHeader>
              <CardTitle>Create Lending Pool</CardTitle>
              <CardDescription>
                Set up a new lending pool with two tokens and LTV.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="token1">Token 1 Address</Label>
                <Input
                  id="token1"
                  value={token1}
                  onChange={(e) => setToken1(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="token2">Token 2 Address</Label>
                <Input
                  id="token2"
                  value={token2}
                  onChange={(e) => setToken2(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ltv">LTV</Label>
                <Input
                  id="ltv"
                  type="number"
                  value={ltv}
                  onChange={(e) => setLtv(e.target.value)}
                />
              </div>
              <Button onClick={handleCreatePool} disabled={isTxLoading}>
                {isTxLoading ? "Processing..." : "Create Lending Pool"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="position">
          <Card>
            <CardHeader>
              <CardTitle>Create Position</CardTitle>
              <CardDescription>
                Create a new position in the lending pool.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="positionToken">Position Token Address</Label>
                <Input
                  id="positionToken"
                  value={positionToken}
                  onChange={(e) => setPositionToken(e.target.value)}
                />
              </div>
              <Button onClick={handleCreatePosition} disabled={isTxLoading}>
                {isTxLoading ? "Processing..." : "Create Position"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="operations">
          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>
                Perform various operations on the lending pool.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => handleOperation("supply")}>
                  Supply
                </Button>
                <Button onClick={() => handleOperation("withdraw")}>
                  Withdraw
                </Button>
                <Button onClick={() => handleOperation("borrow")}>
                  Borrow
                </Button>
                <Button onClick={() => handleOperation("repay")}>Repay</Button>
              </div>
              <div className="space-y-1">
                <Label htmlFor="flashloanToken">Flashloan Token Address</Label>
                <Input
                  id="flashloanToken"
                  value={flashloanToken}
                  onChange={(e) => setFlashloanToken(e.target.value)}
                />
              </div>
              <Button onClick={() => handleOperation("flashloan")}>
                Flashloan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isSuccess && (
        <p className="mt-4 text-green-600">
          Transaction Successful! Hash: {txHash}
        </p>
      )}
    </div>
  );
}
