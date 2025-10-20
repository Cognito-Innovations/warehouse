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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const ecommerceService = {
  // Categories
  async getCategories(): Promise<EcommerceCategory[]> {
    const response = await api.get("/ecommerce-categories");
    return response.data;
  },

  async getCategory(id: string): Promise<EcommerceCategory> {
    const response = await api.get(`/ecommerce-categories/${id}`);
    return response.data;
  },

  // Sub Categories
  async getSubCategories(): Promise<EcommerceSubCategory[]> {
    const response = await api.get("/ecommerce-sub-categories");
    return response.data;
  },

  async getSubCategory(id: string): Promise<EcommerceSubCategory> {
    const response = await api.get(`/ecommerce-sub-categories/${id}`);
    return response.data;
  },

  // Products
  async getProducts(): Promise<EcommerceProduct[]> {
    const response = await api.get("/ecommerce-products");
    return response.data;
  },

  async getProduct(id: string): Promise<EcommerceProduct> {
    const response = await api.get(`/ecommerce-products/${id}`);
    return response.data;
  },

  async searchProducts(query: string): Promise<EcommerceProduct[]> {
    const response = await api.get(`/ecommerce-products?search=${encodeURIComponent(query)}`);
    return response.data;
  },

  async getProductsByCategory(categoryId: string): Promise<EcommerceProduct[]> {
    const response = await api.get(`/ecommerce-products?category=${categoryId}`);
    return response.data;
  },

  async getProductsBySubCategory(subCategoryId: string): Promise<EcommerceProduct[]> {
    const response = await api.get(`/ecommerce-products?sub_category=${subCategoryId}`);
    return response.data;
  },

  // Cart
  async getCart(): Promise<Cart> {
    const response = await api.get("/ecommerce-cart");
    return response.data;
  },

  async addToCart(data: AddToCartRequest): Promise<Cart> {
    const response = await api.post("/ecommerce-cart/add", data);
    return response.data;
  },

  async updateCartItem(itemId: string, data: UpdateCartItemRequest): Promise<Cart> {
    const response = await api.put(`/ecommerce-cart/items/${itemId}`, data);
    return response.data;
  },

  async removeFromCart(itemId: string): Promise<Cart> {
    const response = await api.delete(`/ecommerce-cart/items/${itemId}`);
    return response.data;
  },

  async clearCart(): Promise<void> {
    await api.delete("/ecommerce-cart/clear");
  },

  // Orders
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

  async updatePaymentStatus(id: string, paymentStatus: string): Promise<Order> {
    const response = await api.put(`/ecommerce-orders/${id}/payment-status`, { paymentStatus });
    return response.data;
  },

  async cancelOrder(id: string): Promise<Order> {
    const response = await api.put(`/ecommerce-orders/${id}/cancel`);
    return response.data;
  },
};
