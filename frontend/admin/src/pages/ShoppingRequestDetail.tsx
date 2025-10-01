import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { getShoppingRequestByCode, updateProduct } from '../services/api.services.ts';
import TopNavbar from '../components/Layout/TopNavbar';
import RequestDetailContent from '../components/ShoppingRequests/Detail/RequestDetailContent.tsx';
import RequestDetailCard from '../components/ShoppingRequests/Detail/RequestDetailCard.tsx';

interface ShoppingRequestProduct {
  id?: string;
  name?: string;
  quantity: number;
  unit_price?: number | null;
  currency?: string;
  available?: boolean;
  [key: string]: any;
}

const ShoppingRequestDetail: React.FC = () => {
  const { id } = useParams();
  const [shoppingRequest, setShoppingRequest] = useState<any | null>(null);
  const [products, setProducts] = useState<ShoppingRequestProduct[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchRequest = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getShoppingRequestByCode(id);
      setShoppingRequest(data);
      setProducts(data.shopping_request_products ?? []);
      setSelectedItemIds(new Set());
    } catch (err) {
      console.error("Error fetching shopping request:", err);
      toast.error("Failed to fetch shopping request details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const handleItemUpdate = async (itemId: string, updates: Partial<ShoppingRequestProduct>) => {
    const originalProducts = [...products];

    const productIndex = products.findIndex(p => p.id === itemId);
    if (productIndex === -1) {
      console.error("Product not found for update!");
      return;
    }

    const updatedProducts = [...products];
    const productToUpdate = { ...updatedProducts[productIndex], ...updates };
    updatedProducts[productIndex] = productToUpdate;
    setProducts(updatedProducts);

    if (productToUpdate.id) {
      const unitPrice = updates.unit_price === null ? 0 : updates.unit_price;
      try {
        await updateProduct(productToUpdate.id, unitPrice, updates.available, updates.currency);
        toast.success("Item updated successfully!");
      } catch (error) {
        console.error("Failed to update item:", error);
        toast.error("Failed to update item.");
        setProducts(originalProducts);
      }
    }
  }

  const handleSelectionChange = (itemId: string, isSelected: boolean) => {
    setSelectedItemIds(previousSelectedIds => {
      const updatedSelectedIds = new Set(previousSelectedIds);
      if (isSelected) {
        updatedSelectedIds.add(itemId);
      } else {
        updatedSelectedIds.delete(itemId);
      }
      return updatedSelectedIds;
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 1 }}>
        <TopNavbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <TopNavbar pageTitle="Shopping Request" pageSubtitle="All" />

      <RequestDetailCard
        request={shoppingRequest}
        onStatusUpdated={fetchRequest}
        products={products}
        selectedItemIds={selectedItemIds}
      />

      <RequestDetailContent
        request={{ ...shoppingRequest, shopping_request_products: products }}
        onStatusUpdated={fetchRequest}
        onItemUpdate={handleItemUpdate}
        onSelectionChange={handleSelectionChange}
      />
    </Box>
  );
};

export default ShoppingRequestDetail;