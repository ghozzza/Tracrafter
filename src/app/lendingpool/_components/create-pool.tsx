"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreatePool() {
  const [token1, setToken1] = useState("");
  const [token2, setToken2] = useState("");
  const [ltv, setLtv] = useState("0");

  const handleCreatePool = () => {
    console.log("Creating pool with", token1, token2, ltv);
  };

  return (
    <div className="space-y-4 text-white">
      <Label htmlFor="token1">Token 1 Address</Label>
      <Input id="token1" value={token1} onChange={(e) => setToken1(e.target.value)} />
      <Label htmlFor="token2">Token 2 Address</Label>
      <Input id="token2" value={token2} onChange={(e) => setToken2(e.target.value)} />
      <Label htmlFor="ltv">LTV</Label>
      <Input id="ltv" type="number" value={ltv} onChange={(e) => setLtv(e.target.value)} />
      <Button onClick={handleCreatePool}>Create Lending Pool</Button>
    </div>
  );
}