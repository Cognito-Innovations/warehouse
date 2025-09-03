import type { Package, Rack, Supplier, User } from '../types';
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

export const createPackage = async (pkg: Package): Promise<Package> => {
  const response = await api.post<Package>('/packages', pkg);
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