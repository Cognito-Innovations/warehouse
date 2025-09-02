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