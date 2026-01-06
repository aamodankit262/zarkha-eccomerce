import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Tag, Calendar, Edit2, Save, X, CreditCard, Building2 } from "lucide-react";
import { useAffiliate } from "@/contexts/AffiliateContext";
import { toast } from "sonner";

const AffiliateProfile = () => {
  const { affiliate } = useAffiliate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: affiliate?.name || "",
    email: affiliate?.email || "",
    phone: affiliate?.phone || "",
    category: affiliate?.category || "",
  });

  const categories = [
    "Fashion Influencer",
    "Lifestyle Blogger",
    "Social Media Creator",
    "YouTube Reviewer",
    "Website Owner",
    "Email Marketer",
    "Other"
  ];

  const handleSave = () => {
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const bankDetails = {
    accountName: affiliate?.name || "",
    bankName: "HDFC Bank",
    accountNumber: "•••• •••• •••• 4521",
    ifscCode: "HDFC0001234",
    upiId: "affiliate@upi"
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Profile</h2>
          <p className="text-muted-foreground">Manage your affiliate account settings</p>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} className="bg-primary hover:bg-primary/90">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <User className="h-12 w-12 text-primary" />
            </div>
            <div className="flex-1 grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  ) : (
                    <span className="font-medium">{affiliate?.name}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    <span className="font-medium">{affiliate?.email}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  ) : (
                    <span className="font-medium">{affiliate?.phone}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Affiliate Category</Label>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="secondary">{affiliate?.category}</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-foreground mb-4">Account Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <Tag className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Referral Code</p>
                  <p className="font-mono font-bold text-primary">{affiliate?.referralCode}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">{affiliate?.joinDate}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </CardTitle>
            <Button variant="outline" size="sm">
              <Edit2 className="h-4 w-4 mr-2" />
              Update
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Bank Name</p>
                <p className="font-medium">{bankDetails.bankName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Account Number</p>
                <p className="font-medium font-mono">{bankDetails.accountNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
              <span className="text-muted-foreground font-mono text-sm">IFSC</span>
              <div>
                <p className="text-sm text-muted-foreground">IFSC Code</p>
                <p className="font-medium font-mono">{bankDetails.ifscCode}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
              <span className="text-muted-foreground">@</span>
              <div>
                <p className="text-sm text-muted-foreground">UPI ID</p>
                <p className="font-medium">{bankDetails.upiId}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">Deactivate Account</p>
              <p className="text-sm text-muted-foreground">
                Temporarily disable your affiliate account. You can reactivate it anytime.
              </p>
            </div>
            <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
              Deactivate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateProfile;
