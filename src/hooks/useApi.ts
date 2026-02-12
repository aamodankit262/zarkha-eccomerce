import { useApiStore } from "@/store/apiStore";
import { useState } from "react";

export const useApi = <T,>(
  apiFunc: (...args: any[]) => Promise<T>
) => {
  const [data, setData] = useState<T | any>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { setLoading: setGlobalLoading, setError: setGlobalError } = useApiStore();

  const request = async (...args: any[]) => {
    try {
      setLocalLoading(true);
      setGlobalLoading(true);
      setLocalError(null);
      setData(null);

      const res = await apiFunc(...args);
      setData(res);
      return res;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Something went wrong";

      setLocalError(message);
      setGlobalError(message);
      throw err;
    } finally {
      setLocalLoading(false);
      setGlobalLoading(false);
    }
  };

  return {
    data,
    loading: localLoading,
    error: localError,
    request
  };
};
