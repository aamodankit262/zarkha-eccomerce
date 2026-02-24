import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

/* -------- Dashboard Stats -------- */
export interface BoutiqueDashboardStatsResponse {
  success: boolean;
  body: {
    total_orders: number;
    total_commission: number;
    total_sales: number;
    pending_commission: number;
  };
}
export interface BoutiqueProductCategory {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
  commission_percentage?: number;
}
export interface BoutiqueProduct {
  _id: string;
  product_id: string;
  share_link: string;
  name: string;
  images?: any[];
  mrp?: number;
  msp?: number;
  rating?: number;
  earning_per_sale?: number;
  commission_percentage?: number;
}

export interface BoutiqueProductCategoryResponse {
  success: boolean;
  body: BoutiqueProductCategory[];
}
export interface BoutiqueProductResponse {
  success: boolean;
  body: BoutiqueProduct[];
}

export interface BoutiqueProductListParams {
  search?: string;
  category_id?: string;
  subcategory_id?: string;
  min_price?: number;
  max_price?: number;
  stock_status?: string;
  page?: number;
  limit?: number;
  discount?: any;
}
export interface SalesListParams {
  status?: "completed" | "pending";
  period?: string;
  page?: number;
  limit?: number;
}
export interface EarningsListParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  affiliate_id?: string;
}
export interface updateProfilePayload {
  full_name: string;
  phone_number: string;
  affiliate_category_id: string;
  affiliate_category: string;
  bank_name: string;
  ifsc_code: string;
  account_number: string;
  account_holder: string;
  upi_id?: string;
}
export interface profileResponse {
  success: boolean;
  message: string;
  _id: string;
  status: string;
  body: {
    store_name: string;
    owner_name: string;
    category: string;
    subcategory: string;
    email: string;
    phone: string;
    store_address: string;
    city: string;
    state: string;
    pincode: string;
    gst_number: string;
    // Pickup Person
    pickup_person_name: string;
    pickup_phone: string;
    pickup_address: string;
    // Bank Details
    bank_name: string;
    account_number: string;
    ifsc_code: string;
    account_holder_name: string;
    upi_id: string;
    // Social
    instagram: string;
    facebook: string;
    whatsapp: string;
    website: string;
    // Operating
    operating_days: string[];
    opening_time: string;
    closing_time: string;
    // Documents
    pan_number: string;
    aadhaar_number: string;
    aadhaar_card: string;
    // Brand
    brand_logo: string;
    digital_signature: string;
    about_brand: string;

    _id: string;
    status: string;
    created_at: string;
  }
}
export interface earningListResponse {
  success: boolean;
  message?: string;
  data: [
    {
      _id: string,
      affiliate_id: string,
      full_name: string,
      email: string,
      status: string,
      total_earnings: number,
      withdrawn_amount: number,
      pending_balance: number,
      orders_count: number,
      total_commission_from_orders: number
    }
  ]
  pagination: {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
  }
}
export interface CouponListParams {
  affiliate_id?: string;
}
export interface AddToCartPayload {
  product_id: string;
  item_id: string;
  size?: string;
  quantity: number;
};
export interface AddToCartResponse {
  success: boolean;
  message: string;
  body: any | null,
}
export interface GetCartResponse {
  success: boolean;
  message: string;
  body: {
    items: any[],
    total_price: number,
  },
}
export interface CreatePaymentOrderPayload {
  amount: number;      // in rupees
  cart_id?: string;
}

// export interface CreatePaymentOrderPayload {
//   items: {
//     product_id: string;
//     item_id: string;
//     quantity: number;
//     selling_price: number;
//   }[];

//   customer: {
//     name: string;
//     phone: string;
//     email: string;
//   };

//   shipping_address: {
//     first_name: string;
//     last_name: string;
//     address: string;
//     city: string;
//     state: string;
//     pin_code: string;
//     country: string;
//     phone: string;
//   };

//   customer_notes: string;
// }

export interface CreatePaymentOrderResponse {
  success: boolean;
  message: string;
  body: {
    boutique_order_id: string;
    order_id: string;
    cart_id: string;
    total_cost: number;
    total_amount: number;
    expected_profit: number;
    razorpay_order_id: string;
    razorpay_amount: number;
    razorpay_currency: string;
    key_id: string;
  };
}

