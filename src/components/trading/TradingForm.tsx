'use client';

import React from 'react';

export default function TradingForm() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Buy Form */}
      <div className="p-4 rounded-lg bg-[#252547] bg-opacity-50">
        <h3 className="text-lg font-semibold mb-4 text-green-400">Buy</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Price</label>
            <input
              type="number"
              className="w-full  border border-gray-700 rounded p-2 text-white"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Amount</label>
            <input
              type="number"
              className="w-full  border border-gray-700 rounded p-2 text-white"
              placeholder="0.00"
            />
          </div>
          <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded transition-colors">
            Buy BTC
          </button>
        </div>
      </div>

      {/* Sell Form */}
      <div className="p-4 rounded-lg bg-[#252547]">
        <h3 className="text-lg font-semibold mb-4 text-red-400">Sell</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Price</label>
            <input
              type="number"
              className="w-full  border border-gray-700 rounded p-2 text-white"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Amount</label>
            <input
              type="number"
              className="w-full  border border-gray-700 rounded p-2 text-white"
              placeholder="0.00"
            />
          </div>
          <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition-colors">
            Sell BTC
          </button>
        </div>
      </div>
    </div>
  );
} 