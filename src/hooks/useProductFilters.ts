import { useState, useMemo } from "react";
import { useDebounce } from "./useDebounce";

export const useProductFilters = () => {
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState("all");
  const [discountFilter, setDiscountFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const debouncedPrice = useDebounce(priceRange, 500);
  const apiParams = useMemo(() => {
    return {
      page,
      limit: 20,
      category_id: categoryFilter === "all" ? undefined : categoryFilter,
      subcategory_id: subcategoryFilter === "all" ? undefined : subcategoryFilter,
      search: debouncedSearch || undefined,
      min_price: debouncedPrice[0] > 0 ? debouncedPrice[0] : undefined,
      max_price: debouncedPrice[1] < 10000 ? debouncedPrice[1] : undefined,
      discount: discountFilter !== "all" ? discountFilter : undefined,
      stock_status: stockFilter !== "all" ? stockFilter : undefined,
    };
  }, [
    page,
    categoryFilter,
    subcategoryFilter,
    debouncedSearch,
    debouncedPrice,
    discountFilter,
    stockFilter,
  ]);

  const clearFilters = () => {
    setCategoryFilter("all");
    setSubcategoryFilter("all");
    setDiscountFilter("all");
    setStockFilter("all");
    setPriceRange([0, 10000]);
    setSearch("");
    setPage(1);
  };

  return {
    page,
    setPage,
    priceRange,
    setPriceRange,
    categoryFilter,
    setCategoryFilter,
    subcategoryFilter,
    setSubcategoryFilter,
    discountFilter,
    setDiscountFilter,
    stockFilter,
    setStockFilter,
    search,
    setSearch,
    apiParams,
    clearFilters,
  };
};