import { affiliateAuthService } from "@/services/affiliateAuthService";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";

/* ---------------- Types ---------------- */

interface AffiliateUser {
  _id: string;
  full_name: string;
  email: string;
  phone_number: string;
  referralCode?: string;
  affiliate_category: string;
  aadhaar_card?: File;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  state: string;
  city: string;
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

const STORAGE_KEY = "affiliate-auth";

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
  // const [affiliate, setAffiliate] = useState<AffiliateUser | null>(null);
  const [affiliate, setAffiliate] = useState<AffiliateUser | null>(() => {
    // Restore from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState<string | null>(null);

  /* -------- Restore session -------- */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setAffiliate(parsed.affiliate ?? null);
      setToken(parsed.token ?? null);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  /* -------- Save session -------- */
  const saveSession = (user: AffiliateUser | null, authToken: string | null) => {
    setAffiliate(user);
    setToken(authToken);

    if (user && authToken) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ affiliate: user, token: authToken })
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  /* ---------------- Login ---------------- */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await affiliateAuthService.login({ email, password });

      if (!res.success) {
        toast.error(res.message);
        return false;
      }
       
      saveSession(res.body, res.token);
        toast.success(res.message);
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
        state_id: data.state,
        city_id: data.city,
        affiliate_category_id: data.category,
        aadhaar_card: data.aadhaarFile,
      });

      if (res.success) {
        toast.success(res.message);
        return true;
      } else (error: any) => {
        // toast.error(error?.response?.data?.message || "Signup failed");
        toast.error(error?.response?.data?.message || error.message || "Signup failed");

        return false;
      }

      // toast.error(res.message);
      return false;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Signup failed");
      return false;
    }
  };

  /* ---------------- Logout ---------------- */
  const logout = () => {
    saveSession(null, null);
  };

  return (
    <AffiliateContext.Provider
      value={{
        affiliate,
        isLoggedIn: !!affiliate,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AffiliateContext.Provider>
  );
};
