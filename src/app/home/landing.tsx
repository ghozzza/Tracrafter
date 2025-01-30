"use client"

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, LineChart, Github } from "lucide-react";
import { useReadContract,  useWriteContract, useWaitForTransactionReceipt  } from "wagmi";
import { abi } from "@/lib/abi/MOCKabi";


const LandingPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };
  const {data: hashTransction, isPending: isTransctionPending, writeContract: writeTransaction} = useWriteContract();
  const {isLoading: isTransactionLoading} = useWaitForTransactionReceipt({hash: hashTransction});
  const handleTransaction = async() => {
    await writeTransaction({abi: abi, address: "0x0ff609e5cc4ed4c967dac6584685183674cbaa24", functionName: "transfer", args: ["0x61F2B7781b3cb4B8eB77FC1aFd4F23179303AD66", 0]})
  }

  const {data : balance } = useReadContract({
    address: "0x0ff609e5cc4ed4c967dac6584685183674cbaa24", abi: abi, functionName: "balanceOf", args: ["0x61F2B7781b3cb4B8eB77FC1aFd4F23179303AD66"]
  })
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <button onClick={handleTransaction}>
        proses
      </button>
      <section className="relative h-screen flex flex-col justify-center items-center px-4 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-teal-500/10 animate-gradient-x bg-[length:200%_200%] blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4"
          >
            <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium">
              Welcome to the Future of DeFi
              {balance?.toString()}
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-400 to-purple-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Smart Collateral for Modern Finance
          </motion.h1>

          <motion.p
            className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the next generation of decentralized lending and borrowing with advanced smart contract technology.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 group">
              
              Launch App
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-600 bg-slate-400">
              <Github className="mr-2 w-4 h-4" />
              View on GitHub
            </Button>
          </motion.div>
        </div>

        {/* Floating cards */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {[1, 2, 3].map((_, index) => (
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
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for the Future
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform combines security, efficiency, and innovation to deliver the best DeFi experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Bank-Grade Security",
                description: "Multi-layered security protocols and regular audits ensure your assets are protected."
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Lightning Fast",
                description: "Optimized smart contracts for quick and efficient transactions."
              },
              {
                icon: <LineChart className="w-6 h-6" />,
                title: "Advanced Analytics",
                description: "Real-time data and insights to make informed decisions."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-800 hover:border-gray-700 transition-colors"
                {...fadeInUp}
                transition={{ delay: index * 0.2 }}
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 mb-4 md:mb-0">
            © 2025 Smart Collateral. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;