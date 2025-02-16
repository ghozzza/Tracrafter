"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreatePosition() {
  const [positionToken, setPositionToken] = useState("");

  const handleCreatePosition = () => {
    console.log("Creating position with", positionToken);
  };

  return (
    <div className="space-y-4 text-white">
      <Label htmlFor="positionToken">Position Token Address</Label>
      <Input id="positionToken" value={positionToken} onChange={(e) => setPositionToken(e.target.value)} />
      <Button onClick={handleCreatePosition}>Create Position</Button>
    </div>
  );
}