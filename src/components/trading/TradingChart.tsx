'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, CandlestickData } from 'lightweight-charts';

const BINANCE_REST_API = 'https://api.binance.com/api/v3';
const BINANCE_WS_API = 'wss://stream.binance.com:9443/ws';

export default function TradingChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const candleSeriesRef = useRef<any>(null);
  const [symbol] = useState('btcusdt'); // Bisa dibuat dinamis nanti
  const [interval] = useState('1m'); // 1 menit candlestick

  // Fungsi untuk mengambil data historis
  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(
        `${BINANCE_REST_API}/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=1000`
      );
      const data = await response.json();
      
      return data.map((d: any) => ({
        time: d[0] / 1000,
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4])
      }));
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return [];
    }
  };

  // Setup chart dan WebSocket
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Inisialisasi chart
    const chart = createChart(chartContainerRef.current, {
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
    
    chartRef.current = chart;

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350'
    });
    
    candleSeriesRef.current = candleSeries;

    // Ambil data historis
    fetchHistoricalData().then((data) => {
      candleSeries.setData(data);
      chart.timeScale().fitContent();
    });

    // Setup WebSocket untuk update real-time
    const ws = new WebSocket(`${BINANCE_WS_API}/${symbol}@kline_${interval}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const candle = data.k;

      if (candleSeriesRef.current) {
        candleSeriesRef.current.update({
          time: candle.t / 1000,
          open: parseFloat(candle.o),
          high: parseFloat(candle.h),
          low: parseFloat(candle.l),
          close: parseFloat(candle.c)
        });
      }
    };

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [symbol, interval]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">BTC/USDT</h2>
        <div className="text-sm text-gray-400">
          1 Minute Chart
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  );
} 