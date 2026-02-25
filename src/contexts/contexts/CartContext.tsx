import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([
    // Sample items for demonstration
    {
      id: "1",
      name: "Black LIVA Straight Printed 2 Piece Set",
      image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
      size: "38",
      color: "Black",
      quantity: 1,
      price: 800
    },
    {
      id: "2",
      name: "Black LIVA Straight Printed 2 Piece Set",
      image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
      size: "38",
      color: "Black",
      quantity: 1,
      price: 800
    },
    {
      id: "3",
      name: "Black LIVA Straight Printed 2 Piece Set",
      image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
      size: "38",
      color: "Black",
      quantity: 1,
      price: 800
    }
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const existingItem = items.find(item => 
      item.id === newItem.id && 
      item.size === newItem.size && 
      item.color === newItem.color
    );

    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + (newItem.quantity || 1));
    } else {
      setItems(prev => [...prev, { ...newItem, quantity: newItem.quantity || 1 }]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value: CartContextType = {
    items,
    isOpen,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    openCart,
    closeCart,
    getTotalItems,
    getTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;