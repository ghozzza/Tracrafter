"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Operations() {
  const [amount, setAmount] = useState("0");

  const handleOperation = (operation: string) => {
    console.log(`Executing ${operation} with amount`, amount);
  };

  return (
    <div className="space-y-4 text-white">
      <Label htmlFor="amount">Amount</Label>
      <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => handleOperation("supply")}>Supply</Button>
        <Button onClick={() => handleOperation("withdraw")}>Withdraw</Button>
        <Button onClick={() => handleOperation("borrow")}>Borrow</Button>
        <Button onClick={() => handleOperation("repay")}>Repay</Button>
      </div>
    </div>
  );
}