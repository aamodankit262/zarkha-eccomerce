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

  affiliateCatgeoryList : async() => {
    return apiClient.get(API_ENDPOINTS.AFFILIATE.CategoryList);
  },
  getProfile : async() => {
    return apiClient.get<any>(API_ENDPOINTS.AFFILIATE.PROFILE);
  }

};
