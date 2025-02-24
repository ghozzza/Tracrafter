'use client';

import React from 'react';
import { createChart, ColorType, IChartApi, CandlestickData } from 'lightweight-charts';

export default function TradingChart() {
  const chartContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (chartContainerRef.current) {
      const chart: IChartApi = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#DDD',
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#2B2B43' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
      });

      const candleSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350'
      });

      const data: CandlestickData[] = [
        { time: '2023-01-01' as string, open: 100, high: 105, low: 95, close: 102 },
        { time: '2023-01-02' as string, open: 102, high: 108, low: 100, close: 105 },
        { time: '2023-01-03' as string, open: 105, high: 110, low: 101, close: 109 },
        { time: '2023-01-04' as string, open: 109, high: 115, low: 107, close: 110 },
        { time: '2023-01-05' as string, open: 110, high: 112, low: 105, close: 107 },
      ];

      candleSeries.setData(data);
      chart.timeScale().fitContent();

      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, []);

  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
} 