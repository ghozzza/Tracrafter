import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WalletBalance from "../../../components/get-balance";
import { poolAbi } from "@/lib/abi/poolAbi";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { lendingPool } from "@/constants/addresses";

interface SupplyDialogProps {
  poolId: number;
  token: string;
  apy: string;
}

const SupplyDialog = ({ poolId, token, apy }: SupplyDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [supplyAmount, setSupplyAmount] = useState("");

  const {
    data: hashTransction,
    isPending: isTransctionPending,
    writeContract: writeTransaction,
  } = useWriteContract();
  const { isLoading: isTransactionLoading } = useWaitForTransactionReceipt({
    hash: hashTransction,
  });
  const handleTransaction = async () => {
    if (!supplyAmount) return;
    try {
      await writeTransaction({
        abi: poolAbi,
        address: lendingPool,
        functionName: "supply",
        args: [BigInt(supplyAmount)],
      });
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border-blue-500/50 text-blue-400 hover:text-blue-300 transition-all duration-200 hover:border-blue-400/50"
        onClick={() => setIsOpen(true)}
      >
        Supply
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Supply {token}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Supply your {token} to earn {apy}% APY
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Amount to Supply
              </label>
              <Input
                type="number"
                value={supplyAmount}
                onChange={(e) => setSupplyAmount(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder={`Enter ${token} amount`}
              />
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">your balance:</span>
                <span>
                  <WalletBalance />
                </span>
              </div>
            </div>

            <Button
              onClick={handleTransaction}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/20"
            >
              confirm supply
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupplyDialog;
