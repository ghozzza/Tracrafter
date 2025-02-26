"use client";

import { use, useEffect, useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { parseUnits } from "viem";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useAccount,
} from "wagmi";
import usdc from "../../../public/usdc.png";
import usde from "../../../public/usde.png";
import weth from "../../../public/weth.png";
import ena from "../../../public/ena.png";
import wbtc from "../../../public/wbtc.png";

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
  lendingPool,
  mockEna,
  mockUsdc,
  mockUsde,
  mockWbtc,
  mockWeth,
  priceFeed,
  swapRouter,
} from "@/constants/addresses";
import { priceAbi } from "@/lib/abi/price-abi";
import { useReadContract } from "wagmi";
import Image from "next/image";
import { toast } from "sonner";
import { poolAbi } from "@/lib/abi/poolAbi";
import { positionAbi } from "@/lib/abi/positionAbi";

const tokens = [
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    logo: wbtc,
    tokenAddress: mockWbtc,
    decimals: 8,
  },
  {
    symbol: "WETH",
    name: "Wrapped Ethereum",
    logo: weth,
    tokenAddress: mockWeth,
    decimals: 18,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    logo: usdc,
    tokenAddress: mockUsdc,
    decimals: 6,
  },
  {
    symbol: "USDE",
    name: "USD Edge",
    logo: usde,
    tokenAddress: mockUsde,
    decimals: 6,
  },
  {
    symbol: "ENA",
    name: "Ethena",
    logo: ena,
    tokenAddress: mockEna,
    decimals: 18,
  },
];

