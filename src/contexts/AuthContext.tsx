import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { toast } from "@/components/ui/use-toast";
import { authService } from "@/services/authService";

interface User {
  id: string;
  name: string;
  phone: string;
  // profile_photo: string;
} 

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (mobile: string, otp: string) => Promise<void>;
  signup: (name: string, mobile: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// ✅ Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔁 Restore user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("auth-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔐 Login
  const login = async (mobile: string, otp: string) => {
    setLoading(true);
    try {
      const res = await authService.verifyOtp({ phone: mobile, otp });
      console
      setUser(res?.user);
      localStorage.setItem("auth-user", JSON.stringify(res.user));
      localStorage.setItem("token", res.token);

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err?.message || "Invalid credentials",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 📝 Signup
  const signup = async (name: string, mobile: string) => {
    setLoading(true);
    try {
      const res = await authService.sendOtp({ full_name: name, phone: mobile });
       console.log("Signup Response:", res);
      // setUser(res.user);
      // localStorage.setItem("auth-user", JSON.stringify(res.user));
      // localStorage.setItem("token", res.token);

      toast({
        title: "Account Created",
        description: "Welcome to our store!",
      });
    } catch (err: any) {
      toast({
        title: "Signup Failed",
        description: err?.message || "Something went wrong",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth-user");
    localStorage.removeItem("token");

    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
