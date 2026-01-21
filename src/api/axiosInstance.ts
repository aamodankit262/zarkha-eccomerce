import axios from "axios";
import { API_ENDPOINTS } from "./endpoints";
import { toast } from "sonner";

const getUserToken = () => {
  try {
    const auth = localStorage.getItem("zarkha-auth");
    return auth ? JSON.parse(auth)?.state?.token : null;
  } catch {
    return null;
  }
};
const getAffiliateToken = () => {
  try {
    const auth = localStorage.getItem("affiliate-auth");
    console.log(auth, "affiliate-auth")
    return auth ? JSON.parse(auth)?.token : null;
  } catch {
    return null;
  }
};

// console.log(getAffiliateToken, 'affiate token')

const axiosInstance = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
axiosInstance.interceptors.request.use(
  (config) => {
    const url = config.url || "";

    // 👇 Affiliate APIs
    
    if (url.includes("/affiliate")) {
      const affiliateToken = getAffiliateToken();
      if (affiliateToken && config.headers) {
        config.headers.Authorization = `Bearer ${affiliateToken}`;
      }
    }
    // 👇 Normal user APIs
    else {
      const userToken = getUserToken();
      if (userToken && config.headers) {
        config.headers.Authorization = `Bearer ${userToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);


/* ---------------- RESPONSE INTERCEPTOR ---------------- */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    console.error("API Error:", {
      url: requestUrl,
      status,
      message: error.response?.data?.message || error.message,
    });

    //  Handle Unauthorized
    if (status === 401) {
      // Avoid infinite redirect loop
      // localStorage.removeItem("zarkha-auth");

      toast.error(
        error.response?.data?.message || error.message || "Session expired. Please login again."
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
