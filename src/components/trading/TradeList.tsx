'use client';

import React, { useEffect, useState } from 'react';

interface Trade {
  price: string;
  quantity: string;
  time: number;
  isBuyerMaker: boolean;
}

export default function TradeList() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const symbol = 'btcusdt';

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws');

    ws.onopen = () => {
      ws.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: [`${symbol}@trade`],
        id: 1
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.e === 'trade') {
        setTrades(prev => [{
          price: data.p,
          quantity: data.q,
          time: data.T,
          isBuyerMaker: data.m
        }, ...prev].slice(0, 5));
      }
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">Recent Trades</h2>
      <div className="space-y-2">
        {trades.map((trade, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className={trade.isBuyerMaker ? 'text-red-400' : 'text-green-400'}>
              {parseFloat(trade.price).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
            <span className="text-gray-400">
              {parseFloat(trade.quantity).toFixed(4)}
            </span>
            <span className="text-gray-400">{formatTime(trade.time)}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 