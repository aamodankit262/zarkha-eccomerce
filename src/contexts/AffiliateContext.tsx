import { affiliateAuthService } from "@/services/affiliateAuthService";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
// import { affiliateAuthService } from "@/api/services/affiliateAuthService";
import { toast } from "sonner";

/* ---------------- Types ---------------- */

interface AffiliateUser {
  _id: string;
  full_name: string;
  email: string;
  phone_number: string;
  affiliate_category: string;
  aadhaar_card?: File;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  referralCode?: string;
  joinDate?: string;
  totalEarnings?: number;
  pendingPayment?: number;
  totalSales?: number;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  category: string;
  aadhaarFile?: File | null;
}

interface AffiliateContextType {
  affiliate: AffiliateUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
}

const AffiliateContext = createContext<AffiliateContextType | undefined>(undefined);

/* ---------------- Hook ---------------- */

export const useAffiliate = () => {
  const context = useContext(AffiliateContext);
  if (!context) {
    throw new Error("useAffiliate must be used within AffiliateProvider");
  }
  return context;
};

/* ---------------- Provider ---------------- */

export const AffiliateProvider = ({ children }: { children: ReactNode }) => {
  const [affiliate, setAffiliate] = useState<AffiliateUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  /* -------- Restore session -------- */
  useEffect(() => {
    const stored = localStorage.getItem("affiliate-auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      setAffiliate(parsed.affiliate);
      setToken(parsed.token);
    }
  }, []);

  /* ---------------- Login ---------------- */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await affiliateAuthService.login({ email, password });

      if (!res.success) {
        toast.error(res?.message); // 👈 pending approval message
        return false;
      }

      const authData = {
        token: res?.token,
        affiliate: res.body,
      };

      const local = localStorage.setItem("affiliate-auth", JSON.stringify(authData));
      // const local = localStorage.setItem("affiliate-auth", JSON.stringify(authData));
      console.log(local)
      setAffiliate(authData?.affiliate);
      setToken(authData.token);

      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
      return false;
    }
  };

  /* ---------------- Signup ---------------- */
  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      const res = await affiliateAuthService.signup({
        full_name: data.name,
        email: data.email,
        password: data.password,
        phone_number: data.phone,
        affiliate_category: data.category,
        aadhaar_card: data.aadhaarFile,
      });

      if (res.data.success) {
        toast.success(res.data.message); // 👈 pending approval message
        return true;
      }

      toast.error(res.data.message);
      return false;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Signup failed");
      return false;
    }
  };

  /* ---------------- Logout ---------------- */
  const logout = () => {
    localStorage.removeItem("affiliate-auth");
    setAffiliate(null);
    setToken(null);
  };

  return (
    <AffiliateContext.Provider
      value={{
        affiliate,
        isLoggedIn: !!token,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AffiliateContext.Provider>
  );
};
