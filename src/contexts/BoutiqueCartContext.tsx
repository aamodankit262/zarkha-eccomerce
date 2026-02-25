import { AddToCartPayload, boutiqueService, CartRemove, CartUpdate } from '@/boutiqueServices/boutiqueService';
import { logger } from '@/helper/logger';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export interface BoutiqueCartItem {
  id?: string;
  name?: string;
  image?: string;
  category?: string;
  adminPrice?: number;
  mrp: number;
  discount: number;
  quantity: number;
  sellingPrice?: number;
  stock: number;
  itemCodeId: string;
  profit: number;
  size?: string;
}

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

interface Address {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface BoutiqueCartContextType {
  items: BoutiqueCartItem[];
  customerInfo: CustomerInfo;
  shippingAddress: Address;
  billingAddress: Address;
  sameAsShipping: boolean;
  addItem: (payload: {
    productId: string;
    variantId: string;
    size: string;
    quantity?: number;
  }) => Promise<void>;
  // addItem: (item: Omit<BoutiqueCartItem, 'quantity' | 'sellingPrice'>) => void;
  updateQuantity: (
    productId: string,
    itemId: string,
    quantity: number,
  ) => void;
  updateSellingPrice: (id: string, price: number) => void;
  removeItem: (
    productId: string,
    itemId: string,
    clear: boolean,
  ) => void;
  clearCart: (clear:boolean) => void;
  setCustomerInfo: (info: CustomerInfo) => void;
  setShippingAddress: (address: Address) => void;
  setBillingAddress: (address: Address) => void;
  setSameAsShipping: (same: boolean) => void;
  getTotalItems: () => number;
  getTotalCost: () => number;
  getExpectedRevenue: () => number;
  getExpectedProfit: () => number;
  fetchCart: (id?: string) => Promise<void>;

  totalPrice: number
}

const BoutiqueCartContext = createContext<BoutiqueCartContextType | undefined>(undefined);

export const useBoutiqueCart = () => {
  const context = useContext(BoutiqueCartContext);
  if (!context) {
    throw new Error('useBoutiqueCart must be used within a BoutiqueCartProvider');
  }
  return context;
};

export const BoutiqueCartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: ''
  });
  const [shippingAddress, setShippingAddress] = useState<Address>({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [billingAddress, setBillingAddress] = useState<Address>({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const fetchCart = async (id?: string) => {
    try {
      const cart = await boutiqueService.getCart(id);
      setItems(cart?.body?.items || []);
      setTotalPrice(cart?.body?.total_price || 0);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  const addItem = async ({
    productId,
    variantId,
    size,
    quantity = 1,
  }) => {
    try {
      const res = await boutiqueService.addToCart({
        product_id: productId,
        item_id: variantId,
        size: size || '',
        quantity,
      });
      if (res.success) {
        // setItems(prev => [...prev, item]);
        fetchCart();
        // setItems(prev => [...prev, {...item, quantity: res?.body?.quantity || 1}]);
      }
    } catch (err: any) {
      logger.error("Add to cart failed", err);
      toast.error(err?.response?.data?.message || err?.message || "Add to cart failed");
    }
  };
  // const addItem = (item: Omit<BoutiqueCartItem, 'quantity' | 'sellingPrice'>) => {
  //   const existing = items.find(i => i.id === item.id);
  //   if (existing) {
  //     updateQuantity(item.id, existing.quantity + 1);
  //   } else {
  //     setItems(prev => [...prev, { ...item, quantity: 1, sellingPrice: 0 }]);
  //   }
  // };

  const updateQuantity = async (productId: string, itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, itemId, false);
      return;
    }

    try {
      const payload: CartUpdate = {
        product_id: productId,
        item_id: itemId,
        quantity
      }
      const res = await boutiqueService.cartUpdate(payload)
      logger.log(res, 'updateCart');
      setItems(prev => prev.map(item =>
        item.product_id === productId
          && item.itemCodeId === itemId
          ? { ...item, quantity }
          : item
      ));
      await fetchCart();
    } catch (error) {
      logger.error('update cart faile', error.response.data)
    }
  };

  const updateSellingPrice = (id: string, price: number) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, sellingPrice: price } : item
    ));
  };

  const removeItem = async (productId: string, itemId: string, clear?: false) => {
    // setItems(prev => prev.filter(item => item.product_id !== productId));
    try {
      const payload: CartRemove = {
        product_id: productId,
        item_id: itemId,
        clear,
      }
      const res = await boutiqueService.cartRemove(payload)
      logger.log(res, 'CartRemove');
      setItems(prev => prev.filter(item =>
        !(
          item.product_id === productId &&
          item.item_id === itemId
        )
      ));
      await fetchCart();
    } catch (error) {
      logger.error('update cart faile', error.response.data)
    }
  };

  const clearCart = async (clear = true) => {

    try {
      const payload: CartRemove = {
        clear,
      }
      const res:any = await boutiqueService.cartRemove(payload)
      // logger.log(res, 'Cartclear');
      toast.success(res?.message|| "Cart clear Successfully")
      setItems([]);
      setCustomerInfo({ name: '', phone: '', email: '' });
      setShippingAddress({ name: '', phone: '', address: '', city: '', state: '', pincode: '' });
      setBillingAddress({ name: '', phone: '', address: '', city: '', state: '', pincode: '' });
      setSameAsShipping(true);
      await fetchCart();
    } catch (err) {
      // logger.error('update cart faile', error)
      toast.error(err?.response?.data?.message || err?.message || "Add to cart failed");

    }
  };

  const getTotalItems = () => items.reduce((total, item) => total + item.quantity, 0);
  const getTotalCost = () => items.reduce((total, item) => total + (item.adminPrice * item.quantity), 0);
  const getExpectedRevenue = () => items.reduce((total, item) => total + (item.sellingPrice * item.quantity), 0);
  const getExpectedProfit = () => items.reduce((total, item) => total + ((item.sellingPrice - item.adminPrice) * item.quantity), 0);

  return (
    <BoutiqueCartContext.Provider value={{
      items,
      totalPrice,
      fetchCart,
      customerInfo,
      shippingAddress,
      billingAddress,
      sameAsShipping,
      addItem,
      updateQuantity,
      updateSellingPrice,
      removeItem,
      clearCart,
      setCustomerInfo,
      setShippingAddress,
      setBillingAddress,
      setSameAsShipping,
      getTotalItems,
      getTotalCost,
      getExpectedRevenue,
      getExpectedProfit
    }}>
      {children}
    </BoutiqueCartContext.Provider>
  );
};
