import { useState, useEffect, useCallback } from 'react';
import greenhouseAPI from '@/api/greenhouseAPI';

type HistoricalDataPoint = {
  timestamp: string;
  value: number;
};

export const useHistoricalData = (
  sensor: string,
  period: 'day' | 'week' | 'month' = 'day'
) => {
  const [data, setData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHistoricalData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Calculate time range based on period
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case 'day':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
      }
      
      // In a real app, we'd use:
      // const histData = await greenhouseAPI.getHistoricalData(
      //   sensor,
      //   startDate.toISOString(),
      //   endDate.toISOString()
      // );
      
      // For demonstration, use mock data
      const histData = greenhouseAPI.getMockHistoricalData(
        sensor,
        period === 'day' ? 24 : period === 'week' ? 168 : 720
      );
      
      setData(histData);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error('Error fetching historical data:', err);
    } finally {
      setLoading(false);
    }
  }, [sensor, period]);

  useEffect(() => {
    fetchHistoricalData();
  }, [fetchHistoricalData]);

  return {
    data,
    loading,
    error,
    refetch: fetchHistoricalData,
  };
};

export default useHistoricalData;