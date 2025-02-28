"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createChart, ColorType, IChartApi } from "lightweight-charts";

const BINANCE_REST_API = "https://api.binance.com/api/v3/klines";
const BINANCE_WS_API = "wss://stream.binance.com:9443/ws";

export default function TradingChart() {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const [symbol, setSymbol] = useState("btcusdt"); // Default BTC/USDT
  const [interval, setInterval] = useState("1d"); // Default 1 day
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoricalData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let formattedSymbol = symbol.toUpperCase();

      if (formattedSymbol === "WETHUSDT") {
        formattedSymbol = "ETHWUSDT";
      } else if (formattedSymbol === "ETHENAUSDT") {
        formattedSymbol = "EHTUSDT";
      }

      let response = await fetch(
        `${BINANCE_REST_API}?symbol=${formattedSymbol}&interval=${interval}&limit=100`
      );

      if (!response.ok && formattedSymbol !== symbol.toUpperCase()) {
        console.log(
          `Trying fallback with original symbol: ${symbol.toUpperCase()}`
        );
        response = await fetch(
          `${BINANCE_REST_API}?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=100`
        );
      }

      if (!response.ok) {
        const infoResponse = await fetch(
          "https://api.binance.com/api/v3/exchangeInfo"
        );
        const exchangeInfo = await infoResponse.json();

        const availableSymbols = exchangeInfo.symbols.map((s: any) => s.symbol);

        console.log(
          `Available symbols similar to ${symbol.toUpperCase()}:`,
          availableSymbols.filter(
            (s: string) => s.includes("ETH") && s.includes("USDT")
          )
        );

        throw new Error(
          `Symbol not available: ${formattedSymbol}. Please check symbol name.`
        );
      }

      const data = await response.json();

      // Transform data for the chart
      const formattedData = data.map((d: any) => ({
        time: d[0] / 1000,
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
      }));

      setIsLoading(false);
      return formattedData;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching historical data:", errorMessage);
      setError(`Failed to fetch data: ${errorMessage}`);
      setIsLoading(false);
      return [];
    }
  }, [symbol, interval]);

  // Function to create/update chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up previous chart if it exists
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    // Create new chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#DDD",
      },
      grid: {
        vertLines: { color: "#2B2B43" },
        horzLines: { color: "#2B2B43" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Add candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    // Fetch and set data
    fetchHistoricalData().then((data) => {
      if (data.length > 0 && candleSeries) {
        candleSeries.setData(data);
        chart.timeScale().fitContent();
      }
    });

    // Set up resize observer
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || !entries[0].contentRect) return;
      const { width } = entries[0].contentRect;

      if (chartRef.current) {
        chartRef.current.applyOptions({ width });
        chartRef.current.timeScale().fitContent();
      }
    });

    resizeObserverRef.current = resizeObserver;

    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    // Cleanup function
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [symbol, interval, fetchHistoricalData]);

  // WebSocket connection management
  useEffect(() => {
    // Close previous WebSocket if exists
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Check if symbol exists on Binance before attempting to connect
    const checkSymbolAndConnect = async () => {
      try {
        // First verify the symbol is valid
        const response = await fetch(
          `https://api.binance.com/api/v3/exchangeInfo`
        );
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const symbolInfo = data.symbols.find(
          (s: any) => s.symbol.toLowerCase() === symbol.toUpperCase()
        );

        if (!symbolInfo) {
          console.warn(`Symbol ${symbol.toUpperCase()} not found on Binance`);
          return; // Don't connect WebSocket for invalid symbols
        }

        // Create new WebSocket connection if symbol is valid
        const ws = new WebSocket(BINANCE_WS_API);
        wsRef.current = ws;

        // Connection opened handler
        ws.onopen = () => {
          console.log("WebSocket connected");
          ws.send(
            JSON.stringify({
              method: "SUBSCRIBE",
              params: [`${symbol.toLowerCase()}@kline_${interval}`],
              id: 1,
            })
          );
        };

        // Error handler
        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setError(
            "WebSocket connection error. Real-time updates may not be available."
          );
        };

        // Close handler
        ws.onclose = () => {
          console.log("WebSocket disconnected");
        };
      } catch (error) {
        console.error("Error checking symbol:", error);
        setError("Error validating symbol. Please try a different one.");
      }
    };

    checkSymbolAndConnect();

    // Cleanup function
    return () => {
      if (wsRef.current) {
        console.log("Closing WebSocket connection");
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [symbol, interval]);

  return (
    <div className="trading-chart-container">
      <div className="controls">
        <div className="control-group">
          <label htmlFor="symbol-select"></label>
          <select
            id="symbol-select"
            value={symbol}
            onChange={(e) => {
              setSymbol(e.target.value);
              setError(null); // Clear errors when changing symbol
            }}
            disabled={isLoading}
          >
            <option value="btcusdt">BTC/USDT</option>
            <option value="ethusdt">ETH/USDT</option>
            <option value="bnbusdt">BNB/USDT</option>
            <option value="solusdt">SOL/USDT</option>
            <option value="dogeusdt">DOGE/USDT</option>
            <option value="xrpusdt">XRP/USDT</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="interval-select"> </label>
          <select
            id="interval-select"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            disabled={isLoading}
          >
            <option value="1m">1 Min</option>
            <option value="30m">5 Min</option>
            <option value="15m">15 Min</option>
            <option value="1h">1 H</option>
            <option value="4h">4 H</option>
            <option value="1d">1 D</option>
            <option value="1w">1 W</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {isLoading && <div className="loading-indicator">Loading data...</div>}

      <div
        ref={chartContainerRef}
        className="chart-container"
        style={{ width: "100%", height: "400px" }}
      />

      <style jsx>{`
        .trading-chart-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }

        .controls {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        select {
          padding: 8px;
          border-radius: 4px;
          background-color: #1e1e2d;
          color: #fff;
          border: 1px solid #2b2b43;
        }

        .error-message {
          color: #ef5350;
          padding: 8px;
          border-radius: 4px;
          background-color: rgba(239, 83, 80, 0.1);
        }

        .loading-indicator {
          color: #ccc;
          text-align: center;
          padding: 4px;
        }

        .chart-container {
          border-radius: 8px;
          overflow: hidden;
          background-color: #1e1e2d;
          border: 1px solid #2b2b43;
        }
      `}</style>
    </div>
  );
}
