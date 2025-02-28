"use client";
import React from "react";
import { HoverBorderGradient } from "./hover-border-gradient";
import Link from "next/link";

export function HoverBorderGradientDemo() {
  return (
    <Link href={"/lending"} className="flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="bg-slate-800 text-white flex space-x-2"
      >
        <span>Start now</span>
      </HoverBorderGradient>
    </Link>
  );
}
