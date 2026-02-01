import axios from "axios";
import {
  EcommerceCategory,
  EcommerceSubCategory,
  EcommerceProduct,
  Cart,
  Order,
  AddToCartRequest,
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
    try {
      const params: any = {};
      if (countryCode) {
        params.countryCode = countryCode;
      }
      const response = await api.get("/ecommerce-categories", { params });
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to get categories!');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to get categories:', error);
      return [];
    }
  },

  async getCategory(id: string, countryCode?: string): Promise<EcommerceCategory> {
    try {
      const params: any = {};
      if (countryCode) {
        params.countryCode = countryCode;
      }
      const response = await api.get(`/ecommerce-categories/${id}`, { params });
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to get category!');
      }
      return response.data;
    } catch (error) {
      console.error(`Failed to get category with ${id}:`, error);
      throw error;
    }
  },

  // Sub Categories
  async getSubCategories(countryCode?: string): Promise<EcommerceSubCategory[]> {
    try {
      const params: any = {};
      if (countryCode) {
        params.countryCode = countryCode;
      }
      const response = await api.get("/ecommerce-sub-categories", { params });
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to get sub-categories!');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to get sub-categories:', error);
      return [];
    }
  },

  async getSubCategory(id: string, countryCode?: string): Promise<EcommerceSubCategory> {
    try {
      const params: any = {};
      if (countryCode) {
        params.countryCode = countryCode;
      }
      const response = await api.get(`/ecommerce-sub-categories/${id}`, { params });
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to get sub-category!');
      }
      return response.data;
    } catch (error) {
      console.error(`Failed to get sub-category with ${id}:`, error);
      throw error;
    }
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
    try {
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
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to get products!');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to get products:', error);
      return [];
    }  
  },

  async getProduct(slug: string, currency?: string, userId?: string, countryCode?: string): Promise<EcommerceProduct> {
    try {
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
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to get product!');
      }
      return response.data;
    } catch (error) {
      console.error(`Failed to get product with ${slug}:`, error);
      throw error;
    } 
  },

  async searchProducts(
    searchTerm: string,
    currency?: string,
    userId?: string,
    countryCode?: string,
    limit?: number,
    offset?: number
  ): Promise<EcommerceProduct[]> {
    try {
      const params: any = {
        searchTerm: searchTerm,
        currency,
        user_id: userId,
        countryCode,
        limit,
        offset,
      };

      const response = await api.get("/ecommerce-products/search", { params });
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to search product!');
      }
      return response.data;
    } catch (error) {
      console.error(`Failed to search product with ${searchTerm}:`, error);
      throw error;
    } 
  },

  // Cart
  async fetchCart(): Promise<Cart> {
    try {
      const response = await api.get("/ecommerce-cart");
      if (response.statusText.toLowerCase() !== 'ok') {
        console.error('Failed to fetch the cart!');
        return { items: [], final_amount: 0, total_amount: 0, discount_percentage: 0, id: "", user_id: "", status: "ACTIVE", created_at: "", updated_at: "" };
      }
      return response.data;
    } catch (error) {
      console.error('Failed to fetch the cart:', error);
      return { items: [], final_amount: 0, total_amount: 0, discount_percentage: 0, id: "", user_id: "", status: "ACTIVE", created_at: "", updated_at: "" };
    }
  },

  async syncLocalStorageProductsToCart(data: {product_id: string, quantity: number}[]): Promise<any> {
    try {
      const response = await api.post("/ecommerce-cart/sync-local-storage-products-to-cart", { products: data });
      if (response.statusText.toLowerCase() !== 'ok') {
        console.error('Failed to sync local storage products to cart!');
        return { items: [], final_amount: 0, total_amount: 0, discount_percentage: 0, id: "", user_id: "", status: "ACTIVE", created_at: "", updated_at: "" };
      }
      return response.data;
    } catch (error) {
      console.error('Failed to sync local storage products to cart:', error);
    } 
  },

  async addToCart(data: AddToCartRequest): Promise<any> {
    try {
      const response = await api.post("/ecommerce-cart/add", data);
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to add to cart!');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } 
  },

  async removeFromCart(productId: string): Promise<Cart> {
    try {
      const response = await api.delete(`/ecommerce-cart/items/${productId}`);
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to remove the cart item!');
      }
      return response.data;
    } catch (error) {
      console.error(`Failed to remove the cart item with ${productId}:`, error);
      throw error;
    }
  },

  async clearCart(): Promise<void> {
    try {
      const response = await api.delete("/ecommerce-cart/clear");
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to clear the cart!');
      }
    } catch (error) {
      console.error('Failed to clear the cart:', error);
      throw error;
    }
  },

  async getDeliveryRates(countryCode?: string, currencyCode?: string): Promise<any[]> {
    try {
      const params: any = {};
      if (countryCode) {
        params.countryCode = countryCode;
      }
      if (currencyCode) {
        params.currencyCode = currencyCode;
      }
      const response = await api.get("/ecommerce-cart/delivery-rates", { params });
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to get delivery rates!');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to get delivery rates:', error);
      throw error;
    }
  },

  async selectDeliveryOption(option: DeliveryOption): Promise<void> {
    try {
      const response = await api.post('/ecommerce-cart/select-delivery-option', { delivery_option: option });
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to store delivery option!');
      }
    } catch (error) {
      console.error('Failed to store delivery option:', error);
      throw error;
    }
  },

  async postCheckout(
    currency?: string, 
    countryCode?: string, 
    productIds?: string[]
  ): Promise<ComputedCart> {
    try {
      const response = await api.post('/ecommerce-cart/checkout', {
        currency,
        countryCode,
        productIds,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to post checkout data:', error);
      throw error;
    }  
  },
  
  // Orders
  async initiateOrder(orderData: any, countryCode?: string): Promise<any> {
    try {
      let params: any = {};
      if (countryCode) {
        params.countryCode = countryCode;
      }
      const response = await api.post("/ecommerce-orders/initiate", orderData, { params });
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to initiate order!');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to initiate order:', error);
      throw error;
    }  
  },

  async captureOrder(orderId: string, paypalOrderId: string): Promise<any> {
    try {
      const response = await api.post(`/ecommerce-orders/${orderId}/capture`,
        { orderID: paypalOrderId }
      );
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to capture order!');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to capture order:', error);
      throw error;
    }  
  },
  
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    try{
      const response = await api.post("/ecommerce-orders", data);
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to create order!');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    } 
  },

  async getOrders(): Promise<Order[]> {
    try {
      const response = await api.get("/ecommerce-orders");
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to get orders!');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to get orders:', error);
      throw error;
    } 
  },

  async getOrder(id: string): Promise<Order> {
    try {
      const response = await api.get(`/ecommerce-orders/${id}`);
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to get order!');
      }
      return response.data;
    } catch (error) {
      console.error(`Failed to get order with ${id}:`, error);
      throw error;
    } 
  },

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    try {
      const response = await api.get(`/ecommerce-orders/order-number/${orderNumber}`);
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to get order by order number!');
      }
      return response.data;
    } catch (error) {
      console.error(`Failed to get order by ${orderNumber}:`, error);
      throw error;
    } 
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    try {
      const response = await api.put(`/ecommerce-orders/${id}/status`, { status });
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to update order status!');
      }
      return response.data;
    } catch (error) {
      console.error(`Failed to update order status of ${id}:`, error);
      throw error;
    } 
  },

  async updatePaymentStatus(id: string): Promise<Order> {
    try {
      const response = await api.put(`/ecommerce-orders/${id}/payment-status`);
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to update payment status!');
      }
      return response.data;
    } catch (error) {
      console.error(`Failed to update payment status of ${id}:`, error);
      throw error;
    } 
  },

  async cancelOrder(id: string): Promise<Order> {
    try {
      const response = await api.put(`/ecommerce-orders/${id}/cancel`);
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to cancel order!');
      }
      return response.data;
    } catch (error) {
      console.error(`Failed to cancel order of ${id}:`, error);
      throw error;
    } 
  },

  async getCurrencyByCode(code: string) {
    try {
      const response = await api.get(`/currencies/by-code/${code}`);
      if (response.statusText.toLowerCase() !== 'ok') {
        throw new Error('Failed to get currency by code!');
      }
      return response.data;
    } catch (error) {
      console.error(`Failed to get currency by ${code}:`, error);
      throw error;
    } 
  },
};
