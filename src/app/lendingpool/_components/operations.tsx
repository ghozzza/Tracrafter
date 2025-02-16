"use client"

import * as React from "react"
import { ChevronDown, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ArbitrumMarket() {
  const [showSupplyModal, setShowSupplyModal] = React.useState(false)
  const [showBorrowModal, setShowBorrowModal] = React.useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Manta Network</h1>
          <ChevronDown className="h-5 w-5" />
        </div>
        <Button variant="secondary">VIEW TRANSACTIONS</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <div className="text-sm text-gray-400">Net worth</div>
          <div className="text-2xl font-bold">$0.48</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Net APY</div>
          <div className="text-2xl font-bold">1.79%</div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Health factor</span>
            <Button size="sm" className="bg-slate-200 text-slate-800">
              RISK DETAILS
            </Button>
          </div>
          <div className="text-2xl font-bold text-green-500">13.36</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Supplies Section */}
        <div className="bg-slate-900 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl">Your supplies</h2>
            <Button variant="ghost" size="sm">
              Hide
            </Button>
          </div>

          <div className="grid gap-4 mb-6">
            <div className="flex justify-between text-sm text-gray-400">
              <div>
                Balance <span className="text-white">$0.51</span>
              </div>
              <div>
                APY <span className="text-white">1.68%</span>
              </div>
              <div>
                Collateral <span className="text-white">$0.51</span>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>APY</TableHead>
                <TableHead>Collateral</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-700 rounded-full hidden" />
                  ETH
                </TableCell>
                <TableCell>
                  0.0001900
                  <div className="text-sm text-gray-400">$0.51</div>
                </TableCell>
                <TableCell>1.68%</TableCell>
                <TableCell>
                  <Switch />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-3 py-2 rounded-md hover:from-purple-600 hover:to-pink-600 border-none">Switch</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Switch Asset</DialogTitle>
                          <DialogDescription>Choose an asset to switch to</DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className=" bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 py-2 rounded-md hover:from-gray-500 hover:to-gray-600 border-none">Withdraw</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Withdraw Asset</DialogTitle>
                          <DialogDescription>Enter amount to withdraw</DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Borrows Section */}
        <div className="bg-slate-900 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl">Your borrows</h2>
              <div className="hidden flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-lg">
                <span>E-Mode</span>
                <Settings2 className="h-4 w-4" />
                <span className="text-xs bg-slate-700 px-2 py-0.5 rounded">DISABLED</span>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Hide
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Debt</TableHead>
                <TableHead>APY</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full hidden" />
                  USDC
                </TableCell>
                <TableCell>
                  0.0000100
                  <div className="text-sm text-gray-400">$0.03</div>
                </TableCell>
                <TableCell>{"<0.01%"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-3 py-2 rounded-md hover:from-purple-600 hover:to-pink-600 border-none">Switch</Button>
                    <Button className=" bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 py-2 rounded-md hover:from-gray-500 hover:to-gray-600 border-none">Repay</Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Assets Lists */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Assets to Supply */}
        <div className="bg-slate-900 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl">Assets to supply</h2>
            <Button variant="ghost" size="sm">
              Hide
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assets</TableHead>
                <TableHead>Wallet balance</TableHead>
                <TableHead>APY</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-700 rounded-full hidden" />
                  ETH
                </TableCell>
                <TableCell>0.0012230</TableCell>
                <TableCell>1.68%</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-3 py-2 rounded-md hover:from-purple-600 hover:to-pink-600 border-none">Supply</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Supply Asset</DialogTitle>
                        <DialogDescription>Enter amount to supply</DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Assets to Borrow */}
        <div className="bg-slate-900 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl">Assets to borrow</h2>
            <Button variant="ghost" size="sm">
              Hide
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>APY, variable</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { name: "ETH", amount: "0.0001387", value: "$0.37", apy: "2.45%" },
                { name: "USDC", amount: "0.3734140", value: "$0.37", apy: "7.26%" },
                { name: "WBTC", amount: "0.0000039", value: "$0.37", apy: "0.26%" },
              ].map((asset) => (
                <TableRow key={asset.name}>
                  <TableCell className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-700 rounded-full hidden" />
                    {asset.name}
                  </TableCell>
                  <TableCell>
                    {asset.amount}
                    <div className="text-sm text-gray-400">{asset.value}</div>
                  </TableCell>
                  <TableCell>{asset.apy}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-3 py-2 rounded-md hover:from-purple-600 hover:to-pink-600 border-none">Borrow</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Borrow Asset</DialogTitle>
                            <DialogDescription>Enter amount to borrow</DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className=" bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 py-2 rounded-md hover:from-gray-500 hover:to-gray-600 border-none">Details</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Asset Details</DialogTitle>
                            <DialogDescription>View detailed information about this asset</DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

