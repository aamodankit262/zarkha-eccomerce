import axios from "axios";
import { API_ENDPOINTS } from "./endpoints";

const  getToken = () => {
  try {
    const auth = localStorage.getItem("zarkha-auth");
    return auth ? JSON.parse(auth)?.state?.token : null;
  } catch {
    return null;
  }
};

const axiosInstance = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    // 'Content-Type': 'application/json',
  },
});
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });

    return Promise.reject(error);
  }
);

export default axiosInstance;

