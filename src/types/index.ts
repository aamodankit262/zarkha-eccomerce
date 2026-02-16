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
  | "popular"
  | "price_asc"
  | "price_desc"
  | "newest";


export interface ProductListPayload {
  category_id?: string;
  subcategory_id?: string;
  discount?: string;
  price?: string;
  min_price?: string;
  max_price?: string;
  size?: string;
  color?: string;
  fabric_id?: string;
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: SortOption | "";
}
export interface ChartListPayload {
  category_id?: string;
  subcategory_id?: string;
  status?: string;
  page?: number;
  limit?: number;
}
export interface AddressPayload {
  user_id: string;
  first_name: string;
  last_name: string;
  address: string;
  pin_code: string;
  email: string;
  country: string;
  stateId: string;
  cityId: string;
  home?: string;
  office?: string;
  other?: string;
  is_default?: boolean;
}

export interface UpdateAddressPayload extends AddressPayload {
  id?: string;
}
type AddressType = "Home" | "Office" | "Other";

export interface SavedAddress {
  _id: string;
  user_id?: string;
  first_name?: string;
  last_name: string;
  address: string;
  pin_code: string;
  email: string;
  cityId?: {
    _id: string;
    name: string;
  };
  city?: string;
  state?: string;
  stateId?: {
    _id: string;
    name: string;
  };
  country?: string;
  addressType: AddressType;
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
export interface SizeChart {
  _id?: string;
  product?: string;
  measurements: measurements;
  title?: string;
  category?: string;
  subcategory?: string;
  unit?: string;
  status?: string;
  createdAt?: string;
}

export interface measurements {
  _id: string;
  size: string;
  bust: string;
  waist: string;
  hip: string;
  chest: string;
  sleeve: string;
  shoulder: string;
  length: string;
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