export default function TokenSwap() {
  const [fromToken, setFromToken] = useState<any>("");
  const [toToken, setToToken] = useState<any>("");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [isManualInput, setIsManualInput] = useState<"from" | "to" | null>(
    null
  );

  const { address } = useAccount();

  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window as any).ethereum?.selectedAddress
    ) {
      setUserAddress((window as any).ethereum.selectedAddress);
    }
  }, []);

  const { data: positionAddress, refetch: refetchPosition } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "addressPosition",
    args: userAddress ? [userAddress] : undefined,
  });

  const { data: tokenBalance } = useReadContract({
    address: positionAddress,
    abi: positionAbi,
    functionName: "tokenBalances",
    args: [mockUsdc],
  });

  console.log("1" + userAddress);
  console.log("2" +  positionAddress);
  console.log("3" +  tokenBalance);

  const { data: decimal } = useReadContract({
    abi: priceAbi,
    address: priceFeed,
    functionName: "getQuoteDecimal",
    args: toToken ? [toToken.tokenAddress] : undefined,
    query: {
      enabled: Boolean(toToken),
    },
  });

  const { data: price } = useReadContract({
    abi: priceAbi,
    address: priceFeed,
    functionName: "getPriceTrade",
    args:
      fromToken && toToken
        ? [fromToken.tokenAddress, toToken.tokenAddress]
        : undefined,
    query: {
      enabled: Boolean(fromToken && toToken),
    },
  }) as unknown as { data: readonly [bigint, bigint] };

  const {
    data: swapHash,
    writeContract: writeSwap,
    isPending: isSwapPending,
  } = useWriteContract();

  const { isLoading: isSwapLoading } = useWaitForTransactionReceipt({
    hash: swapHash,
  });

  const switchTokens = () => {
    setIsManualInput(null);
    const tempFromToken = fromToken;
    const tempToToken = toToken;
    const tempFromAmount = fromAmount;
    const tempToAmount = toAmount;

    setFromToken(tempToToken);
    setToToken(tempFromToken);
    setFromAmount(tempToAmount);
    setToAmount(tempFromAmount);
  };

  useEffect(() => {
    if (
      fromToken &&
      toToken &&
      fromAmount &&
      price &&
      decimal &&
      isManualInput === "from"
    ) {
      setIsCalculating(true);
      const calculatedAmount =
        (Number(fromAmount) * Number(price[0])) / Number(price[1]);
      setToAmount(calculatedAmount.toFixed(6));
      setIsCalculating(false);
    }
  }, [fromToken, toToken, fromAmount, price, decimal, isManualInput]);

  useEffect(() => {
    if (
      fromToken &&
      toToken &&
      toAmount &&
      price &&
      decimal &&
      isManualInput === "to"
    ) {
      setIsCalculating(true);
      const calculatedAmount =
        (Number(toAmount) * Number(price[1])) / Number(price[0]);
      setFromAmount(calculatedAmount.toFixed(6));
      setIsCalculating(false);
    }
  }, [fromToken, toToken, toAmount, price, decimal, isManualInput]);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && !value.startsWith("-"))) {
      setIsManualInput("from");
      setFromAmount(value);
    }
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && !value.startsWith("-"))) {
      setIsManualInput("to");
      setToAmount(value);
    }
  };

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount || Number(fromAmount) <= 0) {
      toast.error("Please enter valid swap details");
      return;
    }

    try {
      const amountIn = parseUnits(fromAmount, fromToken.decimals);

      await writeSwap({
        address: lendingPool,
        abi: poolAbi,
        functionName: "swapTokenByPosition",
        args: [toToken.tokenAddress, fromToken.tokenAddress, amountIn],
      });

      toast.success("Swap initiated!");
    } catch (error) {
      console.error("Swap error:", error);
      toast.error("Failed to swap tokens");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] p-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[30%] w-[60%] h-[60%] bg-purple-500/10 rounded-full filter blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[30%] w-[60%] h-[60%] bg-blue-500/10 rounded-full filter blur-[120px]" />
      </div>

      <Card className="w-full max-w-lg mx-auto backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.57)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-b border-white/5">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Swap
            <span className="text-sm text-white">{positionAddress}</span> <br />
            {/* <span className="text-sm text-white">{Number(tokenBalance)}</span> */}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="from-amount" className="text-gray-300 font-medium">
              From
            </Label>
            <div className="flex space-x-2 relative group">
              <Input
                id="from-amount"
                type="number"
                placeholder="0.0"
                className="flex-grow backdrop-blur-sm bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 disabled:bg-slate-900/50"
                value={fromAmount}
                onChange={handleFromAmountChange}
                disabled={!fromToken}
                min="0"
                step="1"
              />
              <Select
                onValueChange={(value) =>
                  setFromToken(tokens.find((t) => t.symbol === value))
                }
                value={fromToken?.symbol}
              >
                <SelectTrigger className="w-[140px] backdrop-blur-sm bg-white/5 border border-white/10 text-white hover:bg-white/10 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-md bg-gray-900/90 border border-white/10 text-white">
                  {tokens.map((token) => (
                    <SelectItem
                      key={token.symbol}
                      value={token.symbol}
                      className="focus:bg-[#afafaf] hover:bg-white/10"
                    >
                      <div className="flex items-center space-x-2">
                        <Image
                          src={token.logo}
                          alt={token.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span>{token.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="absolute -bottom-0.5 left-0 right-0 h-[1px] bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-blue-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>
          </div>

          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full h-10 w-10 backdrop-blur-sm bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:text-purple-400 transition-all duration-300 transform hover:scale-110 hover:rotate-180 group"
              onClick={switchTokens}
              disabled={!fromToken || !toToken}
            >
              <ArrowDownUp className="h-4 w-4 group-hover:stroke-purple-400 transition-colors" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to-amount" className="text-gray-300 font-medium">
              To
            </Label>
            <div className="flex space-x-2 relative group">
              <Input
                id="to-amount"
                type="number"
                placeholder="0.0"
                className="flex-grow backdrop-blur-sm bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 disabled:bg-slate-900/50"
                value={toAmount}
                onChange={handleToAmountChange}
                disabled={!toToken}
                min="0"
                step="1"
              />
              <Select
                onValueChange={(value) =>
                  setToToken(tokens.find((t) => t.symbol === value))
                }
                value={toToken?.symbol}
              >
                <SelectTrigger className="w-[140px] backdrop-blur-sm bg-white/5 border border-white/10 text-white hover:bg-[white/10] focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-md bg-gray-900/90 border border-white/10 text-white">
                  {tokens.map((token) => (
                    <SelectItem
                      key={token.symbol}
                      value={token.symbol}
                      className="focus:bg-[#afafaf] hover:bg-[#2f77f5]"
                    >
                      <div className="flex items-center space-x-2">
                        <Image
                          src={token.logo}
                          alt={token.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span>{token.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="absolute -bottom-0.5 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-purple-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>
          </div>

          {fromToken && toToken && fromAmount && toAmount && (
            <div className="text-xs text-gray-400 px-2 text-right animate-fade-in">
              1 {fromToken.symbol} ≈{" "}
              {(Number(toAmount) / Number(fromAmount) || 0).toFixed(6)}{" "}
              {toToken.symbol}
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-gradient-to-r from-purple-500/5 to-blue-500/5 border-t border-white/5 pt-4">
          <Button
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-6 rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:translate-y-[-2px]"
            onClick={handleSwap}
            disabled={
              !fromToken ||
              !toToken ||
              !fromAmount ||
              isSwapPending ||
              isSwapLoading
            }
          >
            {isSwapPending || isSwapLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Swapping...
              </div>
            ) : (
              "Swap"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
