import React, { useState } from 'react';
import { toast } from 'sonner';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import { addPackageItem, deletePackageItem, updatePackageItem } from '../../services/api.services';
import PackageItemsTable, { type PackageItem } from './PackageItemsTable';
import EmptyPackageItemsState from './EmptyPackageItemsState';
import AddItemModal from './AddItemModal';

interface PackageItemsSectionProps {
  id: string;
  packageItems: PackageItem[];
  setPackageItems: React.Dispatch<React.SetStateAction<PackageItem[]>>;
  isDiscarded: boolean;
}

const PackageItemsSection: React.FC<PackageItemsSectionProps> = ({
  id,
  packageItems,
  setPackageItems,
  isDiscarded,
}) => {
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PackageItem | null>(null);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const initialItem = {
    name: '',
    quantity: 0,
    amount: '',
    total: ''
  };
  const [newItem, setNewItem] = useState(initialItem);

  const handleOpenAddItemModal = () => {
    setNewItem(initialItem);
    setEditingItem(null);
    setAddItemModalOpen(true);
  };

  const handleCloseAddItemModal = () => {
    setAddItemModalOpen(false);
    setEditingItem(null);
    setNewItem(initialItem);
  };

  const handleEditItem = (item: PackageItem) => {
    setEditingItem(item);
    setNewItem({ ...item });
    setAddItemModalOpen(true);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  const handleDeleteItem = async (itemId: string) => {
    if (!id) return;
    setDeletingItemId(itemId);
    try {
      await sleep(2000);
      await deletePackageItem(id, itemId);
      setPackageItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Item deleted successfully!');
    } catch (err) {
      console.error('Failed to delete item:', err);
      toast.error('Failed to delete item.');
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleSaveItem = async () => {
    if (!id) return;

    const amountRegex = /^\d{1,10}(\.\d{1,2})?$/;
    if (!newItem.amount || !amountRegex.test(newItem.amount.toString())) {
      toast.error("Amount must be a valid number (e.g., 123.45) with up to 10 digits before the decimal.");
      return;
    }

    setIsSavingItem(true);
    try {
      const itemData = {
        name: newItem.name,
        quantity: newItem.quantity,
        unit_price: parseFloat(newItem.amount.replace('$', '')) || 0,
        total_price: parseFloat(newItem.total.replace('$', '')) || 0
      };

      if (editingItem) {
        const updatedItem = await updatePackageItem(id, editingItem.id, itemData);
        setPackageItems(prev => prev.map(item =>
          item.id === editingItem.id 
          ? { 
            ...item, 
            name: updatedItem.name,
            quantity: updatedItem.quantity,
            amount: updatedItem.unit_price.toFixed(2),
            total: updatedItem.total_price.toFixed(2),
            unit_price: updatedItem.unit_price,
            total_price: updatedItem.total_price
          } : item
        ));
        toast.success('Item updated successfully!');
      } else {
        const addedItem = await addPackageItem(id, itemData);
        const newItemForState = { 
          id: addedItem.id,
          name: addedItem.name,
          quantity: addedItem.quantity,
          amount: addedItem.unit_price.toFixed(2),
          total: addedItem.total_price.toFixed(2),
          unit_price: addedItem.unit_price,
          total_price: addedItem.total_price
        };
        setPackageItems(prev => [...prev, newItemForState]);
        toast.success('Item added successfully!');
      }
      handleCloseAddItemModal();
    } catch (err) {
      console.error('Failed to save item:', err);
      toast.error('Failed to save item.');
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleItemInputChange = (field: string, value: string | number) => {
    setNewItem(prev => {
      let updated = { ...prev, [field]: value };

      if (field === 'amount') {
        const sanitizedValue = value.toString().replace(/[^0-9.]/g, ''); // Allow only numbers and one dot
        const parts = sanitizedValue.split('.');

        // Limit to 10 digits before the decimal and 2 after
        const integerPart = parts[0].slice(0, 10); 
        const decimalPart = parts[1] ? parts[1].slice(0, 2) : '';

        let finalValue = integerPart;
        if (parts.length > 1) {
          finalValue += '.' + decimalPart;
        }

        updated = { ...prev, amount: finalValue };
      }

      const quantity = (field === 'quantity' ? Number(value) : prev.quantity) || 1;
      const amount = (field === 'amount' ? updated.amount : prev.amount) || '0';
      const amountValue = parseFloat(amount.toString().replace('$', '')) || 0;
      updated.total = `$${(quantity * amountValue).toFixed(2)}`;
      return updated;
    });
  };
  
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
            Package Items
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
              onClick={handleOpenAddItemModal}
              disabled={isDiscarded}
              sx={{
                bgcolor: '#3b82f6',
                '&:hover': { bgcolor: '#2563eb' },
                textTransform: 'none',
                borderRadius: 1,
                px: 2,
                py: 1
              }}
            >
              Add Item
            </Button>
          </Box>
        </Box>

        {packageItems && packageItems.length > 0 ? (
          <PackageItemsTable 
            items={packageItems}
            isDiscarded={isDiscarded}
            deletingItemId={deletingItemId}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        ) : (
          <EmptyPackageItemsState />
        )}
      </Box>

      <AddItemModal
        open={addItemModalOpen}
        editingItem={editingItem}
        newItem={newItem}
        onClose={handleCloseAddItemModal}
        onSave={handleSaveItem}
        onInputChange={handleItemInputChange}
        loading={isSavingItem}
      />
    </>
  );
};

export default PackageItemsSection;
