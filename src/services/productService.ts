import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { Product, ProductListPayload } from "@/types";
// import { Value } from "@radix-ui/react-select";
interface ApiResponse<T> {
   success: boolean;
  message: string;
  body: T;
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

  getById: async (id: string): Promise<Product> => {
    return await apiClient.post<Product>(API_ENDPOINTS.PRODUCTS.DETAIL, { product_id: id });
  },
};


// export const productService = {
//   // getAll: () => apiClient.get(API_ENDPOINTS.PRODUCTS.LIST),
//    getAll: async (): Promise<Product[]> => {
//     const res= await apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.LIST);
//     return res.data;
//   },
//   getById: (id: string) => apiClient.get(API_ENDPOINTS.PRODUCTS.DETAIL(id)),
// };
