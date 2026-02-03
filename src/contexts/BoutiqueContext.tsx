import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BoutiqueUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
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

export interface BoutiqueOrder {
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

interface BoutiqueSale {
  id: string;
  orderId: string;
  productName: string;
  quantity: number;
  sellingPrice: number;
  profit: number;
  saleDate: string;
  customerName: string;
}

interface BoutiquePayment {
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

interface BoutiqueContextType {
  isLoggedIn: boolean;
  user: BoutiqueUser | null;
  orders: BoutiqueOrder[];
  sales: BoutiqueSale[];
  payments: BoutiquePayment[];
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Partial<BoutiqueUser> & { password: string }) => Promise<boolean>;
  logout: () => void;
  placeOrder: (order: OrderInput) => void;
  placeBulkOrder: (orders: OrderInput[]) => void;
}

const BoutiqueContext = createContext<BoutiqueContextType | undefined>(undefined);

export const useBoutique = () => {
  const context = useContext(BoutiqueContext);
  if (!context) {
    throw new Error('useBoutique must be used within a BoutiqueProvider');
  }
  return context;
};

export const BoutiqueProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<BoutiqueUser | null>(null);
  
  const [orders, setOrders] = useState<BoutiqueOrder[]>([
    {
      id: 'ORD001',
      productId: '1',
      productName: 'Embroidered Silk Kurta Set',
      productImage: '/lovable-uploads/77d75687-0e00-4b74-8bf1-7c96b5fd6f5e.png',
      quantity: 5,
      buyingPrice: 1800,
      sellingPrice: 2499,
      status: 'delivered',
      orderDate: '2024-01-15',
      customerInfo: {
        name: 'Priya Sharma',
        phone: '+91 9876543210',
        email: 'priya@email.com'
      },
      shippingAddress: {
        name: 'Priya Sharma',
        phone: '+91 9876543210',
        address: '123 Fashion Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      billingAddress: {
        name: 'Priya Sharma',
        phone: '+91 9876543210',
        address: '123 Fashion Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      }
    },
    {
      id: 'ORD002',
      productId: '2',
      productName: 'Printed Cotton Anarkali',
      productImage: '/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png',
      quantity: 3,
      buyingPrice: 1200,
      sellingPrice: 1799,
      status: 'shipped',
      orderDate: '2024-01-18',
      customerInfo: {
        name: 'Anjali Patel',
        phone: '+91 9876543211',
        email: 'anjali@email.com'
      },
      shippingAddress: {
        name: 'Anjali Patel',
        phone: '+91 9876543211',
        address: '456 Style Avenue',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001'
      }
    },
    {
      id: 'ORD003',
      productId: '3',
      productName: 'Designer Lehenga Choli',
      productImage: '/lovable-uploads/beea47d5-6ae4-460a-a065-76f4befc19cb.png',
      quantity: 10,
      buyingPrice: 4500,
      sellingPrice: 6499,
      status: 'pending',
      orderDate: '2024-01-20',
      isBulkOrder: true,
      customerInfo: {
        name: 'Meera Boutique',
        phone: '+91 9876543212',
        email: 'meera@boutique.com'
      },
      shippingAddress: {
        name: 'Meera Boutique',
        phone: '+91 9876543212',
        address: '789 Wholesale Market',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302001'
      }
    }
  ]);

  const [sales] = useState<BoutiqueSale[]>([
    {
      id: 'SALE001',
      orderId: 'ORD001',
      productName: 'Embroidered Silk Kurta Set',
      quantity: 2,
      sellingPrice: 2499,
      profit: 1398,
      saleDate: '2024-01-20',
      customerName: 'Priya Sharma'
    },
    {
      id: 'SALE002',
      orderId: 'ORD001',
      productName: 'Embroidered Silk Kurta Set',
      quantity: 1,
      sellingPrice: 2499,
      profit: 699,
      saleDate: '2024-01-22',
      customerName: 'Anjali Patel'
    }
  ]);

  const [payments] = useState<BoutiquePayment[]>([
    {
      id: 'PAY001',
      amount: 15000,
      status: 'released',
      releaseDate: '2024-01-25',
      period: 'Jan 1-15, 2024'
    },
    {
      id: 'PAY002',
      amount: 8500,
      status: 'processing',
      period: 'Jan 16-31, 2024'
    },
    {
      id: 'PAY003',
      amount: 12000,
      status: 'pending',
      period: 'Feb 1-15, 2024'
    }
  ]);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email && password) {
      setUser({
        id: '1',
        name: 'Fashion Boutique',
        email,
        phone: '+91 9876543210',
        category: 'Women Ethnic Wear',
        shopName: 'Elegance Boutique',
        address: '123 Fashion Street, Mumbai'
      });
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const signup = async (userData: Partial<BoutiqueUser> & { password: string }): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (userData.email && userData.password) {
      setUser({
        id: '1',
        name: userData.name || '',
        email: userData.email,
        phone: userData.phone || '',
        category: userData.category || '',
        shopName: userData.shopName || '',
        address: userData.address || ''
      });
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const placeOrder = (order: OrderInput) => {
    const newOrder: BoutiqueOrder = {
      id: `ORD${String(orders.length + 1).padStart(3, '0')}`,
      ...order,
      status: 'pending',
      orderDate: new Date().toISOString().split('T')[0]
    };
    setOrders([...orders, newOrder]);
  };

  const placeBulkOrder = (orderItems: OrderInput[]) => {
    const newOrders = orderItems.map((order, index) => ({
      id: `ORD${String(orders.length + index + 1).padStart(3, '0')}`,
      ...order,
      status: 'pending' as const,
      orderDate: new Date().toISOString().split('T')[0],
      isBulkOrder: true
    }));
    setOrders([...orders, ...newOrders]);
  };

  return (
    <BoutiqueContext.Provider value={{
      isLoggedIn,
      user,
      orders,
      sales,
      payments,
      login,
      signup,
      logout,
      placeOrder,
      placeBulkOrder
    }}>
      {children}
    </BoutiqueContext.Provider>
  );
};
