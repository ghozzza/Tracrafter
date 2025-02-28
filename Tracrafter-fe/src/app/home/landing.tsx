"use client";

import { motion } from "framer-motion";
import { HoverBorderGradientDemo } from "@/components/ui/HoverBorderGradientDemo";
import { useEffect, useState } from "react";

const LandingPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("resize", checkMobile);
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden fixed inset-0">
      <section className="h-full flex flex-col justify-center items-center px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-teal-500/10 animate-gradient-x bg-[length:200%_200%] blur-2xl md:blur-3xl" />

        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {isMobile ? (
            <div
              className="absolute w-full flex gap-x-8 justify-center items-center"
              style={{ top: "63%", transform: "translateY(-50%)" }}
            >
              {/* Left Box */}
              <motion.div
                className="w-52 h-40 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl backdrop-blur-sm border border-white/10"
                animate={{
                  y: [0, -10, 0],
                  rotate: [-2, 0, -2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Right Box */}
              <motion.div
                className="w-52 h-40 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl backdrop-blur-sm border border-white/10"
                animate={{
                  y: [0, -10, 0],
                  rotate: [2, 0, 2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          ) : (
            // Desktop layout remains unchanged
            [1, 2, 3].map((_, index) => (
              <motion.div
                key={index}
                className="absolute w-64 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl backdrop-blur-sm border border-white/10"
                style={{
                  left: `${20 + index * 25}%`,
                  top: `${30 + index * 15}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  delay: index,
                  ease: "easeInOut",
                }}
              />
            ))
          )}
        </motion.div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium">
              Welcome to the Future of DeFi
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-400 to-purple-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Smart Collateral for Modern Finance
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Experience the next generation of decentralized lending and
            borrowing with advanced smart contract technology.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4 relative z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <HoverBorderGradientDemo />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
