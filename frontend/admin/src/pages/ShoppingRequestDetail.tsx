import React, { useCallback, useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { getShoppingRequestByCode, updateProduct } from '../services/api.services.ts';
import TopNavbar from '../components/Layout/TopNavbar';
import RequestDetailContent from '../components/ShoppingRequests/Detail/RequestDetailContent.tsx';
import RequestDetailCard from '../components/ShoppingRequests/Detail/RequestDetailCard.tsx';
import type { ShoppingRequestProduct } from '../types.ts';

const ShoppingRequestDetail: React.FC = () => {
  const { id } = useParams();
  const [shoppingRequest, setShoppingRequest] = useState<any | null>(null); //TODO P0: Resolve these typescript errors
  const [products, setProducts] = useState<ShoppingRequestProduct[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchRequest = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  const handleItemUpdate = async (itemId: string, updates: Partial<ShoppingRequestProduct>) => {
    const originalProducts = products;

    const updatedProducts = applyProductUpdate(products, itemId, updates);

    if (!updatedProducts) {
      console.error("Product not found for update!");
      return;
    }

    setProducts(updatedProducts);

    const updatedProduct = updatedProducts.find(p => p.id === itemId)!;

    try {
      await persistProductUpdate(updatedProduct, updates);
      toast.success("Item updated successfully!");
    } catch (error) {
      console.error("Failed to update item:", error);
      toast.error("Failed to update item.");
      setProducts(originalProducts);
    }
  };

  const applyProductUpdate = (
    products: ShoppingRequestProduct[],
    itemId: string,
    updates: Partial<ShoppingRequestProduct>
  ) => {
    const index = products.findIndex(p => p.id === itemId);
    if (index === -1) return null;

    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      ...updates,
    };

    return updatedProducts;
  };

  const persistProductUpdate = async (
    product: ShoppingRequestProduct,
    updates: Partial<ShoppingRequestProduct>
  ) => {
    const unitPrice = updates.unit_price === null ? 0 : updates.unit_price;

    await updateProduct(
      product.id,
      unitPrice,
      updates.available,
      updates.currency
    );
  };

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
        selectedItemIds={selectedItemIds}
      />
    </Box>
  );
};

export default ShoppingRequestDetail;