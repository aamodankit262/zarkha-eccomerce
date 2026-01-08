import { useEffect, useState } from "react";
import { getCms } from "@/services/cms.service";

export const useCms = (type: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!type) return;

    setLoading(true);
    setError(null);

    getCms(type)
      .then((res) => {
        if (res.success) {
          setData(res.body);
        } else {
          setError(res.message);
        }
      })
      .catch(() => {
        setError("Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [type]);

  return {
    data,
    loading,
    error,
  };
};
