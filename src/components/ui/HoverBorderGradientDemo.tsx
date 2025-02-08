"use client";
import React from "react";
import { HoverBorderGradient } from "./hover-border-gradient";

export function HoverBorderGradientDemo() {
  return (
    <div className="flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="bg-slate-800 text-white flex space-x-2"
      >
        <span>Start now</span>
      </HoverBorderGradient>
    </div>
  );
}
