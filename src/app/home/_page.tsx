"use client"

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <div className="min-h-screen  text-white">
      {/* Header */}

      {/* Hero Section */}
      <section className="h-[90vh] flex flex-col justify-center items-center text-center px-4">
        <motion.h1
          className="text-5xl font-extrabold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Revolutionize Your DeFi Experience
        </motion.h1>
        <motion.p
          className="text-lg max-w-xl mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Secure and flexible smart collateral solutions designed for the future of decentralized finance.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button size="lg" className="bg-blue-600 hover:bg-blue-500">Get Started</Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-gray-400">Discover the advantages of using our platform.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Security', 'Flexibility', 'Transparency'].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gray-800 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h3 className="text-xl font-bold mb-2">{feature}</h3>
              <p className="text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 text-center">
        <p className="text-gray-500">&copy; 2025 Smart Collateral. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
