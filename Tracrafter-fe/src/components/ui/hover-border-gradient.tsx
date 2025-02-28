"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1.5, // Increased duration for smoother animation
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  // Enhanced gradient effects with purple and blue tones
  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(30% 50% at 50% 0%, rgba(147, 51, 234, 0.7) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(25% 50% at 0% 50%, rgba(147, 51, 234, 0.7) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM:
      "radial-gradient(30% 50% at 50% 100%, rgba(147, 51, 234, 0.7) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(255, 255, 255, 0) 100%)",
    RIGHT:
      "radial-gradient(25% 50% at 100% 50%, rgba(147, 51, 234, 0.7) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(255, 255, 255, 0) 100%)",
  };

  // Enhanced hover highlight with more vibrant colors
  const highlight =
    "radial-gradient(100% 200% at 50% 50%, rgba(147, 51, 234, 0.8) 0%, rgba(59, 130, 246, 0.6) 50%, rgba(255, 255, 255, 0) 100%)";

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration]);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border border-opacity-20 content-center bg-black/20 hover:bg-black/10 transition-all duration-500 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-[2px] decoration-clone w-fit",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "w-auto text-white z-10 bg-black/80 px-6 py-3 rounded-[inherit] transition-all duration-300 hover:bg-black/60",
          className
        )}
      >
        {children}
      </div>
      <motion.div
        className={cn(
          "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        )}
        style={{
          filter: "blur(4px)", // Increased blur for more noticeable effect
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
        }}
        transition={{
          ease: "easeInOut",
          duration: duration,
        }}
      />
      <div className="bg-black/90 absolute z-1 flex-none inset-[2px] rounded-[100px]" />
    </Tag>
  );
}
