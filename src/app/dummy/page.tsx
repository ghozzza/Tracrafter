import React from 'react';
import ChartContainer from '@/components/trading/ChartContainer';
import OrderBook from '@/components/trading/OrderBook';
import TradeList from '@/components/trading/TradeList';
import PositionList from '@/components/trading/PositionList';
import TradingForm from '@/components/trading/TradingForm';

export default function TradingPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-20">
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
      </div>
    </div>
  );
} 