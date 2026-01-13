// src/constants/sort.ts
export type SortOption =
  | "popular"
  | "price_asc"
  | "price_desc"
  | "newest"
  | "rating"
  | "all";

export const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "All", value: "all" },
  { label: "Bestsellers", value: "popular" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest First", value: "newest" },
  { label: "Customer Rating", value: "rating" },
];
