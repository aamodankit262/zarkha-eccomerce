import { addToCartApi, CartItem, getCartList } from "@/services/cart.service";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  cartId: string | null;
  items: CartItem[];
  totalPrice: number;
  loading: boolean;
  error: string | null;

  initCart: () => void;
  fetchCart: () => Promise<void>;
  addToCart: (
    productId: string,
    variantId: string,
    quantity?: number
  ) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      items: [],
      totalPrice: 0,
      loading: false,
      error: null,

      initCart: () => {
        if (!get().cartId) {
          set({ cartId: crypto.randomUUID() });
        }
      },

      fetchCart: async () => {
        const cartId = get().cartId;
        if (!cartId) return;

        try {
          set({ loading: true });
          const cart = await getCartList(cartId);

          set({
            items: cart.items,
            totalPrice: cart.total_price,
          });
        } catch {
          set({ error: "Failed to fetch cart" });
        } finally {
          set({ loading: false });
        }
      },

      addToCart: async (productId, variantId, quantity = 1) => {
        const cartId = get().cartId;
        if (!cartId) return;

        try {
          set({ loading: true });

          const { cartId: newCartId, cart } = await addToCartApi({
            cart_id: cartId,
            product_id: productId,
            variant_id: variantId,
            quantity,
          });

          set({
            cartId: newCartId,
            items: cart.items,
            totalPrice: cart.total_price,
          });
        } catch {
          set({ error: "Failed to add item" });
        } finally {
          set({ loading: false });
        }
      },

      clearCart: () => {
        set({ cartId: null, items: [], totalPrice: 0 });
      },
    }),
    {
      name: "zarkha-cart",
    }
  )
);
