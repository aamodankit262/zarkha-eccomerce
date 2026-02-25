import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Store, Eye, EyeOff, Upload, ArrowLeft, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useReseller } from "@/contexts/contexts/ResellerContext";

const ResellerLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { login, signup, isLoggedIn } = useReseller();

  const [isSignup, setIsSignup] = useState(searchParams.get('signup') === 'true');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    shopName: '', ownerName: '', email: '', phone: '', password: '', address: '', gstNumber: ''
  });

  useEffect(() => { if (isLoggedIn) navigate('/reseller/dashboard'); }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        const success = await signup({ name: formData.ownerName, email: formData.email, phone: formData.phone, password: formData.password, shopName: formData.shopName, address: formData.address, gstNumber: formData.gstNumber });
        if (success) { toast({ title: "Welcome!", description: "Your reseller account has been created." }); navigate('/reseller/dashboard'); }
      } else {
        const success = await login(formData.email, formData.password);
        if (success) { toast({ title: "Welcome back!", description: "Login successful." }); navigate('/reseller/dashboard'); }
        else { toast({ title: "Error", description: "Invalid credentials.", variant: "destructive" }); }
      }
    } catch { toast({ title: "Error", description: "Something went wrong.", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-orange/10 via-cream to-warm-brown/5">
      <header className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/partner" className="flex items-center gap-2 text-warm-brown hover:text-brand-orange">
            <ArrowLeft className="h-5 w-5" />
            <ShoppingBag className="h-6 w-6 md:h-8 md:w-8 text-brand-orange" />
            <span className="text-lg md:text-xl font-bold">Zarkhai Reseller</span>
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
              {isSignup ? 'Register as Reseller' : 'Reseller Login'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Business Name *</Label><Input value={formData.shopName} onChange={(e) => setFormData({...formData, shopName: e.target.value})} required placeholder="Your business name" /></div>
                    <div className="space-y-2"><Label>Owner Name *</Label><Input value={formData.ownerName} onChange={(e) => setFormData({...formData, ownerName: e.target.value})} required placeholder="Full name" /></div>
                  </div>
                  <div className="space-y-2"><Label>Phone Number *</Label><Input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required placeholder="+91 XXXXXXXXXX" /></div>
                  <div className="space-y-2"><Label>Business Address *</Label><Textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required placeholder="Complete address" rows={2} /></div>
                  <div className="space-y-2"><Label>GST Number (Optional)</Label><Input value={formData.gstNumber} onChange={(e) => setFormData({...formData, gstNumber: e.target.value})} placeholder="GSTIN (if applicable)" /></div>
                  <div className="space-y-2">
                    <Label>Aadhaar Card (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <input type="file" id="aadhaar-reseller" accept="image/*,.pdf" onChange={(e) => { if (e.target.files?.[0]) setAadhaarFile(e.target.files[0]); }} className="hidden" />
                      <label htmlFor="aadhaar-reseller" className="cursor-pointer"><Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" /><p className="text-sm text-muted-foreground">{aadhaarFile ? aadhaarFile.name : 'Click to upload (optional)'}</p></label>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2"><Label>Email Address *</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required placeholder="you@example.com" /></div>
              <div className="space-y-2">
                <Label>Password *</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" variant="brand" disabled={loading}>
                {loading ? 'Please wait...' : isSignup ? 'Register as Reseller' : 'Login'}
              </Button>

              <div className="text-center text-sm">
                <p className="text-muted-foreground">
                  {isSignup ? 'Already a reseller?' : 'New to Zarkhai?'}{' '}
                  <button type="button" onClick={() => setIsSignup(!isSignup)} className="text-brand-orange hover:underline font-medium">
                    {isSignup ? 'Login here' : 'Register now'}
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResellerLogin;