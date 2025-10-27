//TODO P0: Resolve these typescript errors
import type { CategoryPayload, Country, Courier, CreateCountryPayload, CreateCourierPayload, CreateCurrencyPayload, Currency, Package, ProductPayload, Rack, SubCategoryPayload, Supplier, UpdateCountryPayload, UpdateCourierPayload, UpdateCurrencyPayload, User } from '../types';
import type { PreArrival } from '../types/PreArrival';
import api from './axios';

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/users');
  return response.data;
};

export const getUserBySuiteNo = async (suiteNo: string): Promise<User> => {
  const response = await api.get<User>(`/users/suite/${suiteNo}`);
  return response.data;
}

export const getRacks = async (): Promise<Rack[]> => {
  const response = await api.get<Rack[]>('/racks');
  return response.data;
};

export const getSuppliers = async (): Promise<Supplier[]> => {
  const response = await api.get<Supplier[]>('/suppliers');
  return response.data;
};

export const createSupplier = async (supplier: {
  country: string;
  supplier_name: string;
  contact_number?: string;
  postal_code?: string;
  address?: string;
  website?: string;
}): Promise<Supplier> => {
  const response = await api.post<Supplier>('/suppliers', supplier);
  return response.data;
};

export interface CreatePackageDto {
  user: string;
  rack_slot: string;
  tracking_no?: string;
  vendor: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  volumetric_weight: string;
  allow_user_items: boolean;
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

export const searchPackages = async (query: string): Promise<Package[]> => {
  const response = await api.get<Package[]>('/packages', {
    params: { search: query }
  });
  return response.data;
}

export const updatePackageStatus = async (id: string, status: string): Promise<Package> => {
  const response = await api.patch<Package>(`/packages/${id}/status`, { status });
  return response.data;
};

export const createPackageCharge = async (charges: any): Promise<any> => {
  const response = await api.post<any>(`/packages/shipments/charges`,  charges );
  return response.data;
};

export const deletePackage = async (id: string): Promise<void> => {
  await api.delete(`/packages/${id}`);
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

export const updatePackage = async (id: string, payload: Partial<{
  tracking_no: string;
  weight: string;
  volumetric_weight: string;
  dangerous_good: boolean;
  rack_slot: string;
}>) => {
  const { data } = await api.patch(`/packages/${id}`, payload);
  return data;
};

export const getShipmentDocuments = async (package_uuid: string): Promise<any> => {
  const response = await api.get(`/packages/shipments/${package_uuid}/documents`);
  return response.data;
};

export const addShipmentDocument = async (
  shipment_uuid: string,
  payload: {
    url: string;
    original_filename: string;
    document_type?: string;
    file_size?: number;
    mime_type?: string;
  }
): Promise<any> => {
  const response = await api.post(`/packages/shipments/${shipment_uuid}/documents`, payload);
  return response.data;
};

export const getPaymentSlips = async (shipmentUuid: string): Promise<any[]> => {
  const response = await api.get(`/packages/shipments/${shipmentUuid}/slips`);
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

export const getEcommerceProducts = async () => {
  const response = await api.get(`/ecommerce-categories`);
  return response.data;
}

export const updateShoppingRequestStatus = async (id: string, status: string) => {
  const response = await api.patch(`/shopping-requests/${id}/status`, { status });
  return response.data;
};

export const updateProduct = async (
  productId: string,
  unitPrice?: number,
  available?: boolean,
  currency?: string,
) => {
  const res = await api.patch(`/shopping-requests/${productId}`, {
    ...(unitPrice !== undefined && { unit_price: unitPrice }),
    ...(available !== undefined && { available }),
    ...(currency !== undefined && { currency }),
  });
  return res.data;
};

export const createShipmentExport = async (data: {
  export_code: string;
  boxes_count: number;
  created_by: string;
  mawb?: string;
}) => {
  const res = await api.post('/shipment-exports', data);
  return res.data;
};

export const getShipmentExports = async () => {
  const response = await api.get('/shipment-exports');
  return response.data;
};

export const getShipmentExportById = async (id: string) => {
  const response = await api.get(`/shipment-exports/${id}`);
  return response.data;
};

export const markShipmentExportDeparted = async (id: string) => {
  const response = await api.patch(`/shipment-exports/${id}/departed`);
  return response.data;
};

export const updateShipmentExportBox = async (id: number, payload: any) => {
  const response = await api.patch(`/shipment-export-boxes/${id}`, payload);
  return response.data;
};

export const createShipmentExportBox = async (exportId: string, payload: any = {}) => {
  const response = await api.post(`/shipment-export-boxes/${exportId}`, payload);
  return response.data;
};

export const deleteShipmentExportBox = async (id: number) => {
  await api.delete(`/shipment-export-boxes/${id}`);
};

export const updateShipmentExport = async (id: string, payload: { mawb?: string }) => {
  const response = await api.patch(`/shipment-exports/${id}`, payload);
  return response.data;
};

export const deleteShipmentExport = async (id: string) => {
  await api.delete(`/shipment-exports/${id}`);
};

export const searchReadyToShipPackage = async (trackingNumber: string) => {
  const response = await api.get('/packages/shipments/search', {
    params: {
      trackingNumber,
      status: 'Ready To Ship',
    },
  });
  return response.data;
};

export const addPackageToBox = async (boxId: number, packageId: string) => {
  const response = await api.post(`/shipment-export-boxes/${boxId}/packages`, { packageId });
  return response.data;
};

export const getPackagesByBoxId = async (boxId: number) => {
  const response = await api.get(`/shipment-export-boxes/${boxId}/packages`);
  return response.data;
};

export const removePackageFromBox = async (boxId: number, packageId: string) => {
  const response = await api.delete(`/shipment-export-boxes/${boxId}/packages/${packageId}`);
  return response.data;
};

export const getCountries = async (): Promise<Country[]> => {
  const response = await api.get<Country[]>('/countries');
  return response.data;
};

export const createCountry = async (data: CreateCountryPayload): Promise<Country> => {
  const response = await api.post<Country>('/countries', data);
  return response.data;
};

export const updateCountry = async (
  id: string,
  data: UpdateCountryPayload
): Promise<Country> => {
    const response = await api.patch<Country>(`/countries/${id}`, data);
    return response.data;
};

export const getCurrencies = async (): Promise<Currency[]> => {
  const response = await api.get<Currency[]>('/currencies');
  return response.data;
};

export const createCurrency = async (
  data: CreateCurrencyPayload
): Promise<Currency> => {
  const response = await api.post<Currency>('/currencies', data);
  return response.data;
};

export const updateCurrency = async (
  id: string,
  data: UpdateCurrencyPayload
): Promise<Currency> => {
    const response = await api.patch<Currency>(`/currencies/${id}`, data);
    return response.data;
};

export const getCouriers = async (): Promise<Courier[]> => {
  const response = await api.get<Courier[]>('/courier-companies');
  return response.data;
};

export const createCourier = async (data: CreateCourierPayload): Promise<Courier> => {
  const response = await api.post<Courier>('/courier-companies', data);
  return response.data;
};

export const updateCourier = async (id: string, data: UpdateCourierPayload): Promise<Courier> => {
  const response = await api.patch<Courier>(`/courier-companies/${id}`, data);
  return response.data;
};

export const deletePreArrival = async (id: string) => {
  const res = await api.delete(`/pre-arrival/${id}`);
  return res.data;
};

// Categories
export const createCategory = async (
  data: CategoryPayload
) => {
  const response = await api.post('/ecommerce-categories', data);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/ecommerce-categories");
  return response.data;
};

export const updateCategory = async (id: string, data: CategoryPayload) => {
  const response = await api.patch(`/ecommerce-categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await api.delete(`/ecommerce-categories/${id}`);
  return response.data;
};

// Sub Categories
export const createSubCategory = async (
  data: SubCategoryPayload
) => {
  const response = await api.post('/ecommerce-sub-categories', data);
  return response.data;
};

export const getSubCategories = async () => {
  const response = await api.get("/ecommerce-sub-categories");
  return response.data;
};

export const updateSubCategory = async (id: string, data: SubCategoryPayload) => {
  const response = await api.patch(`/ecommerce-sub-categories/${id}`, data);
  return response.data;
};

export const deleteSubCategory = async (id: string) => {
  const response = await api.delete(`/ecommerce-sub-categories/${id}`);
  return response.data;
};

// Products
export const createProduct = async (
  data: ProductPayload
) => {
  const response = await api.post('/ecommerce-products', data);
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get("/ecommerce-products");
  return response.data;
};

// Measurements
export const getMeasurements = async () => {
  const response = await api.get("/ecommerce-measurements");
  return response.data;
};

// Orders
export const getOrders = async () => {
  const response = await api.get("/ecommerce-orders");
  return response.data;
};

export const getOrderByOrderId = async (orderId: string | number) => {
  const response = await api.get(`/ecommerce-orders/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const response = await api.patch(`/ecommerce-orders/${id}/status`, status);
  return response.data;
};

export const updatePaymentStatus = async (id: string, paymentStatus: string) => {
  const response = await api.patch(`/ecommerce-orders/${id}/payment-status`, paymentStatus);
  return response.data;
};

// Shipment
export const getShipments = async () => {
  const response = await api.get('/shipments');
  return response.data;
};

export const getShipmentsByStatus = async (status: string) => {
  const params = new URLSearchParams();
  params.append('status', status);
  const response = await api.get(`/shipments/by-status?${params.toString()}`);
  return response.data;
};

export const getShipmentsByShipmentNo = async (shipmentNo: string) => {
  const res = await api.get(`/shipments/detail/by-shipmentNo/${shipmentNo}`);
  return res.data;
}

export const updateShipmentStatus = async (id: string, status: string) => {
  const res = await api.patch(`/shipments/${id}/status`, {status});
  return res.data;
}

export const updateShipment = async (id: string, payload: any) => {
  const res = await api.patch(`/shipments/${id}`, payload);
  return res.data;
}