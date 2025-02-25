'use client';

import React from 'react';

export default function PositionList() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">Positions</h2>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-[#252547] p-3 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-white">BTC/USDT</span>
              <span className={i % 2 === 0 ? 'text-green-400' : 'text-red-400'}>
                Long
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Size: 0.5 BTC</span>
              <span>PnL: +$245.50</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 