import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { addToCartApi, CartItem, getCartList, RemoveProduct, UpdateQuantities } from "@/services/cart.service";
import { toast } from "@/hooks/use-toast";

/* ---------------- TYPES ---------------- */

// export interface CartItem {
//   product_id: string;
//   variant_id: string;
//   quantity: number;
//   product_title?: string;
//   name?: string;
//   product_image?: string;
//   price: number;
//   discount_price?: number;
// }

interface CartContextType {
  items: CartItem[];
  cartId: string;
  isOpen: boolean;

  addItem: (payload: {
    productId: string;
    variantId: string;
    size: string;
    quantity?: number;
  }) => Promise<void>;

  openCart: () => void;
  closeCart: () => void;
fetchCart: (id: string) => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number
  ) => void;
  removeItem: (productId: string, variantId: string) => void;
}

/* ---------------- CONTEXT ---------------- */

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};

/* ---------------- PROVIDER ---------------- */

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  /* ---------- INIT CART ---------- */
  useEffect(() => {
    let storedCartId = localStorage.getItem("cart_id");

    if (!storedCartId) {
      storedCartId = crypto.randomUUID();
      localStorage.setItem("cart_id", storedCartId);
    }

    setCartId(storedCartId);
    fetchCart(storedCartId);
  }, []);

  /* ---------- FETCH CART ---------- */
  const fetchCart = async (id: string) => {
    try {
      const cart = await getCartList(id);
      setItems(cart.items || []);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  /* ---------- ADD TO CART ---------- */
  const addItem = async ({
    productId,
    variantId,
    size,
    quantity = 1,
  }: {
    productId: string;
    variantId: string;
    size: string;
    quantity?: number;
  }) => {
    try {
      const res = await addToCartApi({
        cart_id: cartId,
        product_id: productId,
        item_id: variantId,
        size : size,
        quantity,
      });

      // update cart id if backend generates new one
      if (res.cartId && res.cartId !== cartId) {
        setCartId(res.cartId);
        localStorage.setItem("cart_id", res.cartId);
      }

      // update items directly
      fetchCart(res.cartId)
      // setItems(res.cart.items || []);
      // openCart();
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  };
  const updateQuantity = async (
    productId: string,
    variantId: string,
    quantity: number
  ) => {
    try {
      if (!cartId) return;

      await UpdateQuantities(
        cartId,
        productId,
        variantId,
        quantity
      );

      setItems((prev) =>
        prev.map((item) =>
          item.product_id === productId &&
            item.item_id === variantId
            ? { ...item, quantity }
            : item
        )
      );
    } catch (error) {
      console.error("Update qty failed", error);
    }
  };
  const removeItem = async (
    productId: string,
    variantId: string,
  ) => {
    try {
      if (!cartId) return;

      await RemoveProduct(
        cartId,
        productId,
        variantId,
      );

      setItems((prev) =>
        prev.filter(
          (item) =>
            !(
              item.product_id === productId &&
              item.item_id === variantId
            )
        )
      );
    } catch (error) {
      console.error("Update qty failed", error);
    }
  };

  /* ---------- HELPERS ---------- */
  const getTotalItems = () =>
    items.reduce((sum, item) => sum + item.quantity, 0);

  const getTotalPrice = () =>
    items.reduce(
      (sum, item) =>
        sum +
        item.quantity *
        (item.discount_price ?? item.price),
      0
    );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        cartId,
        isOpen,
        addItem,
        updateQuantity,
        removeItem,
        openCart,
        closeCart,
        getTotalItems,
        getTotalPrice,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
