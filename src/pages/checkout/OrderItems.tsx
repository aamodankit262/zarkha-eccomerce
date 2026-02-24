// import { Edit } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { NO_IMAGE } from "@/api/endpoints";

interface OrderItem {
  _id?: string;
  product_id?: string;
  product_title?: string;
  product_image?: string;
  quantity?: number;
  discount_price?: number;
  size?: string;
  color?: {
    name: string;
  };
}

interface OrderItemsProps {
  items: OrderItem[];
  subtotal: number;
  onEditCart?: () => void;
}

const OrderItems = ({
  items,
  subtotal,
  // onEditCart,
}: OrderItemsProps) => {
  const navigate = useNavigate();
  // console.log(items, 'items')
  const goToDetails = (productId: string) => {
    navigate(`/product/${productId}`);
  };
  if (items.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">
          Order Items
        </h2>
        <p className="text-sm text-muted-foreground">No items in the order.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">
          Order Items ({items.length})
        </h2>
        {/* 
        {onEditCart && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditCart}
            className="text-primary hover:text-primary/80"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit Cart
          </Button>
        )} */}
      </div>

      {/* Items */}
      <div className="space-y-4">
        {items?.map((item) => (
          <div
            key={item._id}
            className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0"
          >
            {/* Image */}
            <div className="w-20 h-24 bg-muted rounded-lg overflow-hidden shrink-0"
              onClick={() => goToDetails(item.product_id)}

            >
              <img
                src={item?.product_image || NO_IMAGE}
                alt={item.product_title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground text-sm sm:text-base line-clamp-2">
                {item.product_title}
              </h3>

              <div className="flex flex-wrap gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                {item.size && <span>Size: {item.size}</span>}
                {item.color?.name && (
                  <span>• Color: {item.color.name}</span>
                )}
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Qty: {item.quantity}
                </span>
                <span className="font-semibold text-foreground">
                  ₹
                  {(item.discount_price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subtotal */}
      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Subtotal ({items.length} items)
        </span>
        <span className="font-semibold text-foreground">
          ₹{subtotal.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default OrderItems;
