import { lendingPool } from "@/constants/addresses";
import { poolAbi } from "@/lib/abi/poolAbi";
import { useAccount, useReadContract } from "wagmi";
import { Address } from 'viem';

export const userBorrowShares = (address: Address) => {
  const { data: result } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "userBorrowShares",
    args: [address],
  });
  return result;
};
