import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AssetItem {
  id: string
  name: string
  available: number
  apy: number
}

interface AssetsToBorrowProps {
  assets: AssetItem[]
}

export default function AssetsToBorrow({ assets }: AssetsToBorrowProps) {
  return (
    <Card className="bg-slate-900/50 border-none shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-medium text-slate-200">Assets to borrow</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-slate-400">
            <div className="col-span-3">Asset</div>
            <div className="col-span-3">Available</div>
            <div className="col-span-3">APY, variable</div>
            <div className="col-span-3">Action</div>
          </div>

          {assets.map((asset) => (
            <div key={asset.id} className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-[#31323d] rounded-lg">
              <div className="col-span-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10" />
                <span className="font-medium text-slate-400">{asset.name}</span>
              </div>
              <div className="col-span-3 text-slate-400">{asset.available}</div>
              <div className="col-span-3 text-slate-400">{asset.apy}%</div>
              <div className="col-span-3 flex gap-2">
                <Button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-purple-600 hover:to-pink-600 border-none">
                  Borrow
                </Button>
                <Button className="hidden bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-purple-600 hover:to-pink-600 border-none">
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

