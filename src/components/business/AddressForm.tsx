import { useState } from "react";
import { ArrowLeft, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  pinCode: string;
  country: string;
  state: string;
  city: string;
  addressType: 'home' | 'office' | 'other';
  isDefault: boolean;
}

interface AddressFormProps {
  address?: Address;
  onBack: () => void;
  onSave: (address: Address) => void;
}

const AddressForm = ({ address, onBack, onSave }: AddressFormProps) => {
  const [formData, setFormData] = useState<Address>({
    firstName: address?.firstName || '',
    lastName: address?.lastName || '',
    phone: address?.phone || '',
    pinCode: address?.pinCode || '',
    country: address?.country || '',
    state: address?.state || '',
    city: address?.city || '',
    addressType: address?.addressType || 'home',
    isDefault: address?.isDefault || false,
    ...address
  });

  const handleInputChange = (field: keyof Address, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 sm:p-6 border-b">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
          {address ? 'Edit Address' : 'Add Address'}
        </h1>
      </div>

      {/* Form */}
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Deliver To</h2>
          
          {/* Reduced form fields - Essential only */}
          <div className="mb-4">
            <div className="relative">
              <Input
                placeholder="Full Name"
                value={`${formData.firstName} ${formData.lastName}`.trim()}
                onChange={(e) => {
                  const [firstName, ...lastNameParts] = e.target.value.split(' ');
                  handleInputChange('firstName', firstName || '');
                  handleInputChange('lastName', lastNameParts.join(' '));
                }}
                className="pl-10"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Input
                placeholder="Mobile Number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="pl-10"
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Current Location Auto-fill */}
          <div className="mb-4">
            <Button 
              type="button"
              variant="outline"
              className="w-full mb-3 border-dashed"
              onClick={() => {
                // Auto-fill location (mock implementation)
                handleInputChange('pinCode', '400001');
                handleInputChange('city', 'Mumbai');
                handleInputChange('state', 'Maharashtra');
              }}
            >
              📍 Use Current Location (Auto-fill)
            </Button>
          </div>

          <div className="mb-4">
            <Input
              placeholder="Complete Address"
              value={`${formData.city}, ${formData.state}`.replace(', ', ', ').replace(/^, |, $/, '')}
              onChange={(e) => {
                // Allow manual editing of address
                const parts = e.target.value.split(', ');
                if (parts.length >= 2) {
                  handleInputChange('city', parts[0] || '');
                  handleInputChange('state', parts[1] || '');
                }
              }}
            />
          </div>

          <div className="mb-6">
            <div className="relative">
              <Input
                placeholder="Pincode"
                value={formData.pinCode}
                onChange={(e) => handleInputChange('pinCode', e.target.value)}
                className="pl-10"
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Address Type */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Save This Address As (Optional)
            </h3>
            <div className="flex gap-2">
              {[
                { value: 'home', label: 'Home' },
                { value: 'office', label: 'Office' },
                { value: 'other', label: 'Other' }
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleInputChange('addressType', type.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    formData.addressType === type.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save as Default */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="default"
                checked={formData.isDefault}
                onCheckedChange={(checked) => handleInputChange('isDefault', checked as boolean)}
              />
              <label
                htmlFor="default"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Save As Default
              </label>
            </div>
            <span className="text-sm text-gray-600">Yes</span>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;