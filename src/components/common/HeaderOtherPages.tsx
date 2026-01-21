import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Search, ShoppingCart, User, Menu, X } from "lucide-react";
import logoImage from "/lovable-uploads/f28c5d70-6a6a-45f1-b4ca-cb9652dec39b.png";
import SignupModal from "../auth/SignupModal";
// import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useAuthStore } from "@/store/authStore";

export default function HeaderOtherPages() {
  const [isSignupOpen, setIsSignupOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const { isLoggedIn } = useAuth();
  const {isLogin} = useAuthStore();
  const { openCart, getTotalItems } = useCart();
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Desktop & Tablet Header */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={logoImage}
                alt="Zarkhai"
                className="h-8 w-auto cursor-pointer"
                onClick={() => navigate("/")}
              />
            </div>

            <div className="flex items-center gap-4 lg:gap-6">
              <div
                onClick={() => navigate("/products")}
                className="flex items-center gap-1 cursor-pointer text-gray-600 hover:text-orange-500"
              >
                <Search className="h-5 w-5" />
                {/* <span className="text-sm hidden lg:inline">Search</span> */}
              </div>
              <div
                onClick={openCart}
                className="flex items-center gap-1 cursor-pointer relative text-gray-600 hover:text-orange-500"
              >
                <ShoppingCart className="h-5 w-5" />
                {/* <span className="text-sm hidden lg:inline">Cart</span> */}
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              {isLogin && (
              <div  
              onClick={() => navigate("/wishlist")}
              className="flex items-center gap-1 cursor-pointer text-gray-600 hover:text-orange-500">
                <Heart className="h-5 w-5" />
                {/* <span className="text-sm hidden lg:inline">Favorites</span> */}
              </div>
              )}
              <button
                onClick={
                  isLogin
                    ? () => navigate("/dashboard")
                    : () => setIsSignupOpen(true)
                }
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 lg:px-4 py-2 rounded text-xs lg:text-sm font-medium"
              >
                {isLogin ? (
                  <>
                    <span className="hidden lg:inline">MY DASHBOARD</span>
                    <span className="lg:hidden">DASHBOARD</span>
                  </>
                ) : (
                  <>
                    <span className="hidden lg:inline">SIGN UP / SIGN IN</span>
                    <span className="lg:hidden">LOGIN</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={logoImage}
                alt="Zarkhai"
                className="h-7 w-auto cursor-pointer"
                onClick={() => navigate("/")}
              />
            </div>

            <div className="flex items-center space-x-3">
              <div
                onClick={() => navigate("/products")}
                className="text-gray-600 hover:text-orange-500 cursor-pointer"
              >
                <Search className="h-5 w-5" />
              </div>
              <div
                onClick={openCart}
                className="text-gray-600 hover:text-orange-500 cursor-pointer relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-orange-500 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white mt-3">
              <div className="px-2 py-3 space-y-3">
                <div className="flex items-center gap-3 text-gray-600 hover:text-orange-500 cursor-pointer py-2">
                  <Heart className="h-5 w-5" />
                  <span className="text-sm">Favorites</span>
                </div>
                <button
                  onClick={
                    isLogin
                      ? () => {
                          navigate("/dashboard");
                          setIsMobileMenuOpen(false);
                        }
                      : () => {
                          setIsSignupOpen(true);
                          setIsMobileMenuOpen(false);
                        }
                  }
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded text-sm font-medium"
                >
                  {isLogin ? "MY DASHBOARD" : "SIGN UP / SIGN IN"}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />
    </>
  );
}