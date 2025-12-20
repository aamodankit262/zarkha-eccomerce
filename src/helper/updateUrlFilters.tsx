// import { useNavigate } from "react-router-dom";

import { useNavigate } from "react-router-dom";

type UrlFilters = {
  industry?: string;
  category?: string;
  sub?: string;
};

export const updateUrlFilters = (
  navigate: ReturnType<typeof useNavigate>,
  currentParams: URLSearchParams,
  updates: UrlFilters
) => {
  const params = new URLSearchParams(currentParams);

  Object.entries(updates).forEach(([key, value]) => {
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });

  navigate(`/products?${params.toString()}`, { replace: true });
};
