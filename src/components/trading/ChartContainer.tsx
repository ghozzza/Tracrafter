'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const TradingChart = dynamic(() => import('./TradingChart'), {
  ssr: false,
});

export default function ChartContainer() {
  return <TradingChart />;
} 