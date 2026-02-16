export const NO_IMAGE = "/assets/no_image.jpg"
export const logoImage = "/assets/logo.png"
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  HOME: "/api/web/home",
  AUTH: {
    SEND_OTP: "/api/web/auth/send-otp",
    VERIFY_OTP: "/api/web/auth/verify-otp",
  },
  INDUSTRY: {
    LIST: "/api/web/list/industry",
    CATEGORY: {
      LIST: "/api/web/list/category",
      CategorySubCategory: "/api/web/list/categories-with-subcategories",
      SUBCATEGORY: {
        LIST: "/api/web/list/subcategory",
      }
    }
    // LIST: 
    // DETAIL: (id: string | number) => `/api/web/industry/${id}`,
  },
  PRODUCTS: {
    LIST: "/api/web/products",
    RARTING: "/api/web/products/ratings",
    DETAIL: "/api/web/products/details",
  },
  SIZE: {
    LIST: "/api/web/size-chart/list",
    PRODUCT: "/api/web/size-chart/product",
    CATEGORY: "/api/web/size-chart/category",
  },
  WISHLIST: {
    ADD: "/api/web/wishlist/add",
    REMOVE: "/api/web/wishlist/remove",
    LIST: "/api/web/wishlist/list",
  },
  CART: {
    GET: "/api/web/products/cart",
    ADD: "/api/web/products/cart/add",
    UPDATE: "/api/web/products/cart/update",
    REMOVE: "/api/web/products/cart/remove",
  },
  USER: {
    PROFILE: "/user/profile",
  },
  ADDRESS: {
    CREATE: "/api/web/address/create",
    EDIT: "/api/web/address/update",
    VIEW: "/api/web/address/view",
    LIST: "/api/web/address/list",
    DELETE: "/api/web/address/delete",
  },
  FAQ: {
    LIST: "/api/web/faq/list",
  },
  LIST: {
    STATES: "/api/web/list/states",
    CITY: "/api/web/list/cities",
  },
  COUPON: {
    LIST: "/api/web/coupon/list",
    APPLY: "/api/web/coupon/add",
    REMOVE: "/api/web/coupon/remove",
  },
  ORDERS: {
    CREATE: "/api/web/order/create",
    LIST: "/api/web/order/list",
    VIEW: "/api/web/order/view",
    UPDATE: "/api/web/order/update",
    CANCEL: "/api/web/order/cancel",
  },
  // API_ENDPOINTS.ts
  PAYMENT: {
    CREATE_ORDER: "/api/web/payment/create-order",
    VERIFY: "/api/web/payment/verify",
  },
  CMS: "/api/web/user/cms/get",
  CONTACT_US: "/api/web/contact-us",

  // API_ENDPOINTS.ts
  AFFILIATE: {
    SIGNUP: "/api/web/affiliate/signup",
    LOGIN: "/api/web/affiliate/login",
    PROFILE: "/api/web/affiliate/profile",
    UPDATE_PROFILE: "/api/web/affiliate/profile",
    CategoryList: "/api/web/affiliate/category-list",
    DASHBOARD_STATS: "/api/web/affiliate/dashboard-stats",
    PRODUCT_CATEGORY_LIST: "/api/web/affiliate/product-category-list",
    PRODUCT_LIST: "/api/web/affiliate/product-list",
    SALES_LIST: "/api/web/affiliate/sales-list",
    COUPON_LIST: "/api/web/coupon/affiliate/list" ,
    EARNINGS_LIST: "/api/web/affiliate/earnings-and-payments" ,
  }
};
