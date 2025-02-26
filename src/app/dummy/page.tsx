"use client"
import React, { useState } from 'react';
import ChartContainer from '@/components/trading/ChartContainer';
import OrderBook from '@/components/trading/OrderBook';
import TradeList from '@/components/trading/TradeList';
import PositionList from '@/components/trading/PositionList';
import TradingForm from '@/components/trading/TradingForm';
import TokenSwap from '@/app/swap/page';

export default function TradingPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20 ">
      <div className="col-span-12 mt-4 my-8">
        <button
          className="relative inline-flex items-center px-6 py-3 rounded-lg
            bg-gradient-to-r from-blue-800  to-blue-600
            hover:from-blue-600 hover:via-blue-700 hover:to-blue-800
            text-white font-semibold
            transition-all duration-300 ease-in-out
            shadow-[0_0_20px_rgba(59,130,246,0.5)]
            hover:shadow-[0_0_25px_rgba(59,130,246,0.8)]
            border border-blue-400/50
            hover:scale-105
            overflow-hidden
            before:absolute before:inset-0
            before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
            before:translate-x-[-200%] hover:before:translate-x-[200%]
            before:transition-transform before:duration-700
            before:pointer-events-none"
          onClick={togglePopup}
        >
          Swap Token
        </button>
      </div>
      <div className="grid grid-cols-12 gap-4">
        {/* Chart Section */}
        <div className="col-span-12 lg:col-span-8 bg-[#1C1C3B] rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-white">Price Chart</h2>
          <ChartContainer />
        </div>

        {/* Order Book Section */}
        <div className="col-span-12 lg:col-span-4 bg-[#1C1C3B] rounded-lg p-4">
          <OrderBook />
        </div>

        {/* Trading Form */}
        <div className="col-span-12 lg:col-span-8 bg-[#1C1C3B] rounded-lg p-4">
          <TradingForm />
        </div>

        {/* Trade List & Position List */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-[#1C1C3B] rounded-lg p-4">
            <TradeList />
          </div>
          <div className="bg-[#1C1C3B] rounded-lg p-4">
            <PositionList />
          </div>
        </div>

        {/* Button to open TokenSwap Popup */}

      </div>

      {/* Popup for TokenSwap */}
      {isPopupOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-10"
          onClick={togglePopup}
        >
          <div
            className="p-6 rounded-lg shadow-lg relative w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-2 right-2 text-white" onClick={togglePopup}>
              ✖
            </button>
            <TokenSwap />
          </div>
        </div>
      )}

    </div>
  );
} 