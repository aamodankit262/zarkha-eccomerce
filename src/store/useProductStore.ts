// import { productService } from "@/services/productService";
// import { Product,ProductListPayload } from "@/types";
// import { create } from "zustand";

// type Filters = {
//   category: string[];
//   subCategory: string[];
//   discount: string[];
//   price: string[];
//   size: string[];
//   color: string[];
//   fabric: string[];
// };
// interface ProductState {
//   productsList: Product[];
//   filters: ProductListPayload;
//   loading: boolean;
//   error: string | null;

//   setFilters: (filters:ProductListPayload) => void;
//   fetchProducts: () => Promise<void>;
//   resetFilters: () => void;
// }

// export const useProductStore = create<ProductState>((set, get) => ({
//   productsList: [],
//   filters: { 
//     page:1,
//     limit:30,
//   },
//   loading: false,
//   error: null,

//   setFilters:(newFilters) => 
//     set((state) => ({
//       filters: {...state.filters, ...newFilters},
//     })),
//   fetchProducts: async () => {
//     set({ loading: true, error: null });
//     try {
//       // const data = await productService.getAll();
//       // const data = await productService.getAll({
//       //   category_id: "",
//       //   subcategory_id: "",
//       //   page: 1,
//       //   limit: 30,
//       // });
//     const data = await productService.getAll(get().filters);
//       set({ productsList: data, loading: false });
//     } catch (error: any) {
//       set({ error: error.message || "Something went wrong", loading: false });
//     } finally {
//       set({loading:false});
//     }
//   },
//   resetFilters: () =>
//     set({
//       filters: { page: 1, limit: 30 },
//     }),
// }));
import { create } from "zustand";
import { productService } from "@/services/productService";
import { Product, ProductListPayload } from "@/types";
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
};

type ProductStore = {
  productsList: Product[];
  loading: boolean;

  // 🔹 pagination
  page: number;
  limit: number;
  totalPages: number;
  filterByName : Filtername
  filters: Filters;

  setFilters: (filters: Partial<Filters>) => void;
  setPage: (page: number) => void;
  fetchProducts: () => Promise<void>;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  productsList: [],
  loading: false,

  page: 1,
  limit: 30,
  totalPages: 1,
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
  },

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1, // ✅ reset page when filters change
    })),

  setPage: (page) => set({ page }),

  fetchProducts: async () => {
    const { filters, page, limit } = get();
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
        page,
        limit,
      };

      const res = await productService.getAll(payload);
      console.log("Fetched Products:", res);
      set({
        productsList: res?.body ,
        totalPages: res.total_pages || 1,
        filterByName : res.filtered_by ,
        loading: false,
      });
    } catch (error) {
      console.error("Fetch products failed", error);
      set({ loading: false });
    }
  },
}));
