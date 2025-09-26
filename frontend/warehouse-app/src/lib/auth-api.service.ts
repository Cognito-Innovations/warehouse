import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

// Create a base axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to get authenticated API instance
export const getAuthenticatedApi = (token: string) => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
};

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

export const createPickupRequest = async (payload: PickupRequestPayload, token: string) => {
  const authenticatedApi = getAuthenticatedApi(token);
  const res = await authenticatedApi.post("/pickup-requests", payload);
  return res.data;
};

export const getPickupRequestsByUser = async (userId: string, token: string) => {
  const authenticatedApi = getAuthenticatedApi(token);
  const res = await authenticatedApi.get(`/pickup-requests/${userId}`);
  return res.data;
};

export const getPickupRequestById = async (id: string, token: string) => {
  const authenticatedApi = getAuthenticatedApi(token);
  const res = await authenticatedApi.get(`/pickup-requests/detail/${id}`);
  return res.data;
};

export const updatePickupRequestStatus = async (id: string, status: string, price: number | undefined, token: string) => {
  const authenticatedApi = getAuthenticatedApi(token);
  const res = await authenticatedApi.patch(`/pickup-requests/${id}/status`, { status, price });
  return res.data;
};

export const createShoppingRequest = async (request: any, token: string) => {
  const authenticatedApi = getAuthenticatedApi(token);
  const res = await authenticatedApi.post("/shopping-requests", request);
  return res.data;
};

export const createShoppingRequestProduct = async (product: any, token: string) => {
  const authenticatedApi = getAuthenticatedApi(token);
  const res = await authenticatedApi.post("/products", product);
  return res.data;
};

export const getShoppingRequestsByUser = async (userId: string, token: string) => {
  const authenticatedApi = getAuthenticatedApi(token);
  const res = await authenticatedApi.get(`/shopping-requests/${userId}`);
  return res.data;
};

export const getShoppingRequestById = async (requestCode: string, token: string) => {
  const authenticatedApi = getAuthenticatedApi(token);
  const res = await authenticatedApi.get(`/shopping-requests/detail/by-code/${requestCode}`);
  return res.data;
};

export const updateShoppingRequestStatus = async (id: string, status: string, token: string) => {
  const authenticatedApi = getAuthenticatedApi(token);
  const res = await authenticatedApi.patch(`/shopping-requests/${id}/status`, { status });
  return res.data;
};

export const addPaymentSlip = async (id: string, url: string, token: string) => {
  const authenticatedApi = getAuthenticatedApi(token);
  const res = await authenticatedApi.patch(`/shopping-requests/${id}/slips`, { url });
  return res.data;
};

export const getPackagesByUserAndStatus = async (userId: string, status: string, token: string) => {
  const authenticatedApi = getAuthenticatedApi(token);
  const res = await authenticatedApi.get(`/packages/user/${userId}/status/${status}`);
  return res.data;
};

export const updatePackageStatus = async (packageId: string, status: string, userId: string, token: string) => {
  const authenticatedApi = getAuthenticatedApi(token);
  const res = await authenticatedApi.patch(`/packages/${packageId}/status`, { 
    status: status,
    updated_by: userId
  });
  return res.data;
};

export const getShipmentsByUser = async (userId: string, token: string) => {
  const authenticatedApi = getAuthenticatedApi(token);
  const res = await authenticatedApi.get(`/packages/user/${userId}/status/Request Ship`);
  return res.data;
};
