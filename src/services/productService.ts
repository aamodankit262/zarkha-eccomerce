import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { ChartListPayload, Product, ProductListPayload, SizeChart } from "@/types";
// import { Value } from "@radix-ui/react-select";
interface ApiResponse<T> {
  success: boolean;
  message: string;
  body?: T;
  total_pages: number;
  filtered_by: object
}


export const productService = {
  getAll: async (
    payload: ProductListPayload
  ): Promise<ApiResponse<Product[]>> => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        formData.append(key, String(value));
      }
    })
    // if (!payload.page) formData.append("page", "1");
    // if (!payload.limit) formData.append("limit", "30");
    const res = await apiClient.post<ApiResponse<Product[]>>(API_ENDPOINTS.PRODUCTS.LIST, formData);
    return res as any;
  },
  getSizeChartList: async (
    payload: ChartListPayload
  ): Promise<ApiResponse<SizeChart[]>> => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        formData.append(key, String(value));
      }
    })
    const res = await apiClient.post<ApiResponse<SizeChart[]>>(API_ENDPOINTS.SIZE.LIST, formData);
    return res as any;
  },

  getById: async (id: string, itemId?: string): Promise<Product> => {
    return await apiClient.post<Product>(API_ENDPOINTS.PRODUCTS.DETAIL, { product_id: id, item_id: itemId });
  },
};
