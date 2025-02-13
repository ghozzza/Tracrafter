import { useState, useEffect } from "react";
import axios from "axios";

export type ChartDataItem = {
  time: string;
  price: number;
};

export type PeriodType = 1 | 7 | 30 | 365;

export const useChartData = (coin: string, period: PeriodType) => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coin}/market_chart`,
        {
          params: {
            vs_currency: "usd",
            days: period,
          },
          headers: {
            "x-cg-api-key": process.env.NEXT_PUBLIC_CG_API_KEY,
          },
        }
      );

      const prices = response.data.prices;

      const formattedData = prices.map((item: [number, number]) => ({
        time: formatTimestamp(item[0], period),
        price: item[1],
      }));

      setChartData(formattedData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch data");
      console.error("Error fetching chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number, period: PeriodType): string => {
    const date = new Date(timestamp);

    if (period === 1) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  useEffect(() => {
    fetchChartData();
    const interval = setInterval(fetchChartData, 60000);

    return () => clearInterval(interval);
  }, [coin, period]);

  return { chartData, isLoading, error };
};
