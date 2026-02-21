import { create } from "zustand";
import { industryService } from "@/services/industryService";

/* ================= TYPES ================= */

interface Industry {
  id: string;
  industry_name: string;
}

interface Category {
  id: string;
  industry_id?: string;
  category_name: string;
}

interface SubCategory {
  id: string;
  subcategory_name: string;
  image?: string;
}

interface MegaMenuStore {
  industries: Industry[];

  categories: Record<string, Category[]>;       // key = industryId
  subCategories: Record<string, SubCategory[]>; // key = categoryId

  loadingIndustries: boolean;
  loadingCategories: Record<string, boolean>;
  loadingSubCategories: Record<string, boolean>;

  fetchIndustries: () => Promise<void>;
  fetchCategories: (industryId?: string) => Promise<void>;
  fetchSubCategories: (categoryId: string) => Promise<void>;
}

/* ================= STORE ================= */

export const useMegaMenuStores = create<MegaMenuStore>((set, get) => ({
  industries: [],
  categories: {},
  subCategories: {},

  loadingIndustries: false,
  loadingCategories: {},
  loadingSubCategories: {},

  /* ---------- Fetch Industries ---------- */
  fetchIndustries: async () => {
    if (get().industries.length) return;

    set({ loadingIndustries: true });

    try {
      const industries = await industryService.getAll();
      set({ industries });
    } catch (error) {
      console.error("Failed to fetch industries", error);
    } finally {
      set({ loadingIndustries: false });
    }
  },

  /* ---------- Fetch Categories (by Industry) ---------- */
  fetchCategories: async (industryId: string) => {
    const { categories, loadingCategories } = get();

    if (categories[industryId] || loadingCategories[industryId]) return;

    set((state) => ({
      loadingCategories: {
        ...state.loadingCategories,
        [industryId]: true,
      },
    }));

    try {
      const data = await industryService.getCat(industryId);
      set((state) => ({
        categories: {
          ...state.categories,
          [industryId]: data,
        },
      }));
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      set((state) => ({
        loadingCategories: {
          ...state.loadingCategories,
          [industryId]: false,
        },
      }));
    }
  },

  /* ---------- Fetch Sub Categories (by Category) ---------- */
  fetchSubCategories: async (categoryId: string) => {
    const { subCategories, loadingSubCategories } = get();

    if (subCategories[categoryId] || loadingSubCategories[categoryId]) return;

    set((state) => ({
      loadingSubCategories: {
        ...state.loadingSubCategories,
        [categoryId]: true,
      },
    }));

    try {
      const data = await industryService.getSubCat(categoryId);
      set((state) => ({
        subCategories: {
          ...state.subCategories,
          [categoryId]: data,
        },
      }));
    } catch (error) {
      console.error("Failed to fetch sub categories", error);
    } finally {
      set((state) => ({
        loadingSubCategories: {
          ...state.loadingSubCategories,
          [categoryId]: false,
        },
      }));
    }
  },
}));
