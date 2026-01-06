import { createContext, useContext, useState, ReactNode } from "react";

interface AffiliateUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  category: string;
  joinDate: string;
  totalEarnings: number;
  pendingPayment: number;
  totalSales: number;
}

interface AffiliateContextType {
  affiliate: AffiliateUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (data: SignupData) => Promise<boolean>;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  category: string;
}

const AffiliateContext = createContext<AffiliateContextType | undefined>(undefined);

export const useAffiliate = () => {
  const context = useContext(AffiliateContext);
  if (!context) {
    throw new Error('useAffiliate must be used within an AffiliateProvider');
  }
  return context;
};

export const AffiliateProvider = ({ children }: { children: ReactNode }) => {
  const [affiliate, setAffiliate] = useState<AffiliateUser | null>(null);

  const generateReferralCode = (name: string) => {
    const prefix = name.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${random}`;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email && password) {
      setAffiliate({
        id: "aff_001",
        name: "John Affiliate",
        email: email,
        phone: "+91 9876543210",
        referralCode: "JOH8K2M",
        category: "Fashion Influencer",
        joinDate: "2024-01-15",
        totalEarnings: 45680,
        pendingPayment: 12500,
        totalSales: 156
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAffiliate(null);
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    if (data.name && data.email && data.password) {
      setAffiliate({
        id: "aff_" + Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        referralCode: generateReferralCode(data.name),
        category: data.category,
        joinDate: new Date().toISOString().split('T')[0],
        totalEarnings: 0,
        pendingPayment: 0,
        totalSales: 0
      });
      return true;
    }
    return false;
  };

  return (
    <AffiliateContext.Provider value={{ affiliate, isLoggedIn: !!affiliate, login, logout, signup }}>
      {children}
    </AffiliateContext.Provider>
  );
};
