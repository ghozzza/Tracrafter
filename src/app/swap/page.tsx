"use client";

import { useEffect, useState } from "react";
import { ArrowDownUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  mockEna,
  mockUsdc,
  mockUsde,
  mockWbtc,
  mockWeth,
  priceFeed,
} from "@/constants/addresses";
import { priceAbi } from "@/lib/abi/price-abi";
import { useReadContract } from "wagmi";
import Image from "next/image";

const tokens = [
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    logo: "/placeholder.svg?height=32&width=32",
    tokenAddress: mockWbtc,
  },
  {
    symbol: "WETH",
    name: "Wrapped Ethereum",
    logo: "/placeholder.svg?height=32&width=32",
    tokenAddress: mockWeth,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    logo: "/placeholder.svg?height=32&width=32",
    tokenAddress: mockUsdc,
  },
  {
    symbol: "USDE",
    name: "USD Edge",
    logo: "/placeholder.svg?height=32&width=32",
    tokenAddress: mockUsde,
  },
  {
    symbol: "ENA",
    name: "Ethena",
    logo: "/placeholder.svg?height=32&width=32",
    tokenAddress: mockEna,
  },
];

export default function TokenSwap() {
  const [fromToken, setFromToken] = useState<any>("");
  const [fromAmount, setFromAmount] = useState("");
  const [toToken, setToToken] = useState<any>("");
  const [toAmount, setToAmount] = useState<any>(0);

  const getTokenPrice = (fromAmount: any) => {
    const { data: decimal, isLoading: isReading2 } = useReadContract({
      abi: priceAbi,
      address: priceFeed,
      functionName: "getQuoteDecimal",
      args: [toToken.tokenAddress],
    });
    const { data: price, isLoading: isReading } = useReadContract({
      abi: priceAbi,
      address: priceFeed,
      functionName: "getPrice",
      args: [fromToken.tokenAddress, toToken.tokenAddress],
    });
    fromAmount = fromAmount || 1;
    if (toToken !== "") {
      const resultToken = tokens.find(
        (t: any) => t.tokenAddress === toToken.tokenAddress
      );

      return price && decimal
        ? `$${resultToken?.symbol} ${
            (Number(price) * fromAmount) / Number(decimal)
          }`
        : isReading;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-40">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Swap</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="from-amount">From</Label>
          <div className="flex space-x-2">
            <Input
              id="from-amount"
              type="number"
              placeholder="0.0"
              className="flex-grow disabled:bg-slate-200"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              disabled={fromToken == ""}
            />
            <Select
              onValueChange={(value) =>
                setFromToken(
                  tokens.find((t) => t.symbol === value) || tokens[0]
                )
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center space-x-2">
                      <img
                        src={token.logo || "/placeholder.svg"}
                        alt={token.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{token.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-center">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="to-amount">To</Label>
          <div className="flex space-x-2">
            <Input
              id="to-amount"
              type="number"
              placeholder="0.0"
              className="flex-grow disabled:bg-slate-200"
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
              disabled={toToken == ""}
            />
            <Select
              onValueChange={(value) =>
                setToToken(tokens.find((t) => t.symbol === value) || tokens[1])
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center space-x-2">
                      <Image
                        src={token.logo || "/placeholder.svg"}
                        alt={token.name}
                        className="w-6 h-6 rounded-full"
                        width={100}
                        height={100}
                      />
                      <span>{token.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            You'll got {getTokenPrice(fromAmount)}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Swap</Button>
      </CardFooter>
    </Card>
  );
}
