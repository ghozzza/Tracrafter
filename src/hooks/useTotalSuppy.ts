import { poolAbi } from "@/lib/abi/poolAbi";
import { useAccount, useReadContract } from "wagmi";
import { lendingPool } from "@/constants/addresses";

export const useSupplyShares = () => {
  const { data: supplyShares } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "totalSupplyShares",
    args: [],
  });

  return supplyShares ? Number(supplyShares) : 0;
};
export const useSupplyUser = () => {
  const { address } = useAccount();
  const { data: userSupply } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "userSupplyShares",
    args: [address],
  });

  return userSupply ? Number(userSupply) / 10 ** 6 : 0;
};

export const useSupplyAssets = () => {
  const { data: supplyAssets } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "totalSupplyAssets",
    args: [],
  });

  return supplyAssets ? Number(supplyAssets) : 0;
};
