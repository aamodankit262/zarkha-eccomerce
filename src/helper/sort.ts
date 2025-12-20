// src/constants/sort.ts
export type SortOption =
  | "bestseller"
  | "price_asc"
  | "price_desc"
  | "newest"
  | "rating";

export const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Bestsellers", value: "bestseller" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest First", value: "newest" },
  { label: "Customer Rating", value: "rating" },
];
