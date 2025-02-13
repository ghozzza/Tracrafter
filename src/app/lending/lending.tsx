import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DollarSign, Wallet } from "lucide-react";
import Image from "next/image";

export default function LendingPage() {
  return (
    <div className="min-h-screen  p-8">
      <div className="mx-auto max-w-6xl space-y-8 mt-5">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-4xl font-bold text-white">
            <Wallet className="h-12 w-12 text-blue-500" />
            <h1>Lending</h1>
          </div>
          <p className="text-slate-400">The Best DeFi Yields In 1-Click</p>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-slate-900/50 p-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-emerald-500" />
            <div>
              <p className="text-sm text-slate-400">Total Lendings</p>
              <p className="text-xl font-bold text-white">$29,137,920</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-slate-400">Liquidity Total Supply</p>
              <p className="text-xl font-bold text-white">$63,857,824</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {tokens.map((token) => (
            <Card
              key={token.name}
              className="bg-slate-900/50 backdrop-blur border-slate-800"
            >
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-lg text-blue-400">{token.symbol}</span>
                  <span className="text-white font-bold">${token.balance}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative h-24 w-24">
                    <Image
                      src={token.icon || "/placeholder.svg"}
                      alt={token.name}
                      width={96}
                      height={96}
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Earnings</span>
                    <span>-</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Net APR</span>
                    <span className="text-white font-bold">{token.apr}%</span>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  START EARNING
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

const tokens = [
  {
    name: "Ethereum",
    symbol: "0 ETH",
    balance: "0.00",
    apr: "1.44",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/800px-Ethereum-icon-purple.svg.png",
  },
  {
    name: "USD Coin",
    symbol: "0 USDC",
    balance: "0.00",
    apr: "9.72",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Circle_USDC_Logo.svg/1200px-Circle_USDC_Logo.svg.png",
  },
  {
    name: "Tether USD",
    symbol: "0 USDT",
    balance: "0.00",
    apr: "10.75",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Tether_USDT.png/1024px-Tether_USDT.png",
  },
];
