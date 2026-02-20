import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAffiliate } from "@/contexts/AffiliateContext";
import { useBoutique } from "@/contexts/BoutiqueContext";
import { toast } from "sonner";
import { ShoppingBag, Eye, EyeOff, ArrowLeft, Upload, X, Store, Percent, Sparkles, CheckCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { getCityList, getStateList } from "@/services/address.service";
import { useApi } from "@/hooks/useApi";
import { affiliateService } from "@/services/affiliateService";
import { logoImage } from "@/api/endpoints";
import { boutiqueService } from "@/boutiqueServices/boutiqueService";

type PartnerType = 'affiliate' | 'boutique' | null;

const PartnerLogin = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') as PartnerType;
  const isSignupParam = searchParams.get('signup') === 'true';
  const isMobile = useIsMobile();

  const [partnerType, setPartnerType] = useState<PartnerType>(initialType);
  const [showTypeSelector, setShowTypeSelector] = useState(!initialType);
  const [isSignup, setIsSignup] = useState(isSignupParam);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const navigate = useNavigate();

  const { login: affiliateLogin, signup: affiliateSignup, isLoggedIn: affiliateLoggedIn } = useAffiliate();

  const { login: boutiqueLogin, signup: boutiqueSignup, isLoggedIn: boutiqueLoggedIn } = useBoutique();
  const { request: fetchCategory, data, } = useApi(boutiqueService.boutiqueCategoryList);

  const { request: fetchBoutiqueCategory, data: boutiqueCategoryData,} = useApi(boutiqueService.boutiqueCategoryList)

  // Affiliate form data
  const [affiliateData, setAffiliateData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    state: "",
    city: "",
    category: "",
    aadhaarFile: null as File | null
  });

  // Boutique form data
  const [boutiqueData, setBoutiqueData] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    category: "",
    address: "",
    gstNumber: ""
  });

  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);

  // const affiliateCategories = [
  //   "Fashion Influencer",
  //   "Lifestyle Blogger",
  //   "Social Media Creator",
  //   "YouTube Reviewer",
  //   "Website Owner",
  //   "Email Marketer",
  //   "Other"
  // ];

  // const boutiqueCategories = [
  //   "Women Ethnic Wear",
  //   "Men Ethnic Wear",
  //   "Kids Ethnic Wear",
  //   "Bridal Collection",
  //   "Festive Wear",
  //   "Designer Boutique",
  //   "Multi-Category Store"
  // ];

  useEffect(() => {
    if (affiliateLoggedIn && partnerType === 'affiliate') {
      navigate('/affiliate/dashboard');
    }
    if (boutiqueLoggedIn && partnerType === 'boutique') {
      navigate('/boutique/dashboard');
    }
  }, [affiliateLoggedIn, boutiqueLoggedIn, partnerType, navigate]);

  useEffect(() => {
    getStateList().then((res) => setStates(res?.data || []));
  }, []);
  useEffect(() => {
    if (!affiliateData.state) {
      setCities([]);
      return;
    }
    getCityList(affiliateData.state).then((res) => setCities(res?.data || []));
  }, [affiliateData.state]);
  useEffect(() => {
    fetchCategory();
  }, [])
  useEffect(() => {
    fetchBoutiqueCategory();
  }, [initialType === 'boutique']);
  
  const affiliateCategories = data?.body;
  const boutiqueCategories = boutiqueCategoryData?.body;
  const handleTypeSelect = (type: PartnerType) => {
    setPartnerType(type);
    setShowTypeSelector(false);
  };

  const handleAffiliateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        if (!affiliateData.name
          || !affiliateData.email
          || !affiliateData.password
          || !affiliateData.phone
          || !affiliateData.state
          || !affiliateData.city
          || !affiliateData.category) {
          toast.error("Please fill all required fields");
          setLoading(false);
          return;
        }
        const success = await affiliateSignup(affiliateData);
        // console.log(success, 'signup');
        if (success) {
          // navigate('/affiliate/login');
          setIsSignup(false)

        } 
      } else {
        const success = await affiliateLogin(affiliateData.email, affiliateData.password);
        if (success) {
          // toast.success("Welcome back!");
          navigate('/affiliate/dashboard');
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleBoutiqueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        if (!boutiqueData.shopName || !boutiqueData.ownerName || !boutiqueData.email || !boutiqueData.password || !boutiqueData.phone || !boutiqueData.category || !boutiqueData.address) {
          toast.error("Please fill all required fields");
          setLoading(false);
          return;
        }
        const success = await boutiqueSignup({
          owner_name: boutiqueData.ownerName,
          email: boutiqueData.email,
          phone_number: boutiqueData.phone,
          password: boutiqueData.password,
          boutique_category_id: boutiqueData.category,
          shop_name: boutiqueData.shopName,
          shop_address: boutiqueData.address,
          gst_number: boutiqueData.gstNumber
        });
        if (success) {
          // toast.success("Boutique registered successfully!");
          // navigate('/boutique/dashboard');
          setIsSignup(false)
        } 
      } else {
        const success = await boutiqueLogin(boutiqueData.email, boutiqueData.password);
        if (success) {
          // toast.success("Welcome back!");
          navigate('/boutique/dashboard');
        } else {
          toast.error("Invalid credentials");
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Type Selection Dialog
  const TypeSelectorDialog = () => (
    <Dialog open={showTypeSelector}
      onOpenChange={(open) => {
        // Only allow closing if a partner type is already selected
        if (!open && partnerType) {
          setShowTypeSelector(false);
        }
      }}
    // onOpenChange={setShowTypeSelector} 
    >

      <DialogContent className="max-w-md mx-4 sm:mx-auto">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            {/* <div className="w-14 h-14 bg-gradient-to-br from-brand-orange to-warm-brown rounded-2xl flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-white" />
            </div> */}
            <Link to="#">
              <img
                src={logoImage}
                alt="Zarkha"
                className="h-8 w-auto cursor-pointer"
              />
            </Link>
          </div>
          <DialogTitle className="text-center text-lg sm:text-xl">Choose Your Partner Type</DialogTitle>
          <p className="text-center text-sm text-muted-foreground mt-1">Select how you want to partner with us</p>
        </DialogHeader>
        <div className="grid gap-3 sm:gap-4 py-4">
          <button
            onClick={() => handleTypeSelect('affiliate')}
            className="flex items-center gap-3 sm:gap-4 p-4 border-2 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Percent className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm sm:text-base">Affiliate Partner</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Earn up to 20% commission by sharing products</p>
            </div>
            <CheckCircle className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </button>
          <button
            onClick={() => handleTypeSelect('boutique')}
            className="flex items-center gap-3 sm:gap-4 p-4 border-2 rounded-xl hover:border-brand-orange hover:bg-brand-orange/5 transition-all text-left group"
          >
            <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Store className="h-5 w-5 sm:h-6 sm:w-6 text-brand-orange" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm sm:text-base">Boutique Partner</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Wholesale pricing, set your own margins</p>
            </div>
            <CheckCircle className="h-5 w-5 text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-orange/5 via-background to-warm-brown/5 flex flex-col relative overflow-hidden">
      <TypeSelectorDialog />

      {/* Background decoration */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="p-3 sm:p-4 relative z-10">
        <div className="container mx-auto flex items-center justify-between max-w-lg">
          <Link to="/partner" className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Back</span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
            {/* <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-brand-orange to-warm-brown rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
            </div>
            <span className="font-bold text-warm-brown text-sm sm:text-base">Zarkhai</span> */}
            <img
              src={logoImage}
              alt="Zarkha"
              className="h-8 w-auto cursor-pointer"
            />
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4 relative z-10">
        {partnerType && (
          <Card className="w-full max-w-md sm:max-w-lg border-0 shadow-xl bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-2 sm:pb-4">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 ${partnerType === 'affiliate' ? 'bg-gradient-to-br from-primary to-primary/80' : 'bg-gradient-to-br from-brand-orange to-warm-brown'} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg`}>
                {partnerType === 'affiliate' ? (
                  <Percent className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                ) : (
                  <Store className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                )}
              </div>
              <CardTitle className="text-xl sm:text-2xl">
                {isSignup
                  ? (partnerType === 'affiliate' ? 'Join Affiliate Program' : 'Register Your Boutique')
                  : (partnerType === 'affiliate' ? 'Affiliate Login' : 'Boutique Login')
                }
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {isSignup ? 'Create your account to get started' : 'Sign in to access your dashboard'}
              </p>
              <button
                type="button"
                onClick={() => setShowTypeSelector(true)}
                className="text-xs sm:text-sm text-brand-orange hover:underline mt-2 inline-flex items-center gap-1"
              >
                <span>Switch to {partnerType === 'affiliate' ? 'Boutique' : 'Affiliate'} Partner</span>
              </button>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {partnerType === 'affiliate' ? (
                <form onSubmit={handleAffiliateSubmit} className="space-y-3 sm:space-y-4">
                  {isSignup && (
                    <>
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={affiliateData.name}
                          onChange={(e) => setAffiliateData({ ...affiliateData, name: e.target.value })}
                          className="h-10 sm:h-11"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-sm">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={affiliateData.phone}
                          // onChange={(e) => setAffiliateData({ ...affiliateData, phone: e.target.value })}
                          onChange={(e) => setAffiliateData({
                            ...affiliateData,
                            phone: e.target.value.replace(/\D/g, "").slice(0, 10)
                          })}
                          className="h-10 sm:h-11"
                        />
                      </div>
                      <div
                        // className="grid md:grid-cols-2 gap-4"
                        className="space-y-1.5"
                      >
                        <Label htmlFor="state">State</Label>
                        <Select value={affiliateData.state} onValueChange={(v) => setAffiliateData({ ...affiliateData, state: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select State *" />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state._id} value={state._id}>
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Select
                          value={affiliateData.city}
                          onValueChange={(v) => setAffiliateData({ ...affiliateData, city: v })}
                          disabled={!affiliateData.state}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select City *" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city._id} value={city._id}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="category" className="text-sm">Category *</Label>
                        <Select
                          value={affiliateData.category}
                          onValueChange={(value) => setAffiliateData({ ...affiliateData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your category" />
                          </SelectTrigger>
                          <SelectContent>
                            {affiliateCategories.map((cat) => (
                              <SelectItem key={cat._id} value={cat._id}>{cat?.category_name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={affiliateData.email}
                      onChange={(e) => setAffiliateData({ ...affiliateData, email: e.target.value })}
                      className="h-10 sm:h-11"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-sm">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={affiliateData.password}
                        onChange={(e) => setAffiliateData({ ...affiliateData, password: e.target.value })}
                        className="h-10 sm:h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {isSignup && (
                    <div className="space-y-1.5">
                      <Label htmlFor="aadhaar" className="text-sm">Aadhaar Card (Optional)</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4">
                        {affiliateData.aadhaarFile ? (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground truncate flex-1">
                              {affiliateData.aadhaarFile.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => setAffiliateData({ ...affiliateData, aadhaarFile: null })}
                              className="text-destructive hover:text-destructive/80 ml-2"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center cursor-pointer">
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">Click to upload</span>
                            <input
                              id="aadhaar"
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file && file.size <= 5 * 1024 * 1024) {
                                  setAffiliateData({ ...affiliateData, aadhaarFile: file });
                                } else if (file) {
                                  toast.error("File size should be less than 5MB");
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full h-10 sm:h-11 mt-2" variant="brand" disabled={loading}>
                    {loading ? "Please wait..." : (isSignup ? "Create Account" : "Sign In")}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleBoutiqueSubmit} className="space-y-3 sm:space-y-4">
                  {isSignup && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="shopName" className="text-sm">Shop Name *</Label>
                          <Input
                            id="shopName"
                            value={boutiqueData.shopName}
                            onChange={(e) => setBoutiqueData({ ...boutiqueData, shopName: e.target.value })}
                            placeholder="Your boutique name"
                            className="h-10 sm:h-11"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="ownerName" className="text-sm">Owner Name *</Label>
                          <Input
                            id="ownerName"
                            value={boutiqueData.ownerName}
                            onChange={(e) => setBoutiqueData({ ...boutiqueData, ownerName: e.target.value })}
                            placeholder="Full name"
                            className="h-10 sm:h-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-sm">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={boutiqueData.phone}
                          onChange={(e) => setBoutiqueData({
                            ...boutiqueData,
                            phone: e.target.value.replace(/\D/g, "").slice(0, 10)
                          })}
                          placeholder="mobile number"
                          className="h-10 sm:h-11"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="category" className="text-sm">Boutique Category *</Label>
                        <Select
                          value={boutiqueData.category}
                          onValueChange={(value) => setBoutiqueData({ ...boutiqueData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your category" />
                          </SelectTrigger>
                          <SelectContent>
                            {boutiqueCategories?.map((cat) => (
                              <SelectItem key={cat._id} value={cat._id}>{cat?.type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="address" className="text-sm">Shop Address *</Label>
                        <Textarea
                          id="address"
                          value={boutiqueData.address}
                          onChange={(e) => setBoutiqueData({ ...boutiqueData, address: e.target.value })}
                          placeholder="Complete shop address"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="gst" className="text-sm">GST Number (Optional)</Label>
                        <Input
                          id="gst"
                          value={boutiqueData.gstNumber}
                          onChange={(e) => setBoutiqueData({ ...boutiqueData, gstNumber: e.target.value })}
                          placeholder="GSTIN (if applicable)"
                          className="h-10 sm:h-11"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="aadhaarBoutique" className="text-sm">Aadhaar Card (Optional)</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-3 sm:p-4 text-center">
                          <input
                            type="file"
                            id="aadhaarBoutique"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setAadhaarFile(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                          <label htmlFor="aadhaarBoutique" className="cursor-pointer">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              {aadhaarFile ? aadhaarFile.name : 'Click to upload Aadhaar (optional)'}
                            </p>
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={boutiqueData.email}
                      onChange={(e) => setBoutiqueData({ ...boutiqueData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="h-10 sm:h-11"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-sm">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={boutiqueData.password}
                        onChange={(e) => setBoutiqueData({ ...boutiqueData, password: e.target.value })}
                        placeholder="••••••••"
                        className="h-10 sm:h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-10 sm:h-11 mt-2" variant="brand" disabled={loading}>
                    {loading ? 'Please wait...' : isSignup ? 'Register Boutique' : 'Login'}
                  </Button>
                </form>
              )}

              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  {isSignup ? "Already have an account?" : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={() => setIsSignup(!isSignup)}
                    className="ml-1.5 text-brand-orange hover:underline font-medium"
                  >
                    {isSignup ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PartnerLogin;
