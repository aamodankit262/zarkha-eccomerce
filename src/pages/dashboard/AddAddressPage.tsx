// Move these outside the Dashboard component, or into separate files
import HeaderOtherPages from "@/components/common/HeaderOtherPages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ArrowLeft, Check } from "lucide-react";
const AddAddressPage = ({ 
  onBack, 
  addressForm, 
  handleInputChange, 
  states, 
  cities, 
  editingAddress, 
  handleSaveAddress 
}) => (
  <div className="min-h-screen bg-[#FAF6F2]">
    <HeaderOtherPages />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {editingAddress ? "Edit Address" : "Add New Address"}
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-8">Deliver To</h3>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="First Name *"
                value={addressForm.firstName}
                onChange={(e) =>
                  handleInputChange("firstName", e.target.value)
                }
              />
              <Input
                placeholder="Last Name *"
                value={addressForm.lastName}
                onChange={(e) =>
                  handleInputChange("lastName", e.target.value)
                }
              />
            </div>

            <Input
              placeholder="Full Address *"
              value={addressForm.address}
              onChange={(e) =>
                handleInputChange("address", e.target.value)
              }
            />

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Pin Code *"
                value={addressForm.pinCode}
                onChange={(e) =>
                  handleInputChange("pinCode", e.target.value)
                }
              />
              <Select
                value={addressForm.country}
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
                value={addressForm.state}
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
                value={addressForm.city}
                onValueChange={(v) =>
                  handleInputChange("city", v)
                }
                disabled={!addressForm.state}
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
                      addressForm.addressType === type
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
            <div className="flex gap-3">
              <Button onClick={handleSaveAddress} className="flex-1">
                <Check className="w-4 h-4 mr-2" />
                Save
              </Button>
              {/* <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="flex-1"
              >
                Cancel
              </Button> */}
            </div>
          </div>
        </div>
      </div>
  </div>
);