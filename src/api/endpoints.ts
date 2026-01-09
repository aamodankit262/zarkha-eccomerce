export const NO_IMAGE = "/assets/no_image.jpg"
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
    UPDATE: "/web/products/cart/update",
    REMOVE: "/web/products/cart/remove",
  },
  ORDER: {
    CREATE: "/orders",
    HISTORY: "/orders/history",
  },
  USER: {
    PROFILE: "/user/profile",
  },
  ADDRESS: {
    CREATE: "/web/address/create",
    EDIT: "/web/address/update",
    VIEW: "/web/address/view",
    LIST: "/web/address/list",
    DELETE: "/web/address/delete",
  },
  LIST: {
    STATES: "/web/list/states",
    CITY: "/web/list/cities",
  },
  COUPON: {
    LIST: "/web/coupon/list",
    APPLY: "/web/coupon/add",
    REMOVE: "/web/coupon/remove",
  },
  CMS : "/web/user/cms/get",
  CONTACT_US : "/web/contact-us"
};
