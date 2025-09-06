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

// Helper function to get authenticated API instance
const getAuthenticatedApi = async () => {
  const session = await getSession();
  const token = (session as any)?.access_token;
  
  console.log('Session data:', session);
  console.log('JWT Token:', token ? token.substring(0, 20) + '...' : 'No token');
  
  if (!token) {
    throw new Error('No authentication token available');
  }

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
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
  const session = await getSession();
  const userId = (session?.user as any)?.user_id;
  
  if (!userId) {
    throw new Error('No user ID found in session');
  }
  
  const authenticatedApi = await getAuthenticatedApi();
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