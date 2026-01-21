import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAffiliate } from "@/contexts/AffiliateContext";
import { toast } from "sonner";
import { ShoppingBag, Eye, EyeOff, ArrowLeft, Upload, X } from "lucide-react";
import { logoImage } from "@/api/endpoints";

const AffiliateLogin = () => {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get('signup') === 'true');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, signup, isLoggedIn } = useAffiliate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    category: "",
    aadhaarFile: null as File | null
  });

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/affiliate/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const categories = [
    "Fashion Influencer",
    "Lifestyle Blogger",
    "Social Media Creator",
    "YouTube Reviewer",
    "Website Owner",
    "Email Marketer",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.category) {
          toast.error("Please fill all fields");
          setLoading(false);
          return;
        }
        const success = await signup(formData);
        if (success) {
          toast.success("Account created successfully!");
          navigate('/affiliate/dashboard');
        } else {
          toast.error("Signup failed. Please try again.");
        }
      } else {
        const success = await login(formData.email, formData.password);
        if (success) {
          toast.success("Welcome back!");
          navigate('/affiliate/dashboard');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      {/* Header */}
      <header className="p-3 sm:p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/affiliate" className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base hidden sm:inline">Back to Affiliate Program</span>
            <span className="text-sm sm:hidden">Back</span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
            <img
              src={logoImage}
              alt="Zarkha"
              className="h-8 w-auto cursor-pointer"
              onClick={() => navigate("/")}
            />
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              {isSignup ? "Join Affiliate Program" : "Affiliate Login"}
            </CardTitle>
            <CardDescription>
              {isSignup
                ? "Create your affiliate account and start earning"
                : "Sign in to access your affiliate dashboard"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Affiliate Category</Label>
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
                    <Label htmlFor="aadhaar">Aadhaar Card (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4">
                      {formData.aadhaarFile ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground truncate flex-1">
                            {formData.aadhaarFile.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, aadhaarFile: null })}
                            className="text-destructive hover:text-destructive/80 ml-2"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center cursor-pointer">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">Click to upload Aadhaar</span>
                          <span className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max 5MB)</span>
                          <input
                            id="aadhaar"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file && file.size <= 5 * 1024 * 1024) {
                                setFormData({ ...formData, aadhaarFile: file });
                              } else if (file) {
                                toast.error("File size should be less than 5MB");
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? "Please wait..." : (isSignup ? "Create Account" : "Sign In")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isSignup ? "Already have an account?" : "Don't have an account?"}
                <button
                  type="button"
                  onClick={() => setIsSignup(!isSignup)}
                  className="ml-2 text-primary hover:underline font-medium"
                >
                  {isSignup ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AffiliateLogin;
