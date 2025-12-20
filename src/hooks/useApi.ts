import { useApiStore } from "@/store/apiStore";
import { useState } from "react";

export const useApi = <T,>(apiFunc: (...args: any[]) => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  // const [loading, setLoading] = useState(false);
    const { loading, error, setError, setLoading } = useApiStore();
  // const [error, setError] = useState<string | null>(null);

  const request = async (...args: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFunc(...args);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, request };
};
