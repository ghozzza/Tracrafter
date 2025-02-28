import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, ArrowRight, Info } from "lucide-react";
import { poolAbi } from "@/lib/abi/poolAbi";
import { mockErc20Abi } from "@/lib/abi/mockErc20Abi";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { lendingPool, mockUsdc } from "@/constants/addresses";
import { useUsdcBalance } from "@/hooks/useTokenBalance";

interface SupplyDialogProps {
  poolId: number;
  token: string;
  apy: string;
}

const SupplyDialog = ({ poolId, token, apy }: SupplyDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [supplyAmount, setSupplyAmount] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  const usdcBalance = useUsdcBalance();

  const {
    data: approveHash,
    isPending: isApprovePending,
    writeContract: approveTransaction,
  } = useWriteContract();

  const {
    data: supplyHash,
    isPending: isSupplyPending,
    writeContract: supplyTransaction,
  } = useWriteContract();

  const { isLoading: isApproveLoading } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const { isLoading: isSupplyLoading } = useWaitForTransactionReceipt({
    hash: supplyHash,
  });

  const handleTransaction = async () => {
    if (!supplyAmount || isNaN(Number(supplyAmount))) {
      console.error("Invalid supply amount");
      return;
    }

    const supplyAmountBigInt = BigInt(Number(supplyAmount) * 10 ** 6);

    try {
      console.log("⏳ Sending approval transaction...");

      await approveTransaction({
        abi: mockErc20Abi,
        address: mockUsdc,
        functionName: "approve",
        args: [lendingPool, supplyAmountBigInt],
      });

      console.log("✅ Approval transaction sent, waiting for confirmation...");

      await new Promise((resolve) => setTimeout(resolve, 5000));

      console.log("✅ Approval confirmed, proceeding with supply...");

      await supplyTransaction({
        abi: poolAbi,
        address: lendingPool,
        functionName: "supply",
        args: [supplyAmountBigInt],
      });

      console.log("🚀 Supply transaction sent!");
    } catch (error) {
      console.error("❌ Transaction failed:", error);
    }
  };

  useEffect(() => {
    if (isSupplyLoading) {
      setTimeout(() => setIsOpen(false), 2000);
    }
  }, [isSupplyLoading]);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border-blue-500/50 text-blue-400 hover:text-blue-300 transition-all duration-300 hover:border-blue-400/50 hover:scale-105 transform"
        onClick={() => setIsOpen(true)}
      >
        Supply
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl rounded-xl max-w-md w-full mx-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Supply {token}
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">
              Earn {apy}% APY by supplying your {token}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                Amount to Supply
                <Info size={16} className="text-gray-400 cursor-help" />
              </label>
              <Input
                type="number"
                value={supplyAmount}
                onChange={(e) => setSupplyAmount(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder={`Enter ${token} amount`}
              />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Your balance:</span>
                <span className="font-medium text-blue-400">{usdcBalance}</span>
              </div>
            </div>

            <Button
              onClick={handleTransaction}
              disabled={isApprovePending || isSupplyPending}
              className={`w-full py-3 text-lg font-semibold transition-all duration-300 ${
                isHovering
                  ? "bg-gradient-to-r from-emerald-500 to-blue-500"
                  : "bg-gradient-to-r from-emerald-600 to-blue-600"
              } text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transform`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {isApproveLoading || isSupplyLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-5 w-5" />
              )}
              {isApproveLoading
                ? "Approving..."
                : isSupplyLoading
                ? "Supplying..."
                : "Confirm Supply"}
            </Button>
          </div>

          {(isApproveLoading || isSupplyLoading) && (
            <div className="mt-4 text-center text-gray-300 animate-pulse">
              Transaction in progress...
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupplyDialog;
