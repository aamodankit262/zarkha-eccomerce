import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  pinCode: string;
  country: string;
  state: string;
  city: string;
  addressType: 'home' | 'office' | 'other';
  isDefault: boolean;
  fullAddress?: string;
}

interface AddressBookProps {
  addresses: Address[];
  onAddNew: () => void;
  onEdit: (address: Address) => void;
  onRemove: (addressId: string) => void;
}

const AddressBook = ({ addresses, onAddNew, onEdit, onRemove }: AddressBookProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 border-b">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
          My Address Book
        </h1>
        <Button
          onClick={onAddNew}
          variant="outline"
          className="border-orange-500 text-orange-500 hover:bg-orange-50"
        >
          + Add New Address
        </Button>
      </div>

      {/* Address List */}
      <div className="p-4 sm:p-6">
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No addresses saved yet</p>
            <Button
              onClick={onAddNew}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Add Your First Address
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {address.firstName} {address.lastName}
                        {address.isDefault && (
                          <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="capitalize font-medium">
                          {address.addressType}
                        </div>
                        <div>
                          {address.fullAddress || 
                            `${address.city}, ${address.state} - ${address.pinCode}`}
                        </div>
                        <div>{address.state}</div>
                        <div>Mobile: {address.phone}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemove(address.id)}
                      className="text-gray-600 border-gray-300 hover:bg-gray-50"
                    >
                      Remove
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onEdit(address)}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressBook;