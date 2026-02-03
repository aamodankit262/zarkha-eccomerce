
import { create } from "zustand";
import { productService } from "@/services/productService";
import { Product } from "@/types";
import { SortOption } from "@/helper/sort";


interface Filtername {
  industry?: string;
  category?: string;
  subcategory?: string;
};
type Filters = {
  industry: string[];
  category: string[];
  subCategory: string[];
  discount: string[];
  sort: SortOption;
  price: string[];
  size: string[];
  color: string[];
  fabric: string[];
  search: string;
};

type ProductStore = {
  productsList: Product[];
  loading: boolean;
  loadingMore: boolean;

  // 🔹 pagination
  hasMore: boolean,
  page: number;
  limit: number;
  totalPages: number;
  filterByName: Filtername
  filters: Filters;

  setFilters: (filters: Partial<Filters>) => void;
  setPage: (page: number) => void;
  fetchProducts: (reset?: boolean) => Promise<void>;
  // fetchNextPage: () => Promise<void>;
  fetchNextPage: () => void;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  productsList: [],
  loading: false,
  loadingMore: false,
  page: 1,
  limit: 20,
  totalPages: 1,
  hasMore: true,
  filterByName: null,

  filters: {
    industry: [],
    category: [],
    subCategory: [],
    discount: [],
    sort: "popular",
    price: [],
    size: [],
    color: [],
    fabric: [],
    search: "",

  },

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1, // ✅ reset page when filters change
      productsList: [],
      hasMore: true
    })),

  setPage: (page) => set({ page }),

  fetchProducts: async (reset = false) => {
    const { filters, page, limit, productsList } = get();
    // set({ loadingMore: true });
    set({ loading: true });

    try {
      const payload = {
        industry_id: filters.industry.join(","),
        category_id: filters.category.join(","),
        subcategory_id: filters.subCategory.join(","),
        discount: filters.discount.join(","),
        sort_by: filters.sort,
        price: filters.price.join(","),
        size: filters.size.join(","),
        color: filters.color.join(","),
        fabric_id: filters.fabric.join(","),
        search: filters.search?.trim(),
        page,
        limit,
      };

      const res = await productService.getAll(payload);
      console.log("Fetched Products:", res);
      const newProducts = res?.body || [];
      const totalPages = res?.total_pages || 1;
      set({
        productsList: reset ? newProducts : [...productsList, ...newProducts],
        totalPages,
        hasMore: newProducts.length > 0 && page < totalPages,
        filterByName: res.filtered_by,
        loading: false,
      });
    } catch (error) {
      console.error("Fetch products failed", error);
      set({ loading: false,});
    }
  },
  // fetchNextPage: () => {
  //   const { hasMore, loadingMore, page } = get();
  //   if (!hasMore || loadingMore) return;
  //   set({ loadingMore: true });
  //   const nextPage = page + 1;
  //   set({ page: nextPage });
  //   get().fetchProducts(false);
  // }
  fetchNextPage: async () => {
  const { hasMore, loadingMore, page, filters, limit, productsList } = get();
  if (!hasMore || loadingMore) return;

  set({ loadingMore: true });

  const nextPage = page + 1;

  const payload = {
    search: filters.search.trim(),
    page: nextPage,
    limit,
    sort_by: filters.sort,
  };

  const res = await productService.getAll(payload);

  const newProducts = res?.body || [];
  const totalPages = res?.total_pages || 1;

  set({
    page: nextPage,
    productsList: [...productsList, ...newProducts],
    totalPages,
    hasMore: newProducts.length > 0 && nextPage < totalPages,
    loadingMore: false,
  });
},

}));
