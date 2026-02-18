import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Store, User, MapPin, Phone, Mail, Clock, Calendar,
  Building2, CreditCard, FileText, Image, Upload,
  Instagram, Facebook, Globe, MessageCircle, Pencil, Save, X
} from "lucide-react";
import { useBoutique } from "@/contexts/BoutiqueContext";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/useApi";
import { boutiqueService } from "@/boutiqueServices/boutiqueService";

const BOUTIQUE_CATEGORIES = [
  "Women Ethnic Wear", "Women Western Wear", "Men's Fashion",
  "Kids Wear", "Bridal Wear", "Accessories", "Footwear", "Home Decor"
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface BoutiqueProfileData {
  storeName: string;
  ownerName: string;
  category: string;
  subcategory: string;
  email: string;
  phone: string;
  storeAddress: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber: string;
  // Pickup Person
  pickupPersonName: string;
  pickupPersonPhone: string;
  pickupAddress: string;
  // Bank Details
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  upiId: string;
  // Social
  instagram: string;
  facebook: string;
  whatsapp: string;
  website: string;
  // Operating
  operatingDays: string[];
  openingTime: string;
  closingTime: string;
  // Documents
  panNumber: string;
  aadharNumber: string;
  // Brand
  brandLogo: string;
  digitalSignature: string;
  aboutBrand: string;
}

const BoutiqueProfile = () => {
  const { user } = useBoutique();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const { data, request: fetchProfile, loading } = useApi(boutiqueService.getProfile);
  const { request: fetchCategory, data: categoryData } = useApi(boutiqueService.boutiqueCategoryList);

  const [profile, setProfile] = useState<BoutiqueProfileData>(() => {
    const stored = localStorage.getItem('boutique_profile');
    return stored ? JSON.parse(stored) : {
      storeName: user?.shop_name || '',
      ownerName: user?.owner_name || '',
      category: user?.boutique_category || '',
      subcategory: '',
      email: user?.email || '',
      phone: user?.phone_number || '',
      storeAddress: user?.shop_address || '',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      gstNumber: user?.gst_number || '',
      pickupPersonName: '',
      pickupPersonPhone: '',
      pickupAddress: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      upiId: '',
      instagram: '',
      facebook: '',
      whatsapp: '',
      website: '',
      operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      openingTime: '10:00',
      closingTime: '20:00',
      panNumber: '',
      aadharNumber: '',
      brandLogo: '',
      digitalSignature: '',
      aboutBrand: ''
    };
  });

  useEffect(() => {
    fetchProfile();
    fetchCategory();
  }, []);

  const handleSave = () => {
    localStorage.setItem('boutique_profile', JSON.stringify(profile));
    setIsEditing(false);
    toast({ title: "Profile Saved!", description: "Your boutique profile has been updated." });
  };

  const handleImageUpload = (field: 'brandLogo' | 'digitalSignature') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setProfile(prev => ({ ...prev, [field]: ev.target?.result as string }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleDocUpload = (docType: string) => {
    toast({ title: `${docType} Upload`, description: "Document upload functionality ready." });
  };

  const toggleDay = (day: string) => {
    setProfile(prev => ({
      ...prev,
      operatingDays: prev.operatingDays.includes(day)
        ? prev.operatingDays.filter(d => d !== day)
        : [...prev.operatingDays, day]
    }));
  };

  const update = (field: keyof BoutiqueProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-brand-orange/10 rounded-lg">
          <Icon className="h-4 w-4 text-brand-orange" />
        </div>
        <h3 className="font-semibold text-base">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Boutique Profile</CardTitle>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button variant="brand" size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" /> Save
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4 mr-1" /> Edit Profile
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Brand Logo & Digital Signature */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center gap-2">
            <Label className="text-sm text-muted-foreground">Brand Logo</Label>
            <div
              className={`w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden ${isEditing ? 'cursor-pointer hover:border-brand-orange' : ''}`}
              onClick={() => isEditing && handleImageUpload('brandLogo')}
            >
              {profile.brandLogo ? (
                <img src={profile.brandLogo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Image className="h-6 w-6 mx-auto text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Upload</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Label className="text-sm text-muted-foreground">Digital Signature</Label>
            <div
              className={`w-32 h-16 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden ${isEditing ? 'cursor-pointer hover:border-brand-orange' : ''}`}
              onClick={() => isEditing && handleImageUpload('digitalSignature')}
            >
              {profile.digitalSignature ? (
                <img src={profile.digitalSignature} alt="Signature" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center">
                  <FileText className="h-5 w-5 mx-auto text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Upload</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Store Information */}
        <Section title="Store Information" icon={Store}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Store Name</Label>
              {isEditing ? (
                <Input value={profile.storeName} onChange={(e) => update('storeName', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.storeName || '—'}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Owner Name</Label>
              {isEditing ? (
                <Input value={profile.ownerName} onChange={(e) => update('ownerName', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.ownerName || '—'}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Category</Label>
              {isEditing ? (
                <Select value={profile.category} onValueChange={(v) => update('category', v)}>
                  <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                  <SelectContent>
                    {BOUTIQUE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <p className="font-medium">{profile.category || '—'}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Subcategory</Label>
              {isEditing ? (
                <Input placeholder="e.g. Sarees, Lehengas" value={profile.subcategory} onChange={(e) => update('subcategory', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.subcategory || '—'}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Email</Label>
              {isEditing ? (
                <Input type="email" value={profile.email} onChange={(e) => update('email', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.email || '—'}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Phone</Label>
              {isEditing ? (
                <Input value={profile.phone} onChange={(e) => update('phone', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.phone || '—'}</p>
              )}
            </div>
            <div className="sm:col-span-2 space-y-1">
              <Label className="text-xs text-muted-foreground">Store Address</Label>
              {isEditing ? (
                <Textarea value={profile.storeAddress} onChange={(e) => update('storeAddress', e.target.value)} className="min-h-[60px]" />
              ) : (
                <p className="font-medium">{profile.storeAddress || '—'}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">City</Label>
              {isEditing ? (
                <Input value={profile.city} onChange={(e) => update('city', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.city || '—'}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">State</Label>
              {isEditing ? (
                <Input value={profile.state} onChange={(e) => update('state', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.state || '—'}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Pincode</Label>
              {isEditing ? (
                <Input value={profile.pincode} onChange={(e) => update('pincode', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.pincode || '—'}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">GST Number</Label>
              {isEditing ? (
                <Input placeholder="GSTIN" value={profile.gstNumber} onChange={(e) => update('gstNumber', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.gstNumber || '—'}</p>
              )}
            </div>
          </div>
        </Section>

        <Separator />

        {/* Pickup Person */}
        <Section title="Pickup Person Details" icon={User}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Pickup Person Name</Label>
              {isEditing ? (
                <Input value={profile.pickupPersonName} onChange={(e) => update('pickupPersonName', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.pickupPersonName || '—'}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Phone</Label>
              {isEditing ? (
                <Input value={profile.pickupPersonPhone} onChange={(e) => update('pickupPersonPhone', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.pickupPersonPhone || '—'}</p>
              )}
            </div>
            <div className="sm:col-span-2 lg:col-span-1 space-y-1">
              <Label className="text-xs text-muted-foreground">Pickup Address</Label>
              {isEditing ? (
                <Input placeholder="If different from store" value={profile.pickupAddress} onChange={(e) => update('pickupAddress', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.pickupAddress || 'Same as store'}</p>
              )}
            </div>
          </div>
        </Section>

        <Separator />

        {/* Bank Details */}
        <Section title="Bank & Payment Details" icon={CreditCard}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Bank Name</Label>
              {isEditing ? (
                <Input value={profile.bankName} onChange={(e) => update('bankName', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.bankName || '—'}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Account Number</Label>
              {isEditing ? (
                <Input value={profile.accountNumber} onChange={(e) => update('accountNumber', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.accountNumber ? `****${profile.accountNumber.slice(-4)}` : '—'}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">IFSC Code</Label>
              {isEditing ? (
                <Input value={profile.ifscCode} onChange={(e) => update('ifscCode', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.ifscCode || '—'}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Account Holder Name</Label>
              {isEditing ? (
                <Input value={profile.accountHolderName} onChange={(e) => update('accountHolderName', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.accountHolderName || '—'}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">UPI ID</Label>
              {isEditing ? (
                <Input placeholder="name@upi" value={profile.upiId} onChange={(e) => update('upiId', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.upiId || '—'}</p>
              )}
            </div>
          </div>
        </Section>

        <Separator />

        {/* Social Links */}
        <Section title="Social Links" icon={Globe}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Instagram className="h-3 w-3" /> Instagram
              </Label>
              {isEditing ? (
                <Input placeholder="@yourboutique" value={profile.instagram} onChange={(e) => update('instagram', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.instagram || '—'}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Facebook className="h-3 w-3" /> Facebook
              </Label>
              {isEditing ? (
                <Input placeholder="facebook.com/yourboutique" value={profile.facebook} onChange={(e) => update('facebook', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.facebook || '—'}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <MessageCircle className="h-3 w-3" /> WhatsApp
              </Label>
              {isEditing ? (
                <Input placeholder="+91 XXXXXXXXXX" value={profile.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.whatsapp || '—'}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Globe className="h-3 w-3" /> Website
              </Label>
              {isEditing ? (
                <Input placeholder="www.yourboutique.com" value={profile.website} onChange={(e) => update('website', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.website || '—'}</p>
              )}
            </div>
          </div>
        </Section>

        <Separator />

        {/* Operating Hours */}
        <Section title="Operating Hours" icon={Clock}>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Operating Days</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(day => (
                  <Badge
                    key={day}
                    variant={profile.operatingDays.includes(day) ? "default" : "outline"}
                    className={`cursor-pointer select-none ${isEditing ? 'hover:opacity-80' : ''} ${profile.operatingDays.includes(day) ? 'bg-brand-orange hover:bg-brand-orange/90' : ''}`}
                    onClick={() => isEditing && toggleDay(day)}
                  >
                    {day.slice(0, 3)}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-xs">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Opening Time</Label>
                {isEditing ? (
                  <Input type="time" value={profile.openingTime} onChange={(e) => update('openingTime', e.target.value)} />
                ) : (
                  <p className="font-medium">{profile.openingTime || '—'}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Closing Time</Label>
                {isEditing ? (
                  <Input type="time" value={profile.closingTime} onChange={(e) => update('closingTime', e.target.value)} />
                ) : (
                  <p className="font-medium">{profile.closingTime || '—'}</p>
                )}
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        {/* Documents */}
        <Section title="Documents & Verification" icon={FileText}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">PAN Number</Label>
              {isEditing ? (
                <Input placeholder="ABCDE1234F" value={profile.panNumber} onChange={(e) => update('panNumber', e.target.value.toUpperCase())} />
              ) : (
                <p className="font-medium">{profile.panNumber ? `${profile.panNumber.slice(0, 2)}****${profile.panNumber.slice(-2)}` : '—'}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Aadhar Number</Label>
              {isEditing ? (
                <Input placeholder="XXXX XXXX XXXX" value={profile.aadharNumber} onChange={(e) => update('aadharNumber', e.target.value)} />
              ) : (
                <p className="font-medium">{profile.aadharNumber ? `****${profile.aadharNumber.slice(-4)}` : '—'}</p>
              )}
            </div>
          </div>
          {isEditing && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <Button variant="outline" size="sm" onClick={() => handleDocUpload('PAN Card')}>
                <Upload className="h-4 w-4 mr-1" /> Upload PAN Card
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDocUpload('Aadhar Card')}>
                <Upload className="h-4 w-4 mr-1" /> Upload Aadhar Card
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDocUpload('GST Certificate')}>
                <Upload className="h-4 w-4 mr-1" /> Upload GST Certificate
              </Button>
            </div>
          )}
        </Section>

        <Separator />

        {/* About Brand */}
        <Section title="About Your Brand" icon={Building2}>
          <div className="space-y-1">
            {isEditing ? (
              <Textarea
                placeholder="Tell your customers about your boutique, your story, specializations..."
                value={profile.aboutBrand}
                onChange={(e) => update('aboutBrand', e.target.value)}
                className="min-h-[100px]"
              />
            ) : (
              <p className="font-medium text-sm">{profile.aboutBrand || 'No description added yet.'}</p>
            )}
          </div>
        </Section>
      </CardContent>
    </Card>
  );
};

export default BoutiqueProfile;
