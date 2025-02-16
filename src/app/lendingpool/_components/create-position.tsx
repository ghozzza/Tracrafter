"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { CuboidIcon as Cube, ArrowRight } from "lucide-react";

const contractAddress = "0xYourContractAddress";
const contractAbi = [
  {
    inputs: [
      { internalType: "address", name: "_collateral1", type: "address" },
      { internalType: "address", name: "_borrow", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "swapToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default function CreatePosition() {
  const [positionToken, setPositionToken] = useState("");
  const [amount, setAmount] = useState("");
  const { writeContract, isPending } = useWriteContract();

  const handleCreatePosition = async () => {
    if (!positionToken || !amount) return;

    try {
      await writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "swapToken",
        args: [positionToken, parseEther(amount)],
      });

      console.log("Transaction sent!");
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-50 border border-gray-700">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Cube className="w-8 h-8 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Create Position</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label
              htmlFor="positionToken"
              className="text-sm font-medium text-gray-300"
            >
              Position Token Address
            </Label>
            <Input
              id="positionToken"
              value={positionToken}
              onChange={(e) => setPositionToken(e.target.value)}
              className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0x..."
            />
          </div>

          <div>
            <Label
              htmlFor="amount"
              className="text-sm font-medium text-gray-300"
            >
              Amount
            </Label>
            <Input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.0"
            />
          </div>

          <Button
            onClick={handleCreatePosition}
            disabled={isPending}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          >
            {isPending ? (
              <span className="flex items-center justify-center">
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
                Creating...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Create Position
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
