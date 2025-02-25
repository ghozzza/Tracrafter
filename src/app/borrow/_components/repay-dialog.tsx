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
import { Loader2, CheckCircle, Info } from "lucide-react";
import { poolAbi } from "@/lib/abi/poolAbi";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { lendingPool } from "@/constants/addresses";
import USDCBalance from "@/hooks/useTokenBalance";

interface RepayDialogProps {
  poolId: number;
  token: string;
  interest: string;
}

const RepayDialog = ({ poolId, token, interest }: RepayDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [repayAmount, setRepayAmount] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  const {
    data: repayHash,
    isPending: isRepayPending,
    writeContract: repayTransaction,
  } = useWriteContract();

  const { isLoading: isRepayLoading } = useWaitForTransactionReceipt({
    hash: repayHash,
  });

  const handleTransaction = async () => {
    if (!repayAmount || isNaN(Number(repayAmount))) {
      console.error("Invalid repay amount");
      return;
    }

    const repayAmountBigInt = BigInt(Number(repayAmount) * 10 ** 6);

    try {
      console.log("⏳ Sending repay transaction...");

      await repayTransaction({
        abi: poolAbi,
        address: lendingPool,
        functionName: "repay",
        args: [repayAmountBigInt],
      });

      console.log("🚀 Repay transaction sent!");
    } catch (error) {
      console.error("❌ Transaction failed:", error);
    }
  };

  useEffect(() => {
    if (isRepayLoading) {
      setTimeout(() => setIsOpen(false), 2000);
    }
  }, [isRepayLoading]);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="bg-gradient-to-r from-green-500/10 to-teal-500/10 hover:from-green-500/20 hover:to-teal-500/20 border-green-500/50 text-green-400 hover:text-green-300 transition-all duration-300 hover:border-green-400/50 hover:scale-105 transform"
        onClick={() => setIsOpen(true)}
      >
        Repay
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl rounded-xl max-w-md w-full mx-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">
              Repay {token}
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">
              Repay your borrowed {token} + {interest}% interest
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                Amount to Repay
                <Info size={16} className="text-gray-400 cursor-help" />
              </label>
              <Input
                type="number"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white focus:ring-2 focus:ring-green-500 transition-all duration-300"
                placeholder={`Enter ${token} amount`}
              />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Your balance:</span>
                <span className="font-medium text-green-400">
                  <USDCBalance />
                </span>
              </div>
            </div>

            <Button
              onClick={handleTransaction}
              disabled={isRepayPending}
              className={`w-full py-3 text-lg font-semibold transition-all duration-300 ${
                isHovering
                  ? "bg-gradient-to-r from-green-500 to-teal-500"
                  : "bg-gradient-to-r from-green-600 to-teal-600"
              } text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transform`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {isRepayLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-5 w-5" />
              )}
              {isRepayLoading ? "Repaying..." : "Confirm Repay"}
            </Button>
          </div>

          {isRepayLoading && (
            <div className="mt-4 text-center text-gray-300 animate-pulse">
              Transaction in progress...
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RepayDialog;
