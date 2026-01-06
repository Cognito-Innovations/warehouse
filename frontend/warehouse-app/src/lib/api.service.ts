import { ProfileData } from "@/components/Modals/EditProfileModal";
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getSession } from "next-auth/react";
import { attachClientIdentifierInterceptors } from "@/lib/client-identifier";
import { getAuthTokenWithFallback } from "@/utils/getAuthToken";

// Interface for the pickup request payload, combining the best types from both examples.
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

/**
 * Creates a customized Axios instance with a request interceptor
 * that automatically adds the authentication token from the NextAuth session.
 * This is the most reliable pattern for client-side API authentication.
 */
const createAuthenticatedApi = (): AxiosInstance => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_NEST_BACKEND_URL || "http://localhost:3001",
    headers: {
      "Content-Type": "application/json",
    },
  });

  attachClientIdentifierInterceptors(api);

  // Request interceptor to add the authorization token before each request.
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const token = await getAuthTokenWithFallback();
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

export const deletePickupRequest = async (id: string) => {
  const res = await authenticatedApi.delete(`/pickup-requests/${id}`);
  return res.data;
};

// --- Shopping Request Functions ---

export const createShoppingRequest = async (request: any) => {
  const res = await authenticatedApi.post("/shopping-requests", request);
  return res.data;
};

export const createShoppingRequestProduct = async (product: any) => {
  const res = await authenticatedApi.post("/shopping-request-products", product);
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

export const getPackagesByUser = async (userId: string) => {
  const res = await authenticatedApi.get(`/packages/user/${userId}`);
  return res.data;
};

export const createShipment = async (payload: any) => {
  const res = await authenticatedApi.post(`/shipments`, payload);
  return res.data;
}

export const getShipmentsByUser = async (userId: string) => {
  const res = await authenticatedApi.get(`/shipments/${userId}`);
  return res.data;
}

export const getPackagesByShipmentNo = async (shipmentNo: string) => {
  const res = await authenticatedApi.get(`/shipments/detail/by-shipmentNo/${shipmentNo}`);
  return res.data;
}

export const createShipmentPaymentSlip = async (
  id: string,
  data: {
    url: string;
    original_filename: string;
    mime_type?: string;
    file_size?: number;
    category: 'PAYMENT' | 'SHIPMENT_PHOTO';
  }
) => {
  const res = await authenticatedApi.post(`/shipments/${id}/documents`, { data });
  return res.data;
};


export const deleteShipment = async (id: string) => {
  const res = await authenticatedApi.delete(`/shipments/${id}`);
  return res.data;
};

export const uploadPackageDocuments = async (packageId: string, files: File[]): Promise<any> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append("files", file);
  });

  const response = await authenticatedApi.post(`/packages/${packageId}/documents/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
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

export const getPaymentSlips = async (shipmentUuid: string): Promise<any[]> => {
  const response = await authenticatedApi.get(`/packages/shipments/${shipmentUuid}/slips`);
  return response.data;
};

// --- Other Functions ---

export const getCourierCompanies = async () => {
  const res = await authenticatedApi.get("/courier-companies");
  return res.data;
};

export const getCurrencies = async () => {
  const res = await authenticatedApi.get("/currencies");
  return res.data;
};

export const updatePassword = async (id: string, currentPassword: string, newPassword: string) => {
  const res = await authenticatedApi.patch(`/users/${id}/password`, { currentPassword, newPassword });
  return res.data;
};

// --- Countries Functions ---

export const getCountries = async () => {
  const res = await authenticatedApi.get("/countries");
  return res.data;
};

export const createUserPreferences = async (data: any) => {
  const res = await authenticatedApi.post("/user-preferences", data);
  return res.data;
};

export const updatePreferences = async (data: any) => {
  //  res = await authenticatedApi.patch(`/user-preferences/${data.user_id}`, data)
  const res = await authenticatedApi.patch(`/user-preferences/by-user/${data.user_id}`, data);
  return res.data;
};

export const updateUser = async (userId: string, data: Partial<ProfileData>) => {
  const res = await authenticatedApi.patch(`/users/${userId}`, data);
  return res.data;
};

export const getUserPreferences = async (userId: string) => {
  const res = await authenticatedApi.get(`/user-preferences/by-user/${userId}`);
  return res.data;
};

export const getUser = async (userId: string) => {
  const res = await authenticatedApi.get(`/users/${userId}`);
  return res.data;
};

export const sendEmailOtp = async (userId: string) => {
  const res = await authenticatedApi.post(`/users/${userId}/send-otp`);
  return res.data;
};

export const verifyEmailOtp = async (userId: string, otp: string) => {
  const res = await authenticatedApi.post(`/users/${userId}/verify-otp`, { otp });
  return res.data;
};

export const createUserAddress = async (data: any) => {
  const res = await authenticatedApi.post("/user-address", data);
  return res.data;
};

export const fetchUserAddresses = async (userId: string) => {
  const res = await authenticatedApi.get(`/user-address/user/${userId}`);
  return res.data;
};

export const updateUserAddress = async (addressId: string, addressData: any) => {
  const res = await authenticatedApi.patch(`/user-address/${addressId}`, addressData);
  return res.data;
};

export const createPreArrival = async (body: {
  userId?: string;
  otp: number;
  tracking_no?: string | null;
  estimate_arrival_time?: string | null;
  details?: string | null;
  status?: string;
}) => {
  const res = await authenticatedApi.post("/pre-arrival", body);
  return res.data;
};

export const getPreArrivalsByUser = async (userId: string) => {
  const res = await authenticatedApi.get(`/pre-arrival/user/${userId}`);
  return res.data;
};

export const deletePreArrival = async (id: string) => {
  const res = await authenticatedApi.delete(`/pre-arrival/${id}`);
  return res.data;
};

export const getOrdersByUser = async (userId: string) => {
  const res = await authenticatedApi.get(`/ecommerce-orders/user/${userId}`);
  return res.data;
};
