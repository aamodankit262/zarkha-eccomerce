import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Copy, 
  Gift, 
  Users,
  LogOut,
  User,
  Package,
  Wallet,
  BarChart3,
  Menu,
  X,
  Home,
  Tag,
  CreditCard,
  Settings
} from "lucide-react";

// Dashboard Components
import AffiliateProducts from "@/components/affiliate/AffiliateProducts";
import AffiliateCoupons from "@/components/affiliate/AffiliateCoupons";
import AffiliateSales from "@/components/affiliate/AffiliateSales";
import AffiliateEarnings from "@/components/affiliate/AffiliateEarnings";
import AffiliateProfile from "@/components/affiliate/AffiliateProfile";
import { useAffiliate } from "@/contexts/AffiliateContext";
import { logoImage } from "@/api/endpoints";

const AffiliateDashboard = () => {
  const { affiliate, isLoggedIn, logout } = useAffiliate();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/affiliate/login');
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate('/affiliate');
  };

  const copyReferralCode = () => {
    if (affiliate?.referralCode) {
      navigator.clipboard.writeText(affiliate.referralCode);
      toast.success("Referral code copied!");
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${affiliate?.referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Referral link copied!");
  };

  if (!affiliate) return null;

  const stats = [
    { 
      title: "Total Earnings", 
      value: `₹${affiliate.totalEarnings.toLocaleString()}`, 
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-green-600 bg-green-100"
    },
    { 
      title: "Pending Payment", 
      value: `₹${affiliate.pendingPayment.toLocaleString()}`, 
      icon: <Wallet className="h-5 w-5" />,
      color: "text-orange-600 bg-orange-100"
    },
    { 
      title: "Total Sales", 
      value: affiliate.totalSales.toString(), 
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-blue-600 bg-blue-100"
    },
    { 
      title: "Active Coupons", 
      value: "5", 
      icon: <Gift className="h-5 w-5" />,
      color: "text-purple-600 bg-purple-100"
    }
  ];

  const menuItems = [
    { id: "overview", label: "Overview", icon: <Home className="h-5 w-5" /> },
    { id: "products", label: "Products", icon: <Package className="h-5 w-5" /> },
    { id: "coupons", label: "Coupons", icon: <Tag className="h-5 w-5" /> },
    { id: "sales", label: "Sales", icon: <BarChart3 className="h-5 w-5" /> },
    { id: "earnings", label: "Earnings", icon: <CreditCard className="h-5 w-5" /> },
    { id: "profile", label: "Profile", icon: <User className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              {/* <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="font-bold text-foreground">Ethnic Store</span> */}
              <img
                  src={logoImage}
                  alt="Zarkha"
                  className="h-8 w-auto cursor-pointer"
                  onClick={() => navigate("/")}
                />
            </Link>
            <Badge variant="secondary" className="hidden sm:flex">Affiliate Partner</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-lg">
              <span className="text-sm text-muted-foreground">Code:</span>
              <span className="font-mono font-bold text-primary">{affiliate.referralCode}</span>
              <button onClick={copyReferralCode} className="text-muted-foreground hover:text-primary">
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <Card className="sticky top-24">
            <CardContent className="p-4">
              <div className="text-center mb-6 pt-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{affiliate.name}</h3>
                <p className="text-sm text-muted-foreground">{affiliate.category}</p>
              </div>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                      activeTab === item.id 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
            <div className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border p-4" onClick={e => e.stopPropagation()}>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                      activeTab === item.id 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${stat.color}`}>
                          {stat.icon}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-xl font-bold text-foreground">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Referral Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Referral Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 bg-secondary rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Referral Code</p>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-lg text-primary">{affiliate.referralCode}</span>
                        <Button size="sm" variant="ghost" onClick={copyReferralCode}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 bg-secondary rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Referral Link</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm truncate">{window.location.origin}?ref={affiliate.referralCode}</span>
                        <Button size="sm" variant="ghost" onClick={copyReferralLink}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("products")}>
                  <CardContent className="p-6 text-center">
                    <Package className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold">Browse Products</h3>
                    <p className="text-sm text-muted-foreground">Find products to promote</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("coupons")}>
                  <CardContent className="p-6 text-center">
                    <Tag className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold">Your Coupons</h3>
                    <p className="text-sm text-muted-foreground">Manage discount codes</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("earnings")}>
                  <CardContent className="p-6 text-center">
                    <Wallet className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold">View Earnings</h3>
                    <p className="text-sm text-muted-foreground">Track your payments</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "products" && <AffiliateProducts />}
          {activeTab === "coupons" && <AffiliateCoupons />}
          {activeTab === "sales" && <AffiliateSales />}
          {activeTab === "earnings" && <AffiliateEarnings />}
          {activeTab === "profile" && <AffiliateProfile />}
        </main>
      </div>
    </div>
  );
};

export default AffiliateDashboard;
