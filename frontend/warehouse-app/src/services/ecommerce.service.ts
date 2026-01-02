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
    searchTerm?: string,
    currency?: string,
    category?: string,
    limit?: number,
    offset?: number,
    userId?: string,
    countryCode?: string
  ): Promise<EcommerceProduct[]> {
    const params: any = {};
    if (searchTerm) {
      params.search = searchTerm;
    }
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

  async searchProducts(query: string): Promise<EcommerceProduct[]> {
    const response = await api.get(`/ecommerce-products?search=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Cart
  async getCart(currency?: string): Promise<Cart> {
    let params: any = {};
    if (currency) {
      params.currency = currency;
    }
    const response = await api.get("/ecommerce-cart", { params });
    return response.data;
  },

  async addToCart(data: AddToCartRequest, currency?: string): Promise<Cart> {
    let params: any = {};
    if (currency) {
      params.currency = currency;
    }
    const response = await api.post("/ecommerce-cart/add", data, { params });
    return response.data;
  },

  async updateCartItem(itemId: string, data: UpdateCartItemRequest, currency?: string): Promise<Cart> {
    let params: any = {};
    if (currency) {
      params.currency = currency;
    }
    const response = await api.put(`/ecommerce-cart/items/${itemId}`, data, { params });
    return response.data;
  },

  async removeFromCart(itemId: string, currency?: string): Promise<Cart> {
    let params: any = {};
    if (currency) {
      params.currency = currency;
    }
    const response = await api.delete(`/ecommerce-cart/items/${itemId}`, {params});
    return response.data;
  },

  async clearCart(): Promise<void> {
    await api.delete("/ecommerce-cart/clear");
  },

  // Orders
  async initiateOrder(orderData: any): Promise<any> {
    const response = await api.post('/ecommerce-orders/initiate', orderData);
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
};
