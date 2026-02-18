import axios from "axios";
import { API_ENDPOINTS } from "./endpoints";
import { toast } from "sonner";

/* ---------------- TOKEN HELPERS ---------------- */

const getToken = (key: string, path?: string) => {
  try {
    const auth = localStorage.getItem(key);
    console.log(`Retrieving token for ${key}:`, auth);
    if (!auth) return null;
     const parsed = typeof auth === "string" && auth.startsWith("{") ? JSON.parse(auth) : auth;
    // const parsed = JSON.parse(auth); 

    console.log(`Parsed token for ${key}:`, parsed);
    // user token is nested differently
    if (key === "zarkha-auth") return parsed?.state?.token;
    // if(key === "boutique_auth_token") return auth; 

    return parsed?.token || parsed; // fallback to raw value if not nested
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};
console.log("Tokens:", {
  "zarkha-auth": getToken("zarkha-auth"),
  "affiliate-auth": getToken("affiliate-auth"),
  "boutique_auth_token": getToken("boutique_auth_token"),
});
const clearAllAuth = () => {
  localStorage.removeItem("zarkha-auth");
  localStorage.removeItem("affiliate-auth");
  localStorage.removeItem("boutique_auth_token");
};

/* ---------------- AXIOS INSTANCE ---------------- */

const axiosInstance = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: 10000,
  headers: { Accept: "application/json" },
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */

axiosInstance.interceptors.request.use(
  (config) => {
    const url = config.url || "";

    let token: string | null = null;

    if (url.includes("/affiliate")) {
      token = getToken("affiliate-auth");
    } else if (url.includes("/boutique")) {
      token = getToken("boutique_auth_token");
    } else {
      token = getToken("zarkha-auth");
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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
    const message =
      error.response?.data?.message ||
      error.message ||
      "An error occurred. Please try again.";

    console.error("API Error:", {
      url: error.config?.url,
      status,
      message,
    });

    /* -------- Handle Unauthorized -------- */
    if (status === 401 || message.toLowerCase().includes("unauthor")) {
      clearAllAuth();

      toast.error(
        message || "Session expired. Please login again."
      );

      // Optional: redirect to login page
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
