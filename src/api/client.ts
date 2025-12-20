import axiosInstance from "./axiosInstance";
import { AxiosRequestConfig, AxiosResponse } from "axios";

export const apiClient = {
  get: async <T, P = undefined>(
    url: string,
    params?: P,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const res: AxiosResponse<T> = await axiosInstance.get(url, {
      params,
      ...config,
    });
    return res.data;
  },

  post: async <T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const res: AxiosResponse<T> = await axiosInstance.post(url, data, config);
    return res.data;
  },

  put: async <T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const res: AxiosResponse<T> = await axiosInstance.put(url, data, config);
    return res.data;
  },

  del: async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const res: AxiosResponse<T> = await axiosInstance.delete(url, config);
    return res.data;
  },
};
