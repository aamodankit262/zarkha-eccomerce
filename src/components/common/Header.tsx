// import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Heart, Menu, Search, ShoppingCart, User } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupModal from "../auth/SignupModal";
import MegaMenu from "./MegaMenu";
import Navigation from "./Navigation";
import logoImage from "/lovable-uploads/f28c5d70-6a6a-45f1-b4ca-cb9652dec39b.png";
import { useAuthStore } from "@/store/authStore";

const Header = () => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { openCart, getTotalItems } = useCart();
  const openTimeoutRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  // const { isLoggedIn } = useAuth();
  const {isLogin} = useAuthStore();
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  const handleCategoryHover = (id: string) => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    if (id) {
      openTimeoutRef.current = window.setTimeout(() => {
        setHoveredCategory(id);
        setShowMegaMenu(true);
      }, 200);
    }
  };

  const handleMouseLeave = () => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    closeTimeoutRef.current = window.setTimeout(() => {
      setShowMegaMenu(false);
      setHoveredCategory("");
    }, 100);
  };

  const handleMegaMenuMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  };

  const handleMegaMenuClose = () => {
    setShowMegaMenu(false);
    setHoveredCategory("");
  };

  return (
    <div
      className="w-full bg-white sticky top-0 z-50 shadow-sm"
      onMouseLeave={handleMouseLeave}
    >
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <img
                src={logoImage}
                alt="Zarkha"
                className="h-8 w-auto cursor-pointer"
                onClick={() => navigate("/")}
              />
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              <div
                onClick={() => navigate("/products")}
                className="text-gray-700 hover:text-orange-500 cursor-pointer p-1"
              >
                <Search className="h-5 w-5" />
              </div>
              <div
                onClick={openCart}
                className="text-gray-700 hover:text-orange-500 cursor-pointer relative p-1"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="hidden md:flex items-center gap-2 text-gray-700 hover:text-orange-500 cursor-pointer">
                <Heart className="h-5 w-5" />
                <span className="text-sm">Favorites</span>
              </div>
              <div className="flex items-center">
                {isLogin ? (
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="bg-orange-500 text-white hover:bg-orange-600 transition-colors p-2 rounded-full flex items-center justify-center sm:rounded-md sm:px-4"
                  >
                    <span className="hidden sm:inline text-sm font-semibold">
                      MY DASHBOARD
                    </span>
                    <span className="sm:hidden">
                      <User className="h-5 w-5" />
                    </span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsSignupOpen(true)}
                      className="hidden sm:block bg-orange-500 text-white hover:bg-orange-600 transition-colors px-4 py-2 rounded-md text-sm font-semibold"
                    >
                      SIGN UP / SIGN IN
                    </button>
                    <button
                      onClick={() => setIsSignupOpen(true)}
                      className="sm:hidden text-sm font-medium text-gray-700 hover:text-orange-500"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Navigation
        onCategoryHover={handleCategoryHover}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleMegaMenuClose={handleMegaMenuClose}
      />
      {showMegaMenu && (
        <div onMouseEnter={handleMegaMenuMouseEnter}>
          <MegaMenu industryId={hoveredCategory} />
        </div>
      )}
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />
    </div>
  );
};

export default Header;
