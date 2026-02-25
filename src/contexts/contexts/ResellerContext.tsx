import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ResellerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  shopName: string;
  address: string;
  gstNumber?: string;
}

interface Address {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

export interface ResellerProductPrice {
  productId: string;
  sellingPrice: number;
  lastUpdated: string;
}

export interface ResellerOrder {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  buyingPrice: number;
  sellingPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  orderDate: string;
  customerInfo?: CustomerInfo;
  shippingAddress?: Address;
  billingAddress?: Address;
  isBulkOrder?: boolean;
}

interface ResellerSale {
  id: string;
  orderId: string;
  productName: string;
  quantity: number;
  sellingPrice: number;
  profit: number;
  saleDate: string;
  customerName: string;
}

interface ResellerPayment {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'released';
  releaseDate?: string;
  period: string;
}

interface OrderInput {
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  buyingPrice: number;
  sellingPrice: number;
  customerInfo?: CustomerInfo;
  shippingAddress?: Address;
  billingAddress?: Address;
  isBulkOrder?: boolean;
}

interface ResellerContextType {
  isLoggedIn: boolean;
  user: ResellerUser | null;
  orders: ResellerOrder[];
  sales: ResellerSale[];
  payments: ResellerPayment[];
  productPrices: ResellerProductPrice[];
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Partial<ResellerUser> & { password: string }) => Promise<boolean>;
  logout: () => void;
  placeOrder: (order: OrderInput) => void;
  placeBulkOrder: (orders: OrderInput[]) => void;
  updateProductPrice: (productId: string, sellingPrice: number) => void;
  getProductPrice: (productId: string) => ResellerProductPrice | undefined;
}

const ResellerContext = createContext<ResellerContextType | undefined>(undefined);

export const useReseller = () => {
  const context = useContext(ResellerContext);
  if (!context) {
    throw new Error('useReseller must be used within a ResellerProvider');
  }
  return context;
};

