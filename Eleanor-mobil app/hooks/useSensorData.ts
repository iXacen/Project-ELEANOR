import { useState, useEffect, useCallback } from 'react';
import greenhouseAPI, { SensorData } from '@/api/greenhouseAPI';

export const useSensorData = (refreshInterval: number = 10000) => {
  const [data, setData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // In a real app, we'd use the real API
      // For now, let's use mock data for demonstration
      const sensorData = greenhouseAPI.getMockSensorData();
      setData(sensorData);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error('Error fetching sensor data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up polling interval
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const intervalId = setInterval(() => {
      fetchData();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [fetchData, refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export default useSensorData;