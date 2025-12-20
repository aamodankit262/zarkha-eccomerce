import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export const HomeService = {
  getHomeData: async (): Promise<any> => {
    return await apiClient.get<any>(API_ENDPOINTS.HOME);
  }
};


