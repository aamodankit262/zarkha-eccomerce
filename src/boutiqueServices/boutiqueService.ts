import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

/* -------- Dashboard Stats -------- */
export interface BoutiqueDashboardStatsResponse {
  success: boolean;
  body: {
    total_orders: number;
    total_commission: number;
    total_sales: number;
    pending_commission: number;
  };
}
export interface BoutiqueProductCategory {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
  commission_percentage?: number;
}
export interface BoutiqueProduct {
  _id: string;
  product_id: string;
  share_link: string;
  name: string;
  images?: any[];
  mrp?: number;
  msp?: number;
  rating?: number;
  earning_per_sale?: number;
  commission_percentage?: number;
}

export interface BoutiqueProductCategoryResponse {
  success: boolean;
  body: BoutiqueProductCategory[];
}
export interface BoutiqueProductResponse {
  success: boolean;
  body: BoutiqueProduct[];
}

export interface BoutiqueProductListParams {
  search?: string;
  category_id?: string;
  subcategory_id?: string;
  min_price?: number;
  max_price?: number;
  stock_status?: string;
  page?: number;
  limit?: number;
  discount?: any;
}
export interface SalesListParams {
  status?: "completed" | "pending";
  period?: string;
  page?: number;
  limit?: number;
}
export interface EarningsListParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  affiliate_id?: string;
}
export interface updateProfilePayload {
  full_name: string;
  phone_number: string;
  affiliate_category_id: string;
  affiliate_category: string;
  bank_name: string;
  ifsc_code: string;
  account_number: string;
  account_holder: string;
  upi_id?: string;
}
export interface profileResponse {
  success: boolean;
  message: string;
  _id: string;
  status: string;
  body: {
    store_name: string;
    owner_name: string;
    category: string;
    subcategory: string;
    email: string;
    phone: string;
    store_address: string;
    city: string;
    state: string;
    pincode: string;
    gst_number: string;
    // Pickup Person
    pickup_person_name: string;
    pickup_phone: string;
    pickup_address: string;
    // Bank Details
    bank_name: string;
    account_number: string;
    ifsc_code: string;
    account_holder_name: string;
    upi_id: string;
    // Social
    instagram: string;
    facebook: string;
    whatsapp: string;
    website: string;
    // Operating
    operating_days: string[];
    opening_time: string;
    closing_time: string;
    // Documents
    pan_number: string;
    aadhaar_number: string;
    aadhaar_card: string;
    // Brand
    brand_logo: string;
    digital_signature: string;
    about_brand: string;

    _id: string;
    status: string;
    created_at: string;
  }
}
export interface earningListResponse {
  success: boolean;
  message?: string;
  data: [
    {
      _id: string,
      affiliate_id: string,
      full_name: string,
      email: string,
      status: string,
      total_earnings: number,
      withdrawn_amount: number,
      pending_balance: number,
      orders_count: number,
      total_commission_from_orders: number
    }
  ]
  pagination: {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
  }
}
export interface CouponListParams {
  affiliate_id?: string;
}

const buildQuery = (params: Record<string, any>) =>
  new URLSearchParams(
    Object.entries(params).reduce((acc, [k, v]) => {
      if (v !== undefined && v !== null) acc[k] = String(v);
      return acc;
    }, {} as Record<string, string>)
  ).toString();

export const boutiqueService = {
  /* ---------- Dashboard Stats ---------- */
  dashboardStats: async () => {
    return apiClient.post<BoutiqueDashboardStatsResponse>(
      API_ENDPOINTS.BOUTIQUE.DASHBOARD_STATS
    );
  },
  productCategoryList: async () => {
    return apiClient.post<BoutiqueProductCategoryResponse>(
      API_ENDPOINTS.BOUTIQUE.PRODUCT_CATEGORY_LIST
    );
  },
  productList: async (params: BoutiqueProductListParams) => {
    const payload = {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      ...(params.search && { search: params.search }),
      ...(params.category_id && params.category_id !== "all" && { category_id: params.category_id }),
      ...(params.subcategory_id && { subcategory_id: params.subcategory_id }),
      ...(params.min_price !== undefined && { min_price: params.min_price }),
      ...(params.max_price !== undefined && { max_price: params.max_price }),
      ...(params.stock_status && { stock_status: params.stock_status }),
      ...(params.discount && { discount: params.discount }),
    };
    console.log("Requesting products with payload:", payload);
    return apiClient.post<BoutiqueProductResponse>(
      API_ENDPOINTS.BOUTIQUE.PRODUCT_LIST,
      payload
    );
  },

  boutiqueCategoryList: async () => {
    return apiClient.get(API_ENDPOINTS.BOUTIQUE.CategoryList);
  },

  getProfile: async () => {
    return apiClient.get<profileResponse>(API_ENDPOINTS.BOUTIQUE.PROFILE);
  },

  updateProfile: async (data: updateProfilePayload) => {
    return apiClient.put(API_ENDPOINTS.BOUTIQUE.UPDATE_PROFILE, data)
  },
  getSalesList: async (params?: SalesListParams) => {
    const query = buildQuery({
      status: params?.status ?? "completed",
      period: params?.period ?? "this_month",
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
    })
    return apiClient.get(`${API_ENDPOINTS.BOUTIQUE.SALES_LIST}?${query}`)
  },
  getEarningsList: async () => {
    return apiClient.get(`${API_ENDPOINTS.BOUTIQUE.EARNINGS_LIST}`);
  },

  getCouponList: async (id?: string) => {
    return apiClient.get(`${API_ENDPOINTS.BOUTIQUE.COUPON_LIST}?affiliate_id=${id}`);
  },
  getSetPrice: async (productId: string, price: number) => {
    const payload = {
      product_id: productId,
      selling_price: price
    }
    return apiClient.post(API_ENDPOINTS.BOUTIQUE.SET_PRICE, payload);
  }
};
