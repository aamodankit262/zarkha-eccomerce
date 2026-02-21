import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

interface ApiResponse<T> {
  status: boolean;
  data?: T;
  message?: string;
  body?: T;
}
interface Industry {
  id: string;
  industry_name: string;
}
interface Category {
  id: string;
  category_name: string;
  industry_id: string;
}
interface SubCategory {
  id: string;
  subcategory_name?: string;
  category_id?: string;
}

export const industryService = {
  getAll: async (): Promise<Industry[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>(API_ENDPOINTS.INDUSTRY.LIST);
    return response.body;
  },

  getCat: async (industryId: string): Promise<Category[]> => {
    const response = await apiClient.post<ApiResponse<any[]>>(API_ENDPOINTS.INDUSTRY.CATEGORY.LIST, { industry_id: industryId });
    return response.body;
  },

  getCatSubList: async (
    industryId?: string
  ): Promise<any> => {
    const formData = new FormData();

    if (industryId) {
      formData.append("industry_id", industryId);
    } else {
      formData.append("industry_id", "");
    }
    const response = await apiClient.post(
      API_ENDPOINTS.INDUSTRY.CATEGORY.CategorySubCategory,
      formData
    );

    return response;
  },
  getSubCat: async (categoryId: string): Promise<SubCategory[]> => {
    const response = await apiClient.post<ApiResponse<any[]>>(API_ENDPOINTS.INDUSTRY.CATEGORY.SUBCATEGORY.LIST, { category_id: categoryId });
    return response.body;
  }

  // getById: async (id: string): Promise<Product> => {
  //   return await apiClient.get<Product>(API_ENDPOINTS.CATEGORY.DETAIL(id));
  // },
};

