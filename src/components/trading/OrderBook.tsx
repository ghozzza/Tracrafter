'use client';

import React, { useEffect, useState } from 'react';

interface OrderBookData {
  bids: [string, string][];
  asks: [string, string][];
}

export default function OrderBook() {
  const [orderBook, setOrderBook] = useState<OrderBookData>({ bids: [], asks: [] });
  const symbol = 'btcusdt';
  const DEPTH_LIMIT = 5;

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws');

    ws.onopen = () => {
      ws.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: [`${symbol}@depth@100ms`],
        id: 1
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.a || data.b) { // Check if it's order book data
        setOrderBook(prev => ({
          asks: [...(data.a || []).slice(0, DEPTH_LIMIT)],
          bids: [...(data.b || []).slice(0, DEPTH_LIMIT)]
        }));
      }
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  const formatNumber = (num: string) => {
    return parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">Order Book</h2>
      <div className="space-y-2">
        {/* Asks */}
        <div className="space-y-1">
          {orderBook.asks.map(([price, amount], i) => (
            <div key={`ask-${i}`} className="flex justify-between text-red-400 text-sm">
              <span>{formatNumber(price)}</span>
              <span>{formatNumber(amount)}</span>
            </div>
          ))}
        </div>

        {/* Spread */}
        {orderBook.asks[0] && orderBook.bids[0] && (
          <div className="text-center py-2 text-white font-semibold">
            Spread: {(parseFloat(orderBook.asks[0][0]) - parseFloat(orderBook.bids[0][0])).toFixed(2)} USDT
          </div>
        )}

        {/* Bids */}
        <div className="space-y-1">
          {orderBook.bids.map(([price, amount], i) => (
            <div key={`bid-${i}`} className="flex justify-between text-green-400 text-sm">
              <span>{formatNumber(price)}</span>
              <span>{formatNumber(amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 