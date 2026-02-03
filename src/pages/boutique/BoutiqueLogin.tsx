import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Store, Eye, EyeOff, Upload, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBoutique } from "@/contexts/BoutiqueContext";
import { logoImage } from "@/api/endpoints";
// import { useBoutique } from "@/contexts/BoutiqueContext";

const BoutiqueLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { login, signup, isLoggedIn } = useBoutique();

  const [isSignup, setIsSignup] = useState(searchParams.get('signup') === 'true');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    category: '',
    address: '',
    gstNumber: ''
  });

  const categories = [
    "Women Ethnic Wear",
    "Men Ethnic Wear",
    "Kids Ethnic Wear",
    "Bridal Collection",
    "Festive Wear",
    "Designer Boutique",
    "Multi-Category Store"
  ];

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/boutique/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        const success = await signup({
          name: formData.ownerName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          category: formData.category,
          shopName: formData.shopName,
          address: formData.address,
          gstNumber: formData.gstNumber
        });
        if (success) {
          toast({ title: "Welcome!", description: "Your boutique account has been created." });
          navigate('/boutique/dashboard');
        }
      } else {
        const success = await login(formData.email, formData.password);
        if (success) {
          toast({ title: "Welcome back!", description: "Login successful." });
          navigate('/boutique/dashboard');
        } else {
          toast({ title: "Error", description: "Invalid credentials.", variant: "destructive" });
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAadhaarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAadhaarFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-orange/10 via-cream to-warm-brown/5">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* <button 
            onClick={() => navigate('/boutique')}
            className="flex items-center gap-2 text-warm-brown hover:text-brand-orange"
          >
            <ArrowLeft className="h-5 w-5" />
            <Store className="h-6 w-6 md:h-8 md:w-8 text-brand-orange" />
            <span className="text-lg md:text-xl font-bold">Zarkhai Boutique</span>
          </button> */}
          <Link to="/boutique" className="flex items-center gap-2">
            <img
              src={logoImage}
              alt="Zarkha"
              className="h-8 w-auto cursor-pointer"
            />
          </Link>
        </div>
      </header>

      <div className="flex items-center justify-center py-8 md:py-12 px-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 bg-brand-orange/10 rounded-full flex items-center justify-center">
              <Store className="h-7 w-7 md:h-8 md:w-8 text-brand-orange" />
            </div>
            <CardTitle className="text-xl md:text-2xl text-warm-brown">
              {isSignup ? 'Register Your Boutique' : 'Boutique Partner Login'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shopName">Shop Name *</Label>
                      <Input
                        id="shopName"
                        value={formData.shopName}
                        onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                        required
                        placeholder="Your boutique name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Owner Name *</Label>
                      <Input
                        id="ownerName"
                        value={formData.ownerName}
                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        required
                        placeholder="Full name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Boutique Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Shop Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      placeholder="Complete shop address"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gst">GST Number (Optional)</Label>
                    <Input
                      id="gst"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                      placeholder="GSTIN (if applicable)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadhaar">Aadhaar Card (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <input
                        type="file"
                        id="aadhaar"
                        accept="image/*,.pdf"
                        onChange={handleAadhaarUpload}
                        className="hidden"
                      />
                      <label htmlFor="aadhaar" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {aadhaarFile ? aadhaarFile.name : 'Click to upload Aadhaar (optional)'}
                        </p>
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="••••••••"
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

              <Button type="submit" className="w-full" variant="brand" disabled={loading}>
                {loading ? 'Please wait...' : isSignup ? 'Register Boutique' : 'Login'}
              </Button>

              <div className="text-center text-sm">
                {isSignup ? (
                  <p className="text-muted-foreground">
                    Already a partner?{' '}
                    <button
                      type="button"
                      onClick={() => setIsSignup(false)}
                      className="text-brand-orange hover:underline font-medium"
                    >
                      Login here
                    </button>
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    New to Zarkhai?{' '}
                    <button
                      type="button"
                      onClick={() => setIsSignup(true)}
                      className="text-brand-orange hover:underline font-medium"
                    >
                      Register your boutique
                    </button>
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BoutiqueLogin;
