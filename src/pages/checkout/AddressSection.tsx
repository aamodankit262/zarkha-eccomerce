import {
  Plus,
  User,
  MapPin,
  Check,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SavedAddress } from "@/types";

interface AddressFormData {
  firstName: string;
  lastName: string;
  address: string;
  pinCode: string;
  country: string;
  state: string;
  city: string;
  addressType: "Home" | "Office" | "Other";
  isDefault: boolean;
}

interface AddressSectionProps {
  savedAddresses: SavedAddress[];
  selectedAddressId: string | null;
  isEditingAddress: boolean;
  formData: AddressFormData;

  setSelectedAddressId: (id: string) => void;
  handleAddNewAddress: () => void;
  handleEditAddress: (address: SavedAddress) => void;
  handleDeleteAddress: (id: string) => void;
  handleSaveAddress: () => void;
  handleCancelEdit: () => void;
  handleInputChange: (key: keyof AddressFormData, value: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<AddressFormData>>;
  states: any[];
  cities: any[];
}

const AddressSection = ({
  savedAddresses,
  selectedAddressId,
  isEditingAddress,
  formData,
  setSelectedAddressId,
  handleAddNewAddress,
  handleEditAddress,
  handleDeleteAddress,
  handleSaveAddress,
  handleCancelEdit,
  handleInputChange,
  setFormData,
  states,
  cities
}: AddressSectionProps) => {
  return (
    <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold">
          Delivery Address
        </h2>

        {!isEditingAddress && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddNewAddress}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add New
          </Button>
        )}
      </div>

      {/* FORM */}
      {isEditingAddress ? (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              placeholder="First Name *"
              value={formData.firstName}
              onChange={(e) =>
                handleInputChange("firstName", e.target.value)
              }
            />
            <Input
              placeholder="Last Name *"
              value={formData.lastName}
              onChange={(e) =>
                handleInputChange("lastName", e.target.value)
              }
            />
          </div>

          <Input
            placeholder="Full Address *"
            value={formData.address}
            onChange={(e) =>
              handleInputChange("address", e.target.value)
            }
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              placeholder="Pin Code *"
              value={formData.pinCode}
              onChange={(e) =>
                handleInputChange("pinCode", e.target.value)
              }
            />
            <Select
              value={formData.country}
              onValueChange={(v) =>
                handleInputChange("country", v)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="India">India</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Select
              value={formData.state}
              onValueChange={(v) =>
                handleInputChange("state", v)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="State *" />
              </SelectTrigger>
              <SelectContent>
                {states?.map((state) => (
                  <SelectItem key={state._id} value={state._id}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={formData.city}
              onValueChange={(v) =>
                handleInputChange("city", v)
              }
              disabled={!formData.state}
            >
              <SelectTrigger>
                <SelectValue placeholder="City *" />
              </SelectTrigger>
              <SelectContent>
                {cities?.map((city) => (
                  <SelectItem key={city._id} value={city._id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Address Type */}
          <div>
            <p className="text-sm font-medium mb-2">Address Type</p>
            <div className="flex gap-2">
              {(["Home", "Office", "Other"] as const).map((type) => (
                <Button
                  key={type}
                  size="sm"
                  variant={
                    formData.addressType === type
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    handleInputChange("addressType", type)
                  }
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={formData.isDefault}
              onCheckedChange={(v) =>
                setFormData((prev) => ({
                  ...prev,
                  isDefault: v === true,
                }))
              }
            />
            <span className="text-sm">Set as default</span>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSaveAddress} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        /* ADDRESS LIST */
        <div className="space-y-3">
          {savedAddresses.length === 0 ? (
            <div className="text-center py-8 border-dashed border rounded">
              <MapPin className="mx-auto mb-2 text-muted-foreground" />
              <p>No saved addresses</p>
              <Button
                variant="outline"
                className="mt-3"
                onClick={handleAddNewAddress}
              >
                Add Address
              </Button>
            </div>
          ) : (
            savedAddresses?.map((address) => (
              <div
                key={address._id}
                className={`border rounded-lg p-4 cursor-pointer ${selectedAddressId === address._id
                  ? "border-primary bg-primary/5"
                  : ""
                  }`}
                onClick={() =>
                  setSelectedAddressId(address._id)
                }
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      {address.first_name}{" "}
                      {address.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.state}{" "}
                      {address.pin_code}
                    </p>
                  </div>

                  <div
                    className="flex gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        handleEditAddress(address)
                      }
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        handleDeleteAddress(address._id)
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AddressSection;
