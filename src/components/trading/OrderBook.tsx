'use client';

import React from 'react';

export default function OrderBook() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">Order Book</h2>
      <div className="space-y-2">
        {/* Asks */}
        <div className="space-y-1">
          {[...Array(5)].map((_, i) => (
            <div key={`ask-${i}`} className="flex justify-between text-red-400 text-sm">
              <span>41,235.50</span>
              <span>0.5234</span>
            </div>
          ))}
        </div>

        {/* Current Price */}
        <div className="text-center py-2 text-white font-semibold">
          41,230.75 USDT
        </div>

        {/* Bids */}
        <div className="space-y-1">
          {[...Array(5)].map((_, i) => (
            <div key={`bid-${i}`} className="flex justify-between text-green-400 text-sm">
              <span>41,225.50</span>
              <span>0.6234</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 