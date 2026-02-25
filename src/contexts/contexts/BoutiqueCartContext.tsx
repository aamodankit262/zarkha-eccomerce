import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface BoutiqueCartItem {
  id: string;
  name: string;
  image: string;
  category: string;
  adminPrice: number;
  mrp: number;
  discount: number;
  quantity: number;
  sellingPrice: number;
  stock: number;
}

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

interface Address {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface BoutiqueCartContextType {
  items: BoutiqueCartItem[];
  customerInfo: CustomerInfo;
  shippingAddress: Address;
  billingAddress: Address;
  sameAsShipping: boolean;
  addItem: (item: Omit<BoutiqueCartItem, 'quantity' | 'sellingPrice'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateSellingPrice: (id: string, price: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setCustomerInfo: (info: CustomerInfo) => void;
  setShippingAddress: (address: Address) => void;
  setBillingAddress: (address: Address) => void;
  setSameAsShipping: (same: boolean) => void;
  getTotalItems: () => number;
  getTotalCost: () => number;
  getExpectedRevenue: () => number;
  getExpectedProfit: () => number;
}

const BoutiqueCartContext = createContext<BoutiqueCartContextType | undefined>(undefined);

export const useBoutiqueCart = () => {
  const context = useContext(BoutiqueCartContext);
  if (!context) {
    throw new Error('useBoutiqueCart must be used within a BoutiqueCartProvider');
  }
  return context;
};

export const BoutiqueCartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<BoutiqueCartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: ''
  });
  const [shippingAddress, setShippingAddress] = useState<Address>({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [billingAddress, setBillingAddress] = useState<Address>({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const addItem = (item: Omit<BoutiqueCartItem, 'quantity' | 'sellingPrice'>) => {
    const existing = items.find(i => i.id === item.id);
    if (existing) {
      updateQuantity(item.id, existing.quantity + 1);
    } else {
      setItems(prev => [...prev, { ...item, quantity: 1, sellingPrice: 0 }]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const updateSellingPrice = (id: string, price: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, sellingPrice: price } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setCustomerInfo({ name: '', phone: '', email: '' });
    setShippingAddress({ name: '', phone: '', address: '', city: '', state: '', pincode: '' });
    setBillingAddress({ name: '', phone: '', address: '', city: '', state: '', pincode: '' });
    setSameAsShipping(true);
  };

  const getTotalItems = () => items.reduce((total, item) => total + item.quantity, 0);
  const getTotalCost = () => items.reduce((total, item) => total + (item.adminPrice * item.quantity), 0);
  const getExpectedRevenue = () => items.reduce((total, item) => total + (item.sellingPrice * item.quantity), 0);
  const getExpectedProfit = () => items.reduce((total, item) => total + ((item.sellingPrice - item.adminPrice) * item.quantity), 0);

  return (
    <BoutiqueCartContext.Provider value={{
      items,
      customerInfo,
      shippingAddress,
      billingAddress,
      sameAsShipping,
      addItem,
      updateQuantity,
      updateSellingPrice,
      removeItem,
      clearCart,
      setCustomerInfo,
      setShippingAddress,
      setBillingAddress,
      setSameAsShipping,
      getTotalItems,
      getTotalCost,
      getExpectedRevenue,
      getExpectedProfit
    }}>
      {children}
    </BoutiqueCartContext.Provider>
  );
};
