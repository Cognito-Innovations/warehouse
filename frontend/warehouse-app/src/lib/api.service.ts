import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getSession } from "next-auth/react";

export interface PickupRequestPayload {
  user_id: string;
  country_id: string;
  pickup_address: string;
  supplier_name: string;
  supplier_phone_number: string;
  alt_supplier_phone_number?: string;
  pcs_box: string;
  est_weight?: string;
  pkg_details: string;
  remarks?: string;
  status?: string;
}

// Create a customized axios instance with interceptors
const createAuthenticatedApi = (): AxiosInstance => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor to add auth token
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const session = await getSession();
        const token = (session as any)?.access_token;
        
        if (token) {
          config.headers.set("Authorization", `Bearer ${token}`);
        }
      } catch (error) {
        console.error("Error getting session for API request:", error);
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        console.error("Unauthorized access - token may be expired");
        // You can redirect to login or refresh token here
      }
      return Promise.reject(error);
    }
  );

  return api;
};

// Create the authenticated API instance
const authenticatedApi = createAuthenticatedApi();

export const createPickupRequest = async (payload: PickupRequestPayload) => {
  const res = await authenticatedApi.post("/pickup-requests", payload);
  return res.data;
};

export const getPickupRequestsByUser = async (userId: string) => {
  const res = await authenticatedApi.get(`/pickup-requests/${userId}`);
  return res.data;
};

export const getPickupRequestById = async (id: string) => {
  const res = await authenticatedApi.get(`/pickup-requests/detail/${id}`);
  return res.data;
};

export const updatePickupRequestStatus = async (id: string, status: string, price?: number) => {
  const res = await authenticatedApi.patch(`/pickup-requests/${id}/status`, { status, price });
  return res.data;
};

export const createShoppingRequest = async (request: any) => {
  const res = await authenticatedApi.post("/shopping-requests", request);
  return res.data;
};

export const createShoppingRequestProduct = async (product: any) => {
  const res = await authenticatedApi.post("/products", product);
  return res.data;
};

export const getShoppingRequestsByUser = async (userId: string) => {
  const res = await authenticatedApi.get(`/shopping-requests/${userId}`);
  return res.data;
};

export const getShoppingRequestById = async (requestCode: string) => {
  const res = await authenticatedApi.get(`/shopping-requests/detail/by-code/${requestCode}`);
  return res.data;
};

export const updateShoppingRequestStatus = async (id: string, status: string) => {
  const res = await authenticatedApi.patch(`/shopping-requests/${id}/status`, { status });
  return res.data;
};

export const addPaymentSlip = async (id: string, url: string) => {
  const res = await authenticatedApi.patch(`/shopping-requests/${id}/slips`, { url });
  return res.data;
};

export const getPackagesByUserAndStatus = async (userId: string, status: string) => {
  const res = await authenticatedApi.get(`/packages/user/${userId}/status/${status}`);
  return res.data;
};

export const updatePackageStatus = async (packageId: string, status: string) => {
  const session = await getSession();
  const userId = (session?.user as any)?.user_id;
  
  if (!userId) {
    throw new Error("No user ID found in session");
  }
  
  const res = await authenticatedApi.patch(`/packages/${packageId}/status`, { 
    status: status,
    updated_by: userId
  });
  return res.data;
};

export const getShipmentsByUser = async (userId: string) => {
  const res = await authenticatedApi.get(`/packages/user/${userId}/status/Request Ship`);
  return res.data;
};

export const getCourierCompanies = async () => {
  const res = await authenticatedApi.get(`/courier-companies`);
  return res.data;
};