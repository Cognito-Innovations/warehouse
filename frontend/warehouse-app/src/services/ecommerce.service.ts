import axios from "axios";
import {
  EcommerceCategory,
  EcommerceSubCategory,
  EcommerceProduct,
  Cart,
  Order,
  AddToCartRequest,
  UpdateCartItemRequest,
  CreateOrderRequest,
  DeliveryOption,
  ComputedCart,
} from "../types/ecommerce";
import { attachClientIdentifierInterceptors } from "@/lib/client-identifier";
import { getAuthTokenWithFallback } from "@/utils/getAuthToken";

const API_BASE_URL = process.env.NEXT_PUBLIC_NEST_BACKEND_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

attachClientIdentifierInterceptors(api);

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await getAuthTokenWithFallback();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

export const ecommerceService = {
  // Categories
  async getCategories(countryCode?: string): Promise<EcommerceCategory[]> {
    const params: any = {};
    if (countryCode) {
      params.countryCode = countryCode;
    }
    const response = await api.get("/ecommerce-categories", { params });
    return response.data;
  },

  async getCategory(id: string, countryCode?: string): Promise<EcommerceCategory> {
    const params: any = {};
    if (countryCode) {
      params.countryCode = countryCode;
    }
    const response = await api.get(`/ecommerce-categories/${id}`, { params });
    return response.data;
  },

  // Sub Categories
  async getSubCategories(countryCode?: string): Promise<EcommerceSubCategory[]> {
    const params: any = {};
    if (countryCode) {
      params.countryCode = countryCode;
    }
    const response = await api.get("/ecommerce-sub-categories", { params });
    return response.data;
  },

  async getSubCategory(id: string, countryCode?: string): Promise<EcommerceSubCategory> {
    const params: any = {};
    if (countryCode) {
      params.countryCode = countryCode;
    }
    const response = await api.get(`/ecommerce-sub-categories/${id}`, { params });
    return response.data;
  },

  // Products
  async getProducts(
    currency?: string,
    category?: string,
    limit?: number,
    offset?: number,
    userId?: string,
    countryCode?: string
  ): Promise<EcommerceProduct[]> {
    const params: any = {};
    if (currency) {
      params.currency = currency;
    }
    if (category) {
      params.category = category;
    }
    if (limit !== undefined) {
      params.limit = limit;
    }
    if (offset !== undefined) {
      params.offset = offset;
    }
    if (userId) {
      params.user_id = userId;
    }
    if (countryCode) {
      params.countryCode = countryCode;
    }
    const response = await api.get("/ecommerce-products", { params });
    return response.data;
  },

  async getProduct(slug: string, currency?: string, userId?: string, countryCode?: string): Promise<EcommerceProduct> {
    const params: any = {};
    if (currency) {
      params.currency = currency;
    }
    if (userId) {
      params.user_id = userId;
    }
    if (countryCode) {
      params.countryCode = countryCode;
    }
    const response = await api.get(`/ecommerce-products/${slug}`, { params });
    return response.data;
  },

  async searchProducts(
    searchTerm: string,
    currency?: string,
    userId?: string,
    countryCode?: string,
    limit?: number,
    offset?: number
  ): Promise<EcommerceProduct[]> {
    const params: any = {
      searchTerm: searchTerm,
      currency,
      user_id: userId,
      countryCode,
      limit,
      offset,
    };

    const response = await api.get("/ecommerce-products/search", { params });
    return response.data;
  },

  // Cart
  async getCart(currency?: string, countryCode?: string): Promise<Cart> {
    let params: any = {};
    if (currency) {
      params.currency = currency;
    }
    if (countryCode) {
      params.countryCode = countryCode;
    }
    const response = await api.get("/ecommerce-cart", { params });
    return response.data;
  },

  async addToCart(data: AddToCartRequest, currency?: string, countryCode?: string): Promise<Cart> {
    let params: any = {};
    if (currency) {
      params.currency = currency;
    }
    if (countryCode) {
      params.countryCode = countryCode;
    }
    const response = await api.post("/ecommerce-cart/add", data, { params });
    return response.data;
  },

  async updateCartItem(itemId: string, data: UpdateCartItemRequest, currency?: string, countryCode?: string): Promise<Cart> {
    let params: any = {};
    if (currency) {
      params.currency = currency;
    }
    if (countryCode) {
      params.countryCode = countryCode;
    }
    const response = await api.put(`/ecommerce-cart/items/${itemId}`, data, { params });
    return response.data;
  },

  async removeFromCart(itemId: string, currency?: string, countryCode?: string): Promise<Cart> {
    let params: any = {};
    if (currency) {
      params.currency = currency;
    }
    if (countryCode) {
      params.countryCode = countryCode;
    }
    const response = await api.delete(`/ecommerce-cart/items/${itemId}`, {params});
    return response.data;
  },

  async clearCart(): Promise<void> {
    await api.delete("/ecommerce-cart/clear");
  },

  async getDeliveryRates(countryCode?: string): Promise<any[]> {
    const params: any = {};
    if (countryCode) {
      params.countryCode = countryCode;
    }
    const response = await api.get("/ecommerce-cart/delivery-rates", { params });
    return response.data;
  },

  async selectDeliveryOption(option: DeliveryOption): Promise<void> {
    await api.post('/ecommerce-cart/select-delivery-option', { delivery_option: option });
  },

  async getCheckout(currency?: string, countryCode?: string): Promise<ComputedCart> {
    const params: any = {};
    if (currency) params.currency = currency;
    if (countryCode) params.countryCode = countryCode;
    const response = await api.get('/ecommerce-cart/checkout', { params });
    return response.data;
  },
  
  // Orders
  async initiateOrder(orderData: any, countryCode?: string): Promise<any> {
    let params: any = {};
    if (countryCode) {
      params.countryCode = countryCode;
    }
    const response = await api.post("/ecommerce-orders/initiate", orderData, { params });
    return response.data;
  },

  async captureOrder(orderId: string, paypalOrderId: string): Promise<any> {
    const response = await api.post(`/ecommerce-orders/${orderId}/capture`,
      { orderID: paypalOrderId }
    );
    return response.data;
  },
  
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await api.post("/ecommerce-orders", data);
    return response.data;
  },

  async getOrders(): Promise<Order[]> {
    const response = await api.get("/ecommerce-orders");
    return response.data;
  },

  async getOrder(id: string): Promise<Order> {
    const response = await api.get(`/ecommerce-orders/${id}`);
    return response.data;
  },

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await api.get(`/ecommerce-orders/order-number/${orderNumber}`);
    return response.data;
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const response = await api.put(`/ecommerce-orders/${id}/status`, { status });
    return response.data;
  },

  async updatePaymentStatus(id: string): Promise<Order> {
    const response = await api.put(`/ecommerce-orders/${id}/payment-status`);
    return response.data;
  },

  async cancelOrder(id: string): Promise<Order> {
    const response = await api.put(`/ecommerce-orders/${id}/cancel`);
    return response.data;
  },

  async getCurrencyByCode(code: string) {
    const response = await api.get(`/currencies/by-code/${code}`);
    return response.data;
  },
};
