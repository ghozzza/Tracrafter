import { Button } from "@/components/ui/button";
import { lendingPool } from "@/constants/addresses";
import { poolAbi } from "@/lib/abi/poolAbi";
import { positionAbi } from "@/lib/abi/positionAbi";
import Link from "next/link";
import React from "react";
import { Address } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { RepaySelectedToken } from "./RepaySelectedToken";
import { TOKEN_OPTIONS } from "@/constants/tokenOption";

const PositionToken = (props: any) => {
  const { address } = useAccount();
  const { data: tokenBalanceUSDC } = useReadContract({
    address: props.addressPosition as Address,
    abi: positionAbi,
    functionName: "tokenBalances",
    args: [props.address as Address],
  });
  const { data: collateralAddress } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "collateralToken",
  });
  const convertRealAmount = (amount: number, decimal: number) => {
    const realAmount = Number(amount) ? Number(amount) / decimal : 0; // convert to USDC
    return realAmount;
  };
  const { data: userCollateral } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "userCollaterals",
    args: [address],
  });
  const getDecimal = (address: Address | unknown) => {
    const token = TOKEN_OPTIONS.find((asset) => asset.address === address);
    return token?.decimals;
  };
  return (
    <>
      <div className="bg-slate-600 w-full py-2">
        {/* <p>${findNameToken(mockUsdc)}</p> */}
        <p>${props.name}</p>
      </div>
      <div className="bg-slate-600 w-full py-2">
        <p>
          {collateralAddress == props.address
            ? convertRealAmount(Number(userCollateral), props.decimal).toFixed(
                2
              )
            : convertRealAmount(
                Number(tokenBalanceUSDC),
                props.decimal
              ).toFixed(2)}
        </p>
      </div>
      <div className="bg-slate-600 w-full py-2">
        <div className="flex justify-center gap-2">
          <div>
            <Link href={"/trade"}>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Trade
              </Button>
            </Link>
            {/* <Button
            size="sm"
            variant="outline"
            className="border-slate-600 text-slate-600 hover:bg-slate-400"
            >
            Repay
            </Button> */}
          </div>
          <div className="text-black">
            <RepaySelectedToken
              name={props.name}
              balance={
                collateralAddress == props.address
                  ? convertRealAmount(
                      Number(userCollateral),
                      props.decimal
                    ).toFixed(2)
                  : convertRealAmount(
                      Number(tokenBalanceUSDC),
                      props.decimal
                    ).toFixed(2)
              }
              address={props.address}
              decimal={getDecimal(props.address)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PositionToken;
