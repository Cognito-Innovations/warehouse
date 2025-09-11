import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getSession } from "next-auth/react";

// Interface for the pickup request payload, combining the best types from both examples.
export interface PickupRequestPayload {
  user_id: string;
  country_id: string;
  pickup_address: string;
  supplier_name: string;
  supplier_phone_number: string;
  alt_supplier_phone_number?: string;
  pcs_box: number;
  est_weight?: number;
  pkg_details: string;
  remarks?: string;
  status?: string;
}

/**
 * Creates a customized Axios instance with a request interceptor
 * that automatically adds the authentication token from the NextAuth session.
 * This is the most reliable pattern for client-side API authentication.
 */
const createAuthenticatedApi = (): AxiosInstance => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor to add the authorization token before each request.
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const session = await getSession();
        console.log("DEBUG Session:", session);
        // The token is safely extracted from the session object.
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

  // Response interceptor for centralized error handling, like for 401 Unauthorized responses.
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Log unauthorized access. In a real application, you might redirect
        // to a login page or trigger a token refresh here.
        console.error("Unauthorized access - token may be expired");
      }
      return Promise.reject(error);
    }
  );

  return api;
};

// Create a single, shared instance of the authenticated API.
const authenticatedApi = createAuthenticatedApi();

// --- Pickup Request Functions ---

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

// --- Shopping Request Functions ---

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

export const addPaymentSlip = async (id: string, data: {
  url: string;
  original_filename: string;
  mime_type?: string;
  file_size?: number;
}) => {
  const res = await authenticatedApi.patch(`/shopping-requests/${id}/slips`, { data });
  return res.data;
};

export const deleteShoppingRequest = async (id: string) => {
  const res = await authenticatedApi.delete(`/shopping-requests/${id}`);
  return res.data;
};

// --- Package & Shipment Functions ---

export const getPackagesByUserAndStatus = async (userId: string, status: string) => {
  const res = await authenticatedApi.get(`/packages/user/${userId}/status/${status}`);
  return res.data;
};

export const getPackagesByShipmentId = async (shipmentId: string) => {
  const res = await authenticatedApi.get(`/packages/shipments/id/${shipmentId}`);
  return res.data;
};

export const updatePackageStatus = async (packageId: string, status: string) => {
  const session = await getSession();
  const userId = (session?.user as any)?.user_id;
  
  if (!userId) {
    // Throw an error if the user ID is not available.
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

export const addPackagePaymentSlip = async (
  shipmentUuid: string,
  data: {
    url: string;
    original_filename: string;
    mime_type?: string;
    file_size?: number;
  }
) => {
  const res = await authenticatedApi.patch(`/packages/shipments/${shipmentUuid}/slips`, { data });
  return res.data;
};

export const getPaymentSlips = async (shipmentUuid: string): Promise<any[]> => {
  const response = await authenticatedApi.get(`/packages/shipments/${shipmentUuid}/slips`);
  return response.data;
};

// --- Other Functions ---

export const getCourierCompanies = async () => {
  const res = await authenticatedApi.get(`/courier-companies`);
  return res.data;
};

// --- Countries Functions ---

export const getCountries = async () => {
  const res = await authenticatedApi.get("/countries");
  return res.data;
};