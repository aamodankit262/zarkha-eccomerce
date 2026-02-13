import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

/* -------- Dashboard Stats -------- */
export interface AffiliateDashboardStatsResponse {
  success: boolean;
  body: {
    total_orders: number;
    total_commission: number;
    total_sales: number;
    pending_commission: number;
  };
}
export interface AffiliateProductCategory {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
  commission_percentage?: number;
}
export interface AffiliateProduct {
  _id: string;
  product_id: string;
  share_link: string;
  name: string;
  image?: string;
  mrp?: number;
  msp?: number;
  rating?: number;
  earning_per_sale?: number;
  commission_percentage?: number;
}

export interface AffiliateProductCategoryResponse {
  success: boolean;
  body: AffiliateProductCategory[];
}
export interface AffiliateProductResponse {
  success: boolean;
  body: AffiliateProduct[];
}

export interface AffiliateProductListParams {
  search?: string;
  category_id?: string;
  page?: number;
  limit?: number;
}
export interface SalesListParams {
  status?: string;
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
    personal_information: {
      full_name: string;
      phone_number: string;
      email: string;
      affiliate_category_id: string;
      affiliate_category: string;
    },
    account_details: {
      referral_code: string;
      member_since: string;
    },
    payment_details: {
      bank_name: string;
      ifsc_code: string;
      account_number: string;
      account_holder: string;
      upi_id?: string;
    }
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

export const affiliateService = {
  /* ---------- Dashboard Stats ---------- */
  dashboardStats: async () => {
    return apiClient.post<AffiliateDashboardStatsResponse>(
      API_ENDPOINTS.AFFILIATE.DASHBOARD_STATS
    );
  },
  productCategoryList: async () => {
    return apiClient.post<AffiliateProductCategoryResponse>(
      API_ENDPOINTS.AFFILIATE.PRODUCT_CATEGORY_LIST
    );
  },
  productList: async (params: AffiliateProductListParams) => {
    const formData = new URLSearchParams();
    if (params.search) formData.append("search", params.search);
    if (params.category_id && params.category_id !== "all") {
      formData.append("category_id", params.category_id);
    }
    formData.append("page", String(params.page ?? 1));
    formData.append("limit", String(params.limit ?? 10));
    return apiClient.post<AffiliateProductResponse>(
      API_ENDPOINTS.AFFILIATE.PRODUCT_LIST, formData
    );
  },

  affiliateCatgeoryList: async () => {
    return apiClient.get(API_ENDPOINTS.AFFILIATE.CategoryList);
  },

  getProfile: async () => {
    return apiClient.get<profileResponse>(API_ENDPOINTS.AFFILIATE.PROFILE);
  },

  updateProfile: async (data: updateProfilePayload) => {
    return apiClient.put(API_ENDPOINTS.AFFILIATE.UPDATE_PROFILE, data)
  },
  getSalesList: async (params?: SalesListParams) => {
    return apiClient.post(API_ENDPOINTS.AFFILIATE.SALES_LIST, params)
  },
  getEarningsList: async (params?: EarningsListParams) => {
    const query = buildQuery({
      status: params?.status ?? "active",
      affiliate_id: params?.affiliate_id,
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
    });

    return apiClient.get(`${API_ENDPOINTS.AFFILIATE.EARNINGS_LIST}?${query}`);
  },

  getCouponList: async (id?: string) => {
    return apiClient.get(`${API_ENDPOINTS.AFFILIATE.COUPON_LIST}?affiliate_id=${id}`);
  },
  // getCouponList: async (params?: CouponListParams) => {
  //   return apiClient.get(API_ENDPOINTS.AFFILIATE.COUPON_LIST, {
  //     params: {
  //       affiliate_id: params?.affiliate_id,
  //     },
  //   });
  // },
};
