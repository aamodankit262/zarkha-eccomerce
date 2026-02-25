import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Store, User, MapPin, CreditCard, FileText, Image, Globe,
  Instagram, Facebook, MessageCircle, Pencil, Save, X, Phone, Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useReseller } from "@/contexts/contexts/ResellerContext";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface ProfileData {
  storeName: string; ownerName: string; email: string; phone: string;
  storeAddress: string; city: string; state: string; pincode: string; gstNumber: string;
  pickupPersonName: string; pickupPersonPhone: string; pickupAddress: string;
  bankName: string; accountNumber: string; ifscCode: string; accountHolderName: string; upiId: string;
  instagram: string; facebook: string; whatsapp: string; website: string;
  operatingDays: string[]; openingTime: string; closingTime: string;
  panNumber: string; aadharNumber: string; brandLogo: string; digitalSignature: string;
}

const ResellerProfile = () => {
  const { user } = useReseller();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<ProfileData>(() => {
    const stored = localStorage.getItem('reseller_profile');
    return stored ? JSON.parse(stored) : {
      storeName: user?.shopName || '', ownerName: user?.name || '',
      email: user?.email || '', phone: user?.phone || '',
      storeAddress: user?.address || '', city: 'Delhi', state: 'Delhi', pincode: '110001',
      gstNumber: user?.gstNumber || '',
      pickupPersonName: '', pickupPersonPhone: '', pickupAddress: '',
      bankName: '', accountNumber: '', ifscCode: '', accountHolderName: '', upiId: '',
      instagram: '', facebook: '', whatsapp: '', website: '',
      operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      openingTime: '10:00', closingTime: '20:00',
      panNumber: '', aadharNumber: '', brandLogo: '', digitalSignature: ''
    };
  });

  const handleSave = () => {
    localStorage.setItem('reseller_profile', JSON.stringify(profile));
    setIsEditing(false);
    toast({ title: "Profile Saved!", description: "Your reseller profile has been updated." });
  };

  const handleImageUpload = (field: 'brandLogo' | 'digitalSignature') => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => setProfile(prev => ({ ...prev, [field]: ev.target?.result as string }));
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const update = (field: keyof ProfileData, value: string) => setProfile(prev => ({ ...prev, [field]: value }));

  const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2"><div className="p-2 bg-brand-orange/10 rounded-lg"><Icon className="h-4 w-4 text-brand-orange" /></div><h3 className="font-semibold text-base">{title}</h3></div>
      {children}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Reseller Profile</CardTitle>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}><X className="h-4 w-4 mr-1" /> Cancel</Button>
                <Button variant="brand" size="sm" onClick={handleSave}><Save className="h-4 w-4 mr-1" /> Save</Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}><Pencil className="h-4 w-4 mr-1" /> Edit Profile</Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center gap-2">
            <Label className="text-sm text-muted-foreground">Logo</Label>
            <div className={`w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden ${isEditing ? 'cursor-pointer hover:border-brand-orange' : ''}`} onClick={() => isEditing && handleImageUpload('brandLogo')}>
              {profile.brandLogo ? <img src={profile.brandLogo} alt="Logo" className="w-full h-full object-cover" /> : <div className="text-center"><Image className="h-6 w-6 mx-auto text-muted-foreground" /><span className="text-xs text-muted-foreground">Upload</span></div>}
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Label className="text-sm text-muted-foreground">Digital Signature</Label>
            <div className={`w-32 h-16 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden ${isEditing ? 'cursor-pointer hover:border-brand-orange' : ''}`} onClick={() => isEditing && handleImageUpload('digitalSignature')}>
              {profile.digitalSignature ? <img src={profile.digitalSignature} alt="Signature" className="w-full h-full object-contain" /> : <div className="text-center"><FileText className="h-5 w-5 mx-auto text-muted-foreground" /><span className="text-xs text-muted-foreground">Upload</span></div>}
            </div>
          </div>
        </div>

        <Separator />

        <Section title="Store Information" icon={Store}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Store Name', field: 'storeName' as const },
              { label: 'Owner Name', field: 'ownerName' as const },
              { label: 'Email', field: 'email' as const },
              { label: 'Phone', field: 'phone' as const },
              { label: 'City', field: 'city' as const },
              { label: 'State', field: 'state' as const },
              { label: 'Pincode', field: 'pincode' as const },
              { label: 'GST Number', field: 'gstNumber' as const },
            ].map(({ label, field }) => (
              <div key={field} className="space-y-1">
                <Label className="text-xs text-muted-foreground">{label}</Label>
                {isEditing ? <Input value={profile[field] as string} onChange={(e) => update(field, e.target.value)} /> : <p className="font-medium">{(profile[field] as string) || '—'}</p>}
              </div>
            ))}
            <div className="sm:col-span-2 space-y-1">
              <Label className="text-xs text-muted-foreground">Store Address</Label>
              {isEditing ? <Textarea value={profile.storeAddress} onChange={(e) => update('storeAddress', e.target.value)} className="min-h-[60px]" /> : <p className="font-medium">{profile.storeAddress || '—'}</p>}
            </div>
          </div>
        </Section>

        <Separator />

        <Section title="Pickup Person Details" icon={User}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Pickup Person Name', field: 'pickupPersonName' as const },
              { label: 'Phone', field: 'pickupPersonPhone' as const },
              { label: 'Pickup Address', field: 'pickupAddress' as const },
            ].map(({ label, field }) => (
              <div key={field} className="space-y-1">
                <Label className="text-xs text-muted-foreground">{label}</Label>
                {isEditing ? <Input value={profile[field] as string} onChange={(e) => update(field, e.target.value)} /> : <p className="font-medium">{(profile[field] as string) || '—'}</p>}
              </div>
            ))}
          </div>
        </Section>

        <Separator />

        <Section title="Bank & Payment Details" icon={CreditCard}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Bank Name', field: 'bankName' as const },
              { label: 'Account Number', field: 'accountNumber' as const },
              { label: 'IFSC Code', field: 'ifscCode' as const },
              { label: 'Account Holder', field: 'accountHolderName' as const },
              { label: 'UPI ID', field: 'upiId' as const },
            ].map(({ label, field }) => (
              <div key={field} className="space-y-1">
                <Label className="text-xs text-muted-foreground">{label}</Label>
                {isEditing ? <Input value={profile[field] as string} onChange={(e) => update(field, e.target.value)} /> : <p className="font-medium">{field === 'accountNumber' && profile[field] ? `****${(profile[field] as string).slice(-4)}` : (profile[field] as string) || '—'}</p>}
              </div>
            ))}
          </div>
        </Section>

        <Separator />

        <Section title="Social Links" icon={Globe}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Instagram', field: 'instagram' as const, icon: Instagram },
              { label: 'Facebook', field: 'facebook' as const, icon: Facebook },
              { label: 'WhatsApp', field: 'whatsapp' as const, icon: MessageCircle },
              { label: 'Website', field: 'website' as const, icon: Globe },
            ].map(({ label, field, icon: SIcon }) => (
              <div key={field} className="space-y-1">
                <Label className="text-xs text-muted-foreground flex items-center gap-1"><SIcon className="h-3 w-3" /> {label}</Label>
                {isEditing ? <Input value={profile[field] as string} onChange={(e) => update(field, e.target.value)} /> : <p className="font-medium">{(profile[field] as string) || '—'}</p>}
              </div>
            ))}
          </div>
        </Section>

        <Separator />

        <Section title="Operating Hours" icon={Clock}>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => (
                <div key={day} className="flex items-center gap-2">
                  <Checkbox id={`reseller-${day}`} checked={profile.operatingDays.includes(day)} onCheckedChange={() => { if (isEditing) setProfile(prev => ({ ...prev, operatingDays: prev.operatingDays.includes(day) ? prev.operatingDays.filter(d => d !== day) : [...prev.operatingDays, day] })); }} disabled={!isEditing} />
                  <Label htmlFor={`reseller-${day}`} className="text-sm">{day.slice(0, 3)}</Label>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label className="text-xs text-muted-foreground">Opening</Label>{isEditing ? <Input type="time" value={profile.openingTime} onChange={(e) => update('openingTime', e.target.value)} /> : <p className="font-medium">{profile.openingTime}</p>}</div>
              <div className="space-y-1"><Label className="text-xs text-muted-foreground">Closing</Label>{isEditing ? <Input type="time" value={profile.closingTime} onChange={(e) => update('closingTime', e.target.value)} /> : <p className="font-medium">{profile.closingTime}</p>}</div>
            </div>
          </div>
        </Section>

        <Separator />

        <Section title="Documents" icon={FileText}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1"><Label className="text-xs text-muted-foreground">PAN Number</Label>{isEditing ? <Input value={profile.panNumber} onChange={(e) => update('panNumber', e.target.value)} /> : <p className="font-medium">{profile.panNumber || '—'}</p>}</div>
            <div className="space-y-1"><Label className="text-xs text-muted-foreground">Aadhaar Number</Label>{isEditing ? <Input value={profile.aadharNumber} onChange={(e) => update('aadharNumber', e.target.value)} /> : <p className="font-medium">{profile.aadharNumber ? `****${profile.aadharNumber.slice(-4)}` : '—'}</p>}</div>
          </div>
        </Section>
      </CardContent>
    </Card>
  );
};

export default ResellerProfile;