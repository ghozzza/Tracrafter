'use client';

import React from 'react';

export default function TradeList() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">Recent Trades</h2>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className={i % 2 === 0 ? 'text-green-400' : 'text-red-400'}>
              41,230.75
            </span>
            <span className="text-gray-400">0.2345</span>
            <span className="text-gray-400">12:30:45</span>
          </div>
        ))}
      </div>
    </div>
  );
} 