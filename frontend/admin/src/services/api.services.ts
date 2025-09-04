import type { Package, Rack, Supplier, User } from '../types';
import type { PreArrival } from '../types/PreArrival';
import api from './axios';

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/users');
  return response.data;
};

export const getRacks = async (): Promise<Rack[]> => {
  const response = await api.get<Rack[]>('/racks');
  return response.data;
};

export const getSuppliers = async (): Promise<Supplier[]> => {
  const response = await api.get<Supplier[]>('/suppliers');
  return response.data;
};

export const getCountries = async (): Promise<Array<{ id: string; country: string }>> => {
  const response = await api.get<Array<{ id: string; country: string }>>('/countries');
  return response.data;
};

interface CreatePackageDto {
  customer: string;
  rack_slot: string;
  tracking_no?: string;
  vendor: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  volumetric_weight: string;
  allow_customer_items: boolean;
  shop_invoice_received: boolean;
  remarks: string;
  pieces: Array<{
    weight: string;
    length: string;
    width: string;
    height: string;
    volumetric_weight: string;
  }>;
}

export const createPackage = async (pkg: CreatePackageDto): Promise<Package> => {
  const response = await api.post<Package>('/packages', pkg);
  return response.data;
};

export const getPackage = async () : Promise <Package[]> => {
  const response = await api.get<Package[]>('/packages')
  return response.data;
}

export const getPackageById = async (id: string): Promise<Package> => {
  const response = await api.get<Package>(`/packages/${id}`);
  return response.data;
};

export const updatePackageStatus = async (id: string, status: string): Promise<Package> => {
  const response = await api.patch<Package>(`/packages/${id}/status`, { status });
  return response.data;
};

// Package Items API functions
export const addPackageItem = async (packageId: string, item: {
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}): Promise<any> => {
  const response = await api.post(`/packages/${packageId}/items`, item);
  return response.data;
};

export const updatePackageItem = async (packageId: string, itemId: string, item: {
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}): Promise<any> => {
  const response = await api.put(`/packages/${packageId}/items/${itemId}`, item);
  return response.data;
};

export const deletePackageItem = async (packageId: string, itemId: string): Promise<any> => {
  const response = await api.delete(`/packages/${packageId}/items/${itemId}`);
  return response.data;
};

export const bulkUploadPackageItems = async (packageId: string, items: Array<{
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}>): Promise<any> => {
  const response = await api.post(`/packages/${packageId}/items/bulk`, { items });
  return response.data;
};

// Package Documents API functions
export const uploadPackageDocuments = async (packageId: string, files: File[]): Promise<any> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  
  const response = await api.post(`/packages/${packageId}/documents/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getPackageDocuments = async (packageId: string): Promise<any> => {
  const response = await api.get(`/packages/${packageId}/documents`);
  return response.data;
};

export const deletePackageDocument = async (packageId: string, documentId: string): Promise<any> => {
  const response = await api.delete(`/packages/${packageId}/documents/${documentId}`);
  return response.data;
};

export const createRack = async (rack: Omit<Rack, 'id'>): Promise<Rack> => {
  const response = await api.post<Rack>('/racks', rack);
  return response.data;
};

export const updateRack = async (id: string, rack: Partial<Rack>): Promise<Rack> => {
  const response = await api.put<Rack>(`/racks/${id}`, rack);
  return response.data;
};

export const deleteRack = async (id: string): Promise<{ success: boolean }> => {
  const response = await api.delete<{ success: boolean }>(`/racks/${id}`);
  return response.data;
};

// Pre-Arrival API functions
export const getPreArrivals = async (): Promise<PreArrival[]> => {
  const response = await api.get<PreArrival[]>('/pre-arrival');
  return response.data;
};

export const getPreArrivalById = async (id: string): Promise<PreArrival> => {
  const response = await api.get<PreArrival>(`/pre-arrival/${id}`);
  return response.data;
};

export const markPreArrivalAsReceived = async (id: string): Promise<PreArrival> => {
  const response = await api.patch<PreArrival>(`/pre-arrival/${id}`, { status: 'received' });
  return response.data;
};

export const getPickupRequests = async () => {
  const response = await api.get('/pickup-requests');
  return response.data;
};

export const getPickupRequestById = async (id: string) => {
  const response = await api.get(`/pickup-requests/detail/${id}`);
  return response.data;
};

export const updatePickupRequestStatus = async (id: string, status: string, price?: number) => {
  const response = await api.patch(`/pickup-requests/${id}/status`, { status, price });
  return response.data;
};

export const getAllShoppingRequests = async () => {
  const response = await api.get("/shopping-requests");
  return response.data;
};

export const getShoppingRequestByCode = async (code: string) => {
  const response = await api.get(`/shopping-requests/detail/by-code/${encodeURIComponent(code)}`);
  return response.data;
};