export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  HOME: "/web/home",
  AUTH: {
    SEND_OTP: "/web/auth/send-otp",
    VERIFY_OTP: "/web/auth/verify-otp",
  },
  INDUSTRY: {
    LIST: "/web/list/industry",
    CATEGORY: {
      LIST: "/web/list/category",
      SUBCATEGORY: {
        LIST: "/web/list/subcategory",
      }
    }
    // LIST: 
    // DETAIL: (id: string | number) => `/web/industry/${id}`,
  },
  PRODUCTS: {
    LIST: "/web/products",
    RARTING: "/web/products/ratings",
    DETAIL: "/web/products/details",
  },
  CART: {
    GET: "/web/products/cart",
    ADD: "/web/products/cart/add",
    REMOVE: "/web/products/cart/remove",
  },
  ORDER: {
    CREATE: "/orders",
    HISTORY: "/orders/history",
  },
  USER: {
    PROFILE: "/user/profile",
  },
};
