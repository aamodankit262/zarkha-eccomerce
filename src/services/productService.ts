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

  getById: async ({
    productId,
    itemId,
    affiliateId,
  }: {
    productId: string;
    itemId?: string;
    affiliateId?: string;
  }): Promise<Product> => {
    return await apiClient.post<Product>(
      API_ENDPOINTS.PRODUCTS.DETAIL,
      {
        product_id: productId,
        item_id: itemId,
        affiliate_id: affiliateId,
      }
    );
  },
 ratingForm: async (payload: FormData) => {
    const res = await apiClient.post(
      API_ENDPOINTS.PRODUCTS.SUBMIT,
      payload
    );
    return res;
  }
};
