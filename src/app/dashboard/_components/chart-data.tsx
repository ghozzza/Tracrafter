"use client";

import React from "react";
import { useChartData, type PeriodType } from "@/lib/data/chart-data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COINS = [
  "bitcoin",
  "ethereum",
  "usdc",
  "manta",
  "pepe",
  "dogecoin",
] as const;

const PERIODS = [
  { label: "1D", value: 1 },
  { label: "7D", value: 7 },
  { label: "1M", value: 30 },
  { label: "1Y", value: 365 },
] as const;

const ChartData: React.FC = () => {
  const [coin, setCoin] = React.useState<string>("ethereum");
  const [period, setPeriod] = React.useState<PeriodType>(1);
  const { chartData, isLoading, error } = useChartData(coin, period);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 bg-gray-900 shadow-lg rounded-lg text-white">
        <p className="text-red-500 text-center">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-900 shadow-lg rounded-lg text-white">
      <h2 className="text-lg font-semibold mb-4 text-center">
        {coin.toUpperCase()} Price (USD) - {period}D
      </h2>

      <div className="flex justify-center gap-4 mb-4">
        <select
          className="p-2 border rounded bg-gray-800 text-white"
          value={coin}
          onChange={(e) => setCoin(e.target.value)}
        >
          {COINS.map((c) => (
            <option key={c} value={c}>
              {c.toUpperCase()}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              className={`px-4 py-2 rounded text-white transition ${
                period === p.value
                  ? "bg-green-500"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && chartData.length === 0 ? (
        <div className="flex justify-center items-center h-[350px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12, fill: "white" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "white" }}
              domain={["auto", "auto"]}
              tickFormatter={formatCurrency}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                borderRadius: "8px",
                padding: "10px",
                color: "white",
              }}
              labelStyle={{ fontWeight: "bold", color: "white" }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="price"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ChartData;
