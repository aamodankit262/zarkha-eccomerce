import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Heart, Search, ShoppingCart, User, Menu, X } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { categories } from "@/data/constant";
import SignupModal from "../auth/SignupModal";
// import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useAuthStore } from "@/store/authStore";
import { logoImage } from "@/api/endpoints";

export default function HeaderSearchBar() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSignupOpen, setIsSignupOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const { isLogin } = useAuth();
  const {isLogin} = useAuthStore();
  const { openCart, getTotalItems } = useCart();
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <img
                  src={logoImage}
                  alt="Zarkhai"
                  className="h-8 w-auto cursor-pointer"
                  onClick={() => navigate("/")}
                />
              </div>
            </div>

            <div className="flex-1 max-w-2xl mx-8">
              <div className="flex">
                <DropdownMenu>
                  <DropdownMenuTrigger className="bg-gray-100 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none hover:bg-gray-200 flex items-center gap-1 min-w-[80px]">
                    {selectedCategory}
                    <ChevronDown className="h-3 w-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[120px]">
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="cursor-pointer"
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full px-4 py-2 border-t border-b border-gray-300 focus:outline-none"
                  />
                </div>
                <button className="bg-gray-200 border border-gray-300 rounded-r-md px-4 py-2 hover:bg-gray-300 focus:outline-none">
                  <Search className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div
                onClick={openCart}
                className="flex flex-col items-center text-gray-600 hover:text-orange-500 cursor-pointer relative"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="text-xs mt-1">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-center text-gray-600 hover:text-orange-500 cursor-pointer">
                <Heart className="h-5 w-5" />
                <span className="text-xs mt-1">Favorites</span>
              </div>
              <button
                onClick={
                  isLogin
                    ? () => navigate("/dashboard")
                    : () => setIsSignupOpen(true)
                }
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none"
              >
                {isLogin ? "MY DASHBOARD" : "SIGN UP / SIGN IN"}
              </button>
            </div>
          </div>

          {/* Tablet Header */}
          <div className="hidden md:flex lg:hidden items-center justify-between h-16">
            <div className="flex items-center">
              <img
                src={logoImage}
                alt="Zarkhai"
                className="h-8 w-auto cursor-pointer"
                onClick={() => navigate("/")}
              />
            </div>

            <div className="flex-1 max-w-md mx-4">
              <div className="flex">
                <DropdownMenu>
                  <DropdownMenuTrigger className="bg-gray-100 border border-gray-300 rounded-l-md px-2 py-2 text-sm focus:outline-none hover:bg-gray-200 flex items-center gap-1">
                    <span className="hidden sm:inline">{selectedCategory}</span>
                    <ChevronDown className="h-3 w-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[120px]">
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="cursor-pointer"
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full px-3 py-2 border-t border-b border-gray-300 focus:outline-none text-sm"
                  />
                </div>
                <button className="bg-gray-200 border border-gray-300 rounded-r-md px-3 py-2 hover:bg-gray-300 focus:outline-none">
                  <Search className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div
                onClick={openCart}
                className="text-gray-600 hover:text-orange-500 cursor-pointer relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="text-gray-600 hover:text-orange-500 cursor-pointer">
                <Heart className="h-5 w-5" />
              </div>
              <button
                onClick={
                  isLogin
                    ? () => navigate("/dashboard")
                    : () => setIsSignupOpen(true)
                }
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-xs font-medium focus:outline-none"
              >
                {isLogin ? "DASHBOARD" : "LOGIN"}
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between h-16">
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
                onClick={openCart}
                className="text-gray-600 hover:text-orange-500 cursor-pointer relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
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

          {/* Mobile Search & Menu */}
          <div className="md:hidden">
            <div className="px-2 py-3 border-t border-gray-200">
              <div className="flex">
                <DropdownMenu>
                  <DropdownMenuTrigger className="bg-gray-100 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none hover:bg-gray-200 flex items-center gap-1">
                    <ChevronDown className="h-3 w-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[120px]">
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="cursor-pointer"
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-3 py-2 border-t border-b border-gray-300 focus:outline-none text-sm"
                  />
                </div>
                <button className="bg-gray-200 border border-gray-300 rounded-r-md px-3 py-2 hover:bg-gray-300 focus:outline-none">
                  <Search className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            {isMobileMenuOpen && (
              <div className="border-t border-gray-200 bg-white">
                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center gap-3 text-gray-600 hover:text-orange-500 cursor-pointer">
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
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-md text-sm font-medium focus:outline-none"
                  >
                    {isLogin ? "MY DASHBOARD" : "SIGN UP / SIGN IN"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />
    </>
  );
}