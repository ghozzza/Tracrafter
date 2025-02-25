"use client";
import { Button } from "@/components/ui/button";
import { factory, mockUsde, priceFeed } from "@/constants/addresses";
import { priceAbi } from "@/lib/abi/price-abi";
import React, { useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

const page = () => {
  const {
    data: hashTransaction,
    isPending: isTransactionPending,
    writeContract: writeTransaction,
  } = useWriteContract();
  const { isLoading: isTransactionLoading } = useWaitForTransactionReceipt({
    hash: hashTransaction,
  });
  const handlePrice = () => {
    fetchData(
      "https://min-api.cryptocompare.com/data/price?fsym=USDe&tsyms=USD"
    )
      .then((data) =>
        writeTransaction({
          abi: priceAbi,
          address: priceFeed,
          functionName: "addPriceManual",
          args: ["USDe/USD", mockUsde, data?.USD * 10 ** 8, 18],
        })
      )
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="flex justify-center items-center mt-40">
      <Button
        onClick={handlePrice}
        className="bg-violet-400 hover:bg-violet-600 duration-300"
      >
        Price USDe/USD
      </Button>
    </div>
  );
};

const fetchData = async (url: string): Promise<any> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error: ", error);
    throw error;
  }
};

export default page;
