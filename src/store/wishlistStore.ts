import { create } from "zustand";
import { wishlistService } from "@/services/wishlist.service";

export interface WishlistItem {
  _id: string;
  product_id: string;
}

interface WishlistStore {
  items: WishlistItem[];
  loading: boolean;
  wishlistCount: number;

  page: number;
  limit: number;
  totalPages: number;

  fetchWishlist: () => Promise<void>;
  setPage: (page: number) => void;

  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
}


export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  loading: false,
  wishlistCount: 0,

  page: 1,
  limit: 10,
  totalPages: 1,

  setPage: (page) => set({ page }),

  fetchWishlist: async () => {
    const { page, limit } = get();

    try {
      set({ loading: true });

      const res: any = await wishlistService.list(page, limit);

      set({
        items: res?.body || [],
        wishlistCount: res?.wishlist_count || 0,
        totalPages: res?.pagination?.totalPages || 1,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      console.error("Fetch wishlist failed", error);
    }
  },

  addToWishlist: async (productId) => {
    const { items } = get();
    if (items.some((i) => i.product_id === productId)) return;

    try {
      await wishlistService.add(productId);
      set((state) => ({
        items: [...state.items, { product_id: productId } as any],
      }));
    } catch (error) {
      console.error("Add to wishlist failed", error);
    }
  },

  removeFromWishlist: async (productId) => {
    try {
      await wishlistService.remove(productId);
      set({
        items: get().items.filter((i) => i.product_id !== productId),
      });
    } catch (error) {
      console.error("Remove wishlist failed", error);
    }
  },

  isWishlisted: (productId) =>
    get().items.some((i) => i.product_id === productId),
}));