/* ------------------ Verify Payment ------------------ */
export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  items: {
    product_id: string;
    item_id: string;
    quantity: number;
    selling_price: number;
  }[];

  customer: {
    name: string;
    phone: string;
    email: string;
  };

  shipping_address: {
    first_name: string;
    last_name: string;
    address: string;
    city: string;
    state: string;
    pin_code: string;
    country: string;
    phone: string;
  };

  customer_notes: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  body?: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    verified: boolean
    order: {
      order_id: string;
      total_amount: number;
      items_count: number;
      payment_method: string;
      order_status: string;
      _id: string;
      ordered_at: string;
    };
  };
}
export interface OrderListPayload {
  page?: number;
  limit?: number;
  search?: string;
  order_status?: string;
  order_type?: string;
};
export interface CurationListPayload {
  page?: number;
  limit?: number;
  search?: string;
  order_status?: string;
  order_type?: string;
};
export interface CurationPayload {
  name?: string;
  description: string;
  product_ids: string[];
};

export const boutiqueService = {

  productList: async (params: BoutiqueProductListParams) => {
    const payload = {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      ...(params.search && { search: params.search }),
      ...(params.category_id && params.category_id !== "all" && { category_id: params.category_id }),
      ...(params.subcategory_id && { subcategory_id: params.subcategory_id }),
      ...(params.min_price !== undefined && { min_price: params.min_price }),
      ...(params.max_price !== undefined && { max_price: params.max_price }),
      ...(params.stock_status && { stock_status: params.stock_status }),
      ...(params.discount && { discount: params.discount }),
    };
    return apiClient.post<BoutiqueProductResponse>(
      API_ENDPOINTS.BOUTIQUE.PRODUCT_LIST,
      payload
    );
  },

  boutiqueCategoryList: async () => {
    return apiClient.get(API_ENDPOINTS.BOUTIQUE.CategoryList);
  },

  getProfile: async () => {
    return apiClient.get<profileResponse>(API_ENDPOINTS.BOUTIQUE.PROFILE);
  },

  updateProfile: async (data: updateProfilePayload) => {
    return apiClient.put(API_ENDPOINTS.BOUTIQUE.UPDATE_PROFILE, data)
  },
  getSetPrice: async (productId: string, price: number) => {
    const payload = {
      product_id: productId,
      selling_price: price
    }
    return apiClient.post(API_ENDPOINTS.BOUTIQUE.SET_PRICE, payload);
  },
  addToCart: async (payload: AddToCartPayload) => {
    return apiClient.post<AddToCartResponse>(API_ENDPOINTS.BOUTIQUE.ADD_TO_CART, payload);
  },
  getCart: async (id?: string) => {
    return apiClient.post<GetCartResponse>(`${API_ENDPOINTS.BOUTIQUE.GET_CART}`);
  },
  /** CREATE RAZORPAY ORDER */
  createPaymentOrder: async (
    payload: CreatePaymentOrderPayload
  ) => {
    const res = await apiClient.post<CreatePaymentOrderResponse>(
      API_ENDPOINTS.BOUTIQUE.CREATE_ORDER,
      payload,
    );

    return res;
  },

  /** VERIFY RAZORPAY PAYMENT */
  verifyPayment: async (
    payload: VerifyPaymentPayload
  ) => {

    const res = await apiClient.post<VerifyPaymentResponse>(
      API_ENDPOINTS.BOUTIQUE.VARIFY_ORDER,
      payload,
    );

    return res;
  },
  /** ORDER LIST */
  getOrderList: async (payload: OrderListPayload) => {
    const res = await apiClient.post(
      API_ENDPOINTS.BOUTIQUE.ORDER_LIST,
      payload
    );

    return res;
  },

  /** VIEW ORDER DETAILS */
  getOrderDetails: async (orderId: string) => {
    const formData = new FormData();
    formData.append("order_id", orderId);

    const res = await apiClient.post(
      API_ENDPOINTS.ORDERS.VIEW,
      formData
    );

    return res;
  },

  // CURATIONS SERVICES
  getCurationsList: async (payload: CurationListPayload) => {
    const res = await apiClient.post(
      API_ENDPOINTS.BOUTIQUE.CURATIONS_LIST,
      payload
    );

    return res;
  },
  CurationsAdd: async (payload: CurationPayload) => {
    const res = await apiClient.post(
      API_ENDPOINTS.BOUTIQUE.CURATION_ADD,
      payload
    );

    return res;
  },
};