export const ResellerProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('reseller_logged_in') === 'true';
  });
  const [user, setUser] = useState<ResellerUser | null>(() => {
    const stored = localStorage.getItem('reseller_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [productPrices, setProductPrices] = useState<ResellerProductPrice[]>(() => {
    const stored = localStorage.getItem('reseller_product_prices');
    return stored ? JSON.parse(stored) : [
      { productId: '1', sellingPrice: 2499, lastUpdated: '2024-01-15' },
      { productId: '2', sellingPrice: 1799, lastUpdated: '2024-01-18' },
    ];
  });

  const updateUser = (newUser: ResellerUser | null, loggedIn: boolean) => {
    setUser(newUser);
    setIsLoggedIn(loggedIn);
    if (newUser) {
      localStorage.setItem('reseller_user', JSON.stringify(newUser));
      localStorage.setItem('reseller_logged_in', 'true');
    } else {
      localStorage.removeItem('reseller_user');
      localStorage.setItem('reseller_logged_in', 'false');
    }
  };

  const [orders, setOrders] = useState<ResellerOrder[]>([
    {
      id: 'RORD001',
      productId: '1',
      productName: 'Embroidered Silk Kurta Set',
      productImage: '/lovable-uploads/77d75687-0e00-4b74-8bf1-7c96b5fd6f5e.png',
      quantity: 5,
      buyingPrice: 1800,
      sellingPrice: 2499,
      status: 'delivered',
      orderDate: '2024-01-15',
      customerInfo: { name: 'Amit Kumar', phone: '+91 9876543210', email: 'amit@email.com' },
      shippingAddress: { name: 'Amit Kumar', phone: '+91 9876543210', address: '45 Market Road', city: 'Delhi', state: 'Delhi', pincode: '110001' },
    },
    {
      id: 'RORD002',
      productId: '2',
      productName: 'Printed Cotton Anarkali',
      productImage: '/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png',
      quantity: 3,
      buyingPrice: 1200,
      sellingPrice: 1799,
      status: 'shipped',
      orderDate: '2024-01-18',
      customerInfo: { name: 'Neha Singh', phone: '+91 9876543211', email: 'neha@email.com' },
      shippingAddress: { name: 'Neha Singh', phone: '+91 9876543211', address: '78 Fashion Lane', city: 'Jaipur', state: 'Rajasthan', pincode: '302001' },
    },
    {
      id: 'RORD003',
      productId: '3',
      productName: 'Designer Lehenga Choli',
      productImage: '/lovable-uploads/beea47d5-6ae4-460a-a065-76f4befc19cb.png',
      quantity: 8,
      buyingPrice: 4500,
      sellingPrice: 6499,
      status: 'pending',
      orderDate: '2024-01-20',
      isBulkOrder: true,
      customerInfo: { name: 'Riya Fashion', phone: '+91 9876543212', email: 'riya@fashion.com' },
      shippingAddress: { name: 'Riya Fashion', phone: '+91 9876543212', address: '12 Wholesale Hub', city: 'Surat', state: 'Gujarat', pincode: '395001' },
    }
  ]);

  const [sales] = useState<ResellerSale[]>([
    { id: 'RSALE001', orderId: 'RORD001', productName: 'Embroidered Silk Kurta Set', quantity: 2, sellingPrice: 2499, profit: 1398, saleDate: '2024-01-20', customerName: 'Amit Kumar' },
    { id: 'RSALE002', orderId: 'RORD001', productName: 'Embroidered Silk Kurta Set', quantity: 1, sellingPrice: 2499, profit: 699, saleDate: '2024-01-22', customerName: 'Neha Singh' },
  ]);

  const [payments] = useState<ResellerPayment[]>([
    { id: 'RPAY001', amount: 12000, status: 'released', releaseDate: '2024-01-25', period: 'Jan 1-15, 2024' },
    { id: 'RPAY002', amount: 7500, status: 'processing', period: 'Jan 16-31, 2024' },
    { id: 'RPAY003', amount: 10000, status: 'pending', period: 'Feb 1-15, 2024' },
  ]);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email && password) {
      updateUser({
        id: '1',
        name: 'Reseller Partner',
        email,
        phone: '+91 9876543210',
        shopName: 'Fashion Resellers',
        address: '45 Market Road, Delhi'
      }, true);
      return true;
    }
    return false;
  };

  const signup = async (userData: Partial<ResellerUser> & { password: string }): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (userData.email && userData.password) {
      updateUser({
        id: '1',
        name: userData.name || '',
        email: userData.email,
        phone: userData.phone || '',
        shopName: userData.shopName || '',
        address: userData.address || ''
      }, true);
      return true;
    }
    return false;
  };

  const logout = () => updateUser(null, false);

  const placeOrder = (order: OrderInput) => {
    const newOrder: ResellerOrder = {
      id: `RORD${String(orders.length + 1).padStart(3, '0')}`,
      ...order,
      status: 'pending',
      orderDate: new Date().toISOString().split('T')[0]
    };
    setOrders([...orders, newOrder]);
  };

  const placeBulkOrder = (orderItems: OrderInput[]) => {
    const newOrders = orderItems.map((order, index) => ({
      id: `RORD${String(orders.length + index + 1).padStart(3, '0')}`,
      ...order,
      status: 'pending' as const,
      orderDate: new Date().toISOString().split('T')[0],
      isBulkOrder: true
    }));
    setOrders([...orders, ...newOrders]);
  };

  const updateProductPrice = (productId: string, sellingPrice: number) => {
    const today = new Date().toISOString().split('T')[0];
    setProductPrices(prev => {
      const existing = prev.find(p => p.productId === productId);
      const updated = existing
        ? prev.map(p => p.productId === productId ? { ...p, sellingPrice, lastUpdated: today } : p)
        : [...prev, { productId, sellingPrice, lastUpdated: today }];
      localStorage.setItem('reseller_product_prices', JSON.stringify(updated));
      return updated;
    });
  };

  const getProductPrice = (productId: string) => productPrices.find(p => p.productId === productId);

  return (
    <ResellerContext.Provider value={{
      isLoggedIn, user, orders, sales, payments, productPrices,
      login, signup, logout, placeOrder, placeBulkOrder, updateProductPrice, getProductPrice
    }}>
      {children}
    </ResellerContext.Provider>
  );
};