import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartSlider } from "@/components/ecommerce/CartSlider";
import { useCart } from "@/contexts/CartContext";
import GlobalLoader from "./components/GlobalLoader";
import ScrollToTop from "./components/common/ScrollToTop";
import CustomerService from "./pages/CustomerService";
import AboutUs from "./pages/AboutUs";

const Index = lazy(() => import("./pages/Index"));
const ProductListingPage = lazy(() => import("./components/ecommerce/ProductListing"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const Wishlist = lazy(() => import("./pages/Wishlist"));

const ContactUsPage = lazy(() => import("./pages/ContactUsPage"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));

const SizeGuide = lazy(() => import("./pages/SizeGuide"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Returns = lazy(() => import("./pages/Returns"));
const TaxInvoice = lazy(() => import("./pages/TaxInvoice"));

const NotFound = lazy(() => import("./pages/NotFound"));


const queryClient = new QueryClient();
console.log("Query Client:", queryClient);

const AppContent = () => {
  // const { items, isOpen, updateQuantity, removeItem, closeCart } = useCart();

  return (
    <>
      <ScrollToTop />
      <GlobalLoader />

      <Suspense fallback={<GlobalLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/track-order/:orderId" element={<TrackOrder />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/faq" element={<FaqPage />} />

          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/invoice" element={<TaxInvoice />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <CartSlider />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
