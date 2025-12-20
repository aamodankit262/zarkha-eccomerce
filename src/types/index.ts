// Core E-commerce Types
export interface Product {
  _id: string;
  images: string[];
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: number;
  reviews: number;
  color?: string[];
  category?: string;
  size?: string[];
  mrp?: number;
  msp?: number;
  product_price?: number;
  // data : any
  body?: any;
  data?: any;
  isNew?: number
  isBestSeller?: number
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

export interface CartItem {
  id: string;
  name: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
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