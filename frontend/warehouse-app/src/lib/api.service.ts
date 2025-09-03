import api from './axios';

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

export const createPickupRequest = async (payload: PickupRequestPayload) => {
  const res = await api.post('/pickup-requests', payload);
  return res.data;
};

export const getPickupRequestsByUser = async (userId: string) => {
  const res = await api.get(`/pickup-requests/${userId}`);
  return res.data;
};

export const getPickupRequestById = async (id: string) => {
  const res = await api.get(`/pickup-requests/detail/${id}`);
  return res.data;
};

export const updatePickupRequestStatus = async (id: string, status: string, price?: number) => {
  const res = await api.patch(`/pickup-requests/${id}/status`, { status, price });
  return res.data;
};

export const createShoppingRequest = async (request: any) => {
  const res = await api.post("/shopping-requests", request);
  return res.data;
};

export const getShoppingRequestsByUser = async (userId: string) => {
  const res = await api.get(`/shopping-requests/${userId}`);
  return res.data;
};