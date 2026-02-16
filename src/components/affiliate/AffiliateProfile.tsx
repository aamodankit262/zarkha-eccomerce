import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Tag,
  Edit2,
  Save,
  X,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { affiliateService } from "@/services/affiliateService";
import GlobalLoader from "../GlobalLoader";
import { useApi } from "@/hooks/useApi";
import dayjs from "dayjs";

const AffiliateProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  /** ---------------- API hooks ---------------- */
  const { data, request: fetchProfile, loading } = useApi(
    affiliateService.getProfile
  );

  const {
    request: updateProfile,
    loading: updating,
  } = useApi(affiliateService.updateProfile);

  const {
    request: fetchCategory,
    data: categoryData,
  } = useApi(affiliateService.affiliateCatgeoryList);

  /** ---------------- Derived data ---------------- */
  const affiliate = data?.body;
  const accountDetails = affiliate?.account_details;
  const personalInfo = affiliate?.personal_information;
  const paymentDetails = affiliate?.payment_details;
  const affiliateCategories = categoryData?.body;

  /** ---------------- Fetch on mount ---------------- */
  useEffect(() => {
    fetchProfile();
    fetchCategory();
  }, []);

  /** ---------------- Form state ---------------- */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    bankName: "",
    ifsc_code: "",
    account_number: "",
    account_holder: "",
    upi_id: "",
  });

  /** ---------------- Populate form ---------------- */
  useEffect(() => {
    if (!personalInfo) return;

    setFormData({
      name: personalInfo.full_name || "",
      email: personalInfo.email || "",
      phone: personalInfo.phone_number || "",
      category: personalInfo.affiliate_category_id || "",
      bankName: paymentDetails?.bank_name || "",
      ifsc_code: paymentDetails?.ifsc_code || "",
      account_number: paymentDetails?.account_number || "",
      account_holder:
        paymentDetails?.account_holder || personalInfo.full_name || "",
      upi_id: paymentDetails?.upi_id || "",
    });
  }, [personalInfo, paymentDetails]);

  /** ---------------- Save handler ---------------- */
  const handleSave = async () => {
    try {
      const payload = {
        full_name: formData.name,
        phone_number: formData.phone,
        affiliate_category_id: formData.category,
        affiliate_category:
          affiliateCategories?.find((c: any) => c._id === formData.category)
            ?.category_name || "",
        bank_name: formData.bankName,
        ifsc_code: formData.ifsc_code,
        account_number: formData.account_number,
        account_holder: formData.account_holder || formData.name,
        upi_id: formData.upi_id,
      };

      await updateProfile(payload);

      toast.success("Profile updated successfully");
      setIsEditing(false);
      fetchProfile(); // refresh
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to update profile"
      );
    }
  };

  /** ---------------- Loading ---------------- */
  if (loading) return <GlobalLoader />;

  /** ---------------- Bank display ---------------- */
  const bankDetails = {
    bankName: paymentDetails?.bank_name || "Not added",
    accountNumber: paymentDetails?.account_number || "Not added",
    ifscCode: paymentDetails?.ifsc_code || "Not added",
    upiId: paymentDetails?.upi_id || "Not added",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Your Profile</h2>
        <p className="text-muted-foreground">
          Manage your affiliate account settings
        </p>
      </div>

      {/* Personal Info */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Personal Information</CardTitle>

          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-2" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>

              <Button size="sm" onClick={handleSave} disabled={updating}>
                <Save className="h-4 w-4 mr-2" />
                {updating ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Full Name"
            icon={<User className="h-4 w-4" />}
            editing={isEditing}
            value={formData.name}
            display={personalInfo?.full_name}
            onChange={(v) => setFormData({ ...formData, name: v })}
          />

          <Field
            label="Email"
            icon={<Mail className="h-4 w-4" />}
            editing={isEditing}
            value={formData.email}
            display={personalInfo?.email}
            onChange={(v) => setFormData({ ...formData, email: v })}
          />

          <Field
            label="Phone"
            icon={<Phone className="h-4 w-4" />}
            editing={isEditing}
            value={formData.phone}
            display={personalInfo?.phone_number}
            onChange={(v) => setFormData({ ...formData, phone: v })}
          />

          {/* Category */}
          <div className="space-y-2">
            <Label>Affiliate Category</Label>
            {isEditing ? (
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {affiliateCategories?.map((cat: any) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge>{personalInfo?.affiliate_category}</Badge>
            )}
          </div>
          {/* Account Info */}
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-foreground mb-4">Account Details</h3>
            <div className="grid sm:grid-cols-1 gap-4">
              {/* <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <Tag className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Referral Code</p>
                  <p className="font-mono font-bold text-primary">{personalInfo?.referralCode}</p>
                </div>
              </div> */}
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">{dayjs(accountDetails?.member_since).format("DD/MM/YYYY")}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>

        <CardContent className="grid sm:grid-cols-2 gap-4">
          <BankField
            label="Bank Name"
            editing={isEditing}
            value={formData.bankName}
            display={bankDetails.bankName}
            onChange={(v) => setFormData({ ...formData, bankName: v })}
          />

          <BankField
            label="Account Number"
            editing={isEditing}
            value={formData.account_number}
            display={bankDetails.accountNumber}
            onChange={(v) => setFormData({ ...formData, account_number: v })}
          />

          <BankField
            label="IFSC Code"
            editing={isEditing}
            value={formData.ifsc_code}
            display={bankDetails.ifscCode}
            onChange={(v) => setFormData({ ...formData, ifsc_code: v })}
          />

          <BankField
            label="UPI ID"
            editing={isEditing}
            value={formData.upi_id}
            display={bankDetails.upiId}
            onChange={(v) => setFormData({ ...formData, upi_id: v })}
          />
        </CardContent>
      </Card>
      {/* <Card className="border-destructive/50">
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
      </Card> */}
    </div>
  );
};

export default AffiliateProfile;

/** ---------- Reusable Components ---------- */

const Field = ({ label, icon, editing, value, display, onChange }: any) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    {editing ? (
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    ) : (
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-medium">{display}</span>
      </div>
    )}
  </div>
);

const BankField = ({ label, editing, value, display, onChange }: any) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    {editing ? (
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    ) : (
      <p className="font-medium">{display}</p>
    )}
  </div>
);