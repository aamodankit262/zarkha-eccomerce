// import { createContext, useContext, useState, ReactNode } from "react";

// export interface CartItem {
//   id: string;
//   name: string;
//   image: string;
//   size: string;
//   color: string;
//   quantity: number;
//   price: number;
// }

// interface CartContextType {
//   items: CartItem[];
//   isOpen: boolean;
//   addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
//   updateQuantity: (id: string, quantity: number) => void;
//   removeItem: (id: string) => void;
//   clearCart: () => void;
//   openCart: () => void;
//   closeCart: () => void;
//   getTotalItems: () => number;
//   getTotalPrice: () => number;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// export const CartProvider = ({ children }: { children: ReactNode }) => {
//   const [items, setItems] = useState<CartItem[]>([
//     // Sample items for demonstration
//     {
//       id: "1",
//       name: "Black LIVA Straight Printed 2 Piece Set",
//       image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
//       size: "38",
//       color: "Black",
//       quantity: 1,
//       price: 800
//     },
//     {
//       id: "2",
//       name: "Black LIVA Straight Printed 2 Piece Set",
//       image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
//       size: "38",
//       color: "Black",
//       quantity: 1,
//       price: 800
//     },
//     {
//       id: "3",
//       name: "Black LIVA Straight Printed 2 Piece Set",
//       image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
//       size: "38",
//       color: "Black",
//       quantity: 1,
//       price: 800
//     }
//   ]);
//   const [isOpen, setIsOpen] = useState(false);

//   const addItem = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
//     const existingItem = items.find(item => 
//       item.id === newItem.id && 
//       item.size === newItem.size && 
//       item.color === newItem.color
//     );

//     if (existingItem) {
//       updateQuantity(existingItem.id, existingItem.quantity + (newItem.quantity || 1));
//     } else {
//       setItems(prev => [...prev, { ...newItem, quantity: newItem.quantity || 1 }]);
//     }
//   };

//   const updateQuantity = (id: string, quantity: number) => {
//     if (quantity <= 0) {
//       removeItem(id);
//       return;
//     }

//     setItems(prev => 
//       prev.map(item => 
//         item.id === id ? { ...item, quantity } : item
//       )
//     );
//   };

//   const removeItem = (id: string) => {
//     setItems(prev => prev.filter(item => item.id !== id));
//   };

//   const clearCart = () => {
//     setItems([]);
//   };

//   const openCart = () => setIsOpen(true);
//   const closeCart = () => setIsOpen(false);

//   const getTotalItems = () => {
//     return items.reduce((total, item) => total + item.quantity, 0);
//   };

//   const getTotalPrice = () => {
//     return items.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   const value: CartContextType = {
//     items,
//     isOpen,
//     addItem,
//     updateQuantity,
//     removeItem,
//     clearCart,
//     openCart,
//     closeCart,
//     getTotalItems,
//     getTotalPrice
//   };

//   return (
//     <CartContext.Provider value={value}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartContext;
import { createContext, useContext, useEffect, useState } from "react";
import { addToCartApi, getCartList } from "@/services/cart.service";
// import { v4 as uuidv4 } from "uuid";

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  body?: any;
}

interface CartContextType {
  items: CartItem[];
  cartId: string;
   isOpen: boolean;
  addItem: (payload: {
    productId: string;
    variantId: string;
    quantity: number;
    name: string;
    image: string;
    price: number;
    size: string;
    color: string;
  }) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState("");
 const [isOpen, setIsOpen] = useState(false);
  /** Initialize cart_id */
  useEffect(() => {
    let storedCartId = localStorage.getItem("cart_id");

    // if (!storedCartId) {
    //   storedCartId = uuidv4();
    //   localStorage.setItem("cart_id", storedCartId);
    // }

    setCartId(storedCartId);
    fetchCart(storedCartId);
  }, []);

  /** Fetch cart list */
  const fetchCart = async (cartId: string) => {
    try {
      const res = await getCartList(cartId);
      console.log("Cart fetch response:", res);
      setItems(res?.body ?? []);
    } catch (error) {
      console.error("Cart fetch failed", error);
    }
  };

  /** Add to cart */
  const addItem = async (payload: {
    productId: string;
    variantId: string;
    quantity: number;
  }) => {
    try {
      const res = await addToCartApi({
        cart_id: cartId,
        product_id: payload.productId,
        variant_id: payload.variantId,
        quantity: payload.quantity,
      });
      console.log("Add to cart response:", res);
      // 🔥 VERY IMPORTANT
      if (res && typeof res === 'object' && 'cart_id' in res) {
        setCartId((res as any).cart_id);
        localStorage.setItem("cart_id", (res as any).cart_id);
      }

      // 🔥 Update cart items directly from API
      setItems((res as any).cart?.items ?? []);
    } catch (error) {
      console.error("Add to cart failed", error);
    }
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const getTotalItems = () =>
    items.reduce((sum, item) => sum + item.quantity, 0);

  const getTotalPrice = () =>
    items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartId,
        addItem,
        getTotalItems,
        getTotalPrice,
        openCart,
    closeCart,
    isOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
