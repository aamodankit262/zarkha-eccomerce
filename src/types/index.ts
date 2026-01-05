// Core E-commerce Types
export interface Product {
  _id: string;
  images: string[];
  name: string;
  price: any;
  originalPrice?: any;
  discount?: any;
  rating: number;
  reviews: number;
  color?: string[];
  category?: string;
  createdAt?: string;
  size?: string[];
  mrp?: number;
  msp?: number;
  product_price?: number;
  // data : any
  body?: any;
  data?: any;
  isNew?: number
  isBestSeller?: number
  variants?: any
}
export type SortOption =
  | "bestseller"
  | "price_asc"
  | "price_desc"
  | "newest"
  | "rating";

export interface ProductListPayload {
  category_id?: string;
  subcategory_id?: string;
  discount?: string;
  price?: string;
  size?: string;
  color?: string;
  fabric_id?: string;
  page?: number;
  limit?: number;
}
export interface AddressPayload {
  user_id: string;
  first_name: string;
  last_name: string;
  address: string;
  pin_code: string;
  country: string;
  state: string;
  city: string;
  home?: string;
  office?: string;
  other?: string;
  is_default?: boolean;
}

export interface UpdateAddressPayload extends AddressPayload {
  address_id?: string;
  id?: string;
}

export interface SavedAddress {
   _id: string;
  user_id?: string;
  first_name?: string;
  last_name: string;
  address: string;
  pinCode: string;
  city?: string;
  state?: string;
  country?: string;
  addressType: "Home" | "Office" | "Other";
  is_default?: boolean;
  home?: boolean;
  office?: boolean;
  other?: boolean;
}
export interface CartItem {
  product_id: string;
  variant_id: string;
  quantity: number;
  product_title?: string;
  product_image?: string;
  price: number;
  discount_price?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}