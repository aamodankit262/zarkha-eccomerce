import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
// import { AuthProvider } from "@/contexts/AuthContext";
import { CartSlider } from "@/components/ecommerce/CartSlider";
import GlobalLoader from "./components/GlobalLoader";
import ScrollToTop from "./components/common/ScrollToTop";
import AffiliateLanding from "./pages/affiliate/AffiliateLanding";
import AffiliateLogin from "./pages/affiliate/AffiliateLogin";
import AffiliateDashboard from "./pages/affiliate/AffiliateDashboard";
import { AffiliateProvider } from "./contexts/AffiliateContext";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import ContactUs from "./pages/ContactUs";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import SearchProductsPage from "./components/SearchProductsPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import BoutiqueLanding from "./pages/boutique/BoutiqueLanding";
import BoutiqueLogin from "./pages/boutique/BoutiqueLogin";
import BoutiqueDashboard from "./pages/boutique/BoutiqueDashboard";
import BoutiqueOrderDetail from "./pages/boutique/BoutiqueOrderDetail";
import BoutiquePayment from "./pages/boutique/BoutiquePayment";
import BoutiqueDirectory from "./pages/boutique/BoutiqueDirectory";
import BoutiqueStorefront from "./pages/boutique/BoutiqueStorefront";
import BoutiqueBrandPage from "./pages/boutique/BoutiqueBrandPage";
import { BoutiqueProvider } from "./contexts/BoutiqueContext";
import { BoutiqueCartProvider } from "./contexts/BoutiqueCartContext";
import PartnerLanding from "./pages/partner/PartnerLanding";
import PartnerLogin from "./pages/partner/PartnerLogin";

const Index = lazy(() => import("./pages/Index"));
const ProductListingPage = lazy(() => import("./components/ecommerce/ProductListing"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
// const CartPage = lazy(() => import("./pages/CartPage"));
// const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const Wishlist = lazy(() => import("./pages/Wishlist"));

// const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));

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
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          {/* <Route path="/cart" element={<CartPage />} /> */}
          <Route path="/search" element={<SearchProductsPage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/invoice" element={<TaxInvoice />} />

          {/* Affiliate Public */}
          {/* <Route path="/affiliate" element={<AffiliateLanding />} />
          <Route path="/affiliate/login" element={<AffiliateLogin />} /> */}
          <Route path="/affiliate/dashboard" element={<AffiliateDashboard />} />
          {/* boutique route */}
          {/* <Route path="/boutique" element={<BoutiqueLanding />} />
          <Route path="/boutique/login" element={<BoutiqueLogin />} /> */}


          {/* partner route */}
          <Route path="/partner" element={<PartnerLanding />} />
          <Route path="/partner/login" element={<PartnerLogin />} />
          <Route path="/affiliate" element={<PartnerLanding />} />
          <Route path="/affiliate/login" element={<PartnerLogin />} />
          <Route path="/boutique" element={<PartnerLanding />} />
          <Route path="/boutique/login" element={<PartnerLogin />} />
          <Route path="/boutique/dashboard" element={<BoutiqueDashboard />} />
          <Route path="/boutique/order/:orderId" element={<BoutiqueOrderDetail />} />
          <Route path="/boutique/payment" element={<BoutiquePayment />} />
          <Route path="/boutique/directory" element={<BoutiqueDirectory />} />
          <Route path="/boutique/store/:boutiqueId" element={<BoutiqueStorefront />} />
          <Route path="/shop/:boutiqueId" element={<BoutiqueBrandPage />} />

          {/* 🔐 Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/track-order/:orderId" element={<TrackOrder />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <CartSlider />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* <AuthProvider> */}
    <AffiliateProvider>
      <BoutiqueProvider>
        <BoutiqueCartProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </BoutiqueCartProvider>
      </BoutiqueProvider>
    </AffiliateProvider>
    {/* </AuthProvider> */}
  </QueryClientProvider>
);

export default App;
