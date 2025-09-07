import api from './axios';
import axios from 'axios';
import { getSession } from 'next-auth/react';

export interface PickupRequestPayload {
  user_id: string;
  pickup_address: string;
  supplier_name: string;
  supplier_phone: string;
  alt_phone?: string;
  pcs_box: number;
  est_weight?: number;
  pkg_details: string;
  remarks?: string;
}

// Cache for session and axios instance
let cachedSession: any = null;
let cachedApiInstance: any = null;
let lastToken: string | null = null;

const getAuthenticatedApi = async () => {
  // Get fresh session
  const session = await getSession();
  const token = (session as any)?.access_token;
  
  if (!token) {
    throw new Error('No authentication token available');
  }

  // If token changed or no cached instance, create new one
  if (token !== lastToken || !cachedApiInstance) {
    // Set JWT token in cookie directly (client-side)
    if (typeof document !== 'undefined') {
      document.cookie = `jwt-token=${token}; path=/; max-age=${24 * 60 * 60}; samesite=lax${process.env.NODE_ENV === 'production' ? '; secure' : ''}`;
    }

    cachedApiInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    
    lastToken = token;
    cachedSession = session;
  }

  return cachedApiInstance;
};

// Function to clear cache (call this on logout)
export const clearApiCache = () => {
  cachedSession = null;
  cachedApiInstance = null;
  lastToken = null;
};

export const createPickupRequest = async (payload: PickupRequestPayload) => {
  const authenticatedApi = await getAuthenticatedApi();
  const res = await authenticatedApi.post('/pickup-requests', payload);
  return res.data;
};

export const getPickupRequestsByUser = async (userId: string) => {
  const authenticatedApi = await getAuthenticatedApi();
  const res = await authenticatedApi.get(`/pickup-requests/${userId}`);
  return res.data;
};

export const getPickupRequestById = async (id: string) => {
  const authenticatedApi = await getAuthenticatedApi();
  const res = await authenticatedApi.get(`/pickup-requests/detail/${id}`);
  return res.data;
};

export const updatePickupRequestStatus = async (id: string, status: string, price?: number) => {
  const authenticatedApi = await getAuthenticatedApi();
  const res = await authenticatedApi.patch(`/pickup-requests/${id}/status`, { status, price });
  return res.data;
};

export const createShoppingRequest = async (request: any) => {
  const authenticatedApi = await getAuthenticatedApi();
  const res = await authenticatedApi.post("/shopping-requests", request);
  return res.data;
};

export const createShoppingRequestProduct = async (product: any) => {
  const authenticatedApi = await getAuthenticatedApi();
  const res = await authenticatedApi.post("/products", product);
  return res.data;
};

export const getShoppingRequestsByUser = async (userId: string) => {
  const authenticatedApi = await getAuthenticatedApi();
  const res = await authenticatedApi.get(`/shopping-requests/${userId}`);
  return res.data;
};

export const getShoppingRequestById = async (requestCode: string) => {
  const authenticatedApi = await getAuthenticatedApi();
  const res = await authenticatedApi.get(`/shopping-requests/detail/by-code/${requestCode}`);
  return res.data;
}

export const updateShoppingRequestStatus = async (id: string, status: string) => {
  const authenticatedApi = await getAuthenticatedApi();
  const res = await authenticatedApi.patch(`/shopping-requests/${id}/status`, { status });
  return res.data;
};

export const addPaymentSlip = async (id: string, url: string) => {
  const authenticatedApi = await getAuthenticatedApi();
  const res = await authenticatedApi.patch(`/shopping-requests/${id}/slips`, { url });
  return res.data;
};

export const getPackagesByUserAndStatus = async (userId: string, status: string) => {
  const authenticatedApi = await getAuthenticatedApi();
  const res = await authenticatedApi.get(`/packages/user/${userId}/status/${status}`);
  return res.data;
};

export const updatePackageStatus = async (packageId: string, status: string) => {
  const authenticatedApi = await getAuthenticatedApi();
  
  // Get user ID from cached session
  const userId = (cachedSession?.user as any)?.user_id;
  
  if (!userId) {
    throw new Error('No user ID found in session');
  }
  
  const res = await authenticatedApi.patch(`/packages/${packageId}/status`, { 
    status: status,
    updated_by: userId
  });
  return res.data;
};

export const getShipmentsByUser = async (userId: string) => {
  const authenticatedApi = await getAuthenticatedApi();
  const res = await authenticatedApi.get(`/packages/user/${userId}/status/Request Ship`);
  return res.data;
};