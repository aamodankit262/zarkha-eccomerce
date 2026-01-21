export const NO_IMAGE = "/assets/no_image.jpg"
export const logoImage = "/assets/logo.png"
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
      CategorySubCategory: "/web/list/categories-with-subcategories",
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
  WISHLIST: {
    ADD: "/web/wishlist/add",
    REMOVE: "/web/wishlist/remove",
    LIST: "/web/wishlist/list",
  },
  CART: {
    GET: "/web/products/cart",
    ADD: "/web/products/cart/add",
    UPDATE: "/web/products/cart/update",
    REMOVE: "/web/products/cart/remove",
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
  FAQ: {
    LIST: "/web/faq/list",
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
  ORDERS: {
    CREATE: "/web/order/create",
    LIST: "/web/order/list",
    VIEW: "/web/order/view",
    UPDATE: "/web/order/update",
    CANCEL: "/web/order/cancel",
  },
  // API_ENDPOINTS.ts
  PAYMENT: {
    CREATE_ORDER: "/web/payment/create-order",
    VERIFY: "/web/payment/verify",
  },
  CMS: "/web/user/cms/get",
  CONTACT_US: "/web/contact-us",

  // API_ENDPOINTS.ts
  AFFILIATE: {
    SIGNUP: "/web/affiliate/signup",
    LOGIN: "/web/affiliate/login",
  }
};
