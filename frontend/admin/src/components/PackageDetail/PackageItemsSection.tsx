import React, { useState } from 'react';
import { toast } from 'sonner';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { addPackageItem, deletePackageItem, updatePackageItem } from '../../services/api.services';
import AddItemModal from './AddItemModal';

interface PackageItem {
  id: string;
  name: string;
  quantity: number;
  amount: string;
  total: string;
  unit_price: number;
  total_price: number;
}

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
          //TODO: Below code should be moved to a separate component
          <TableContainer sx={{bgcolor: "#ffffff", borderRadius: 2}}>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.875rem' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.875rem' }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.875rem' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.875rem' }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.875rem' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {packageItems.map((item) => {
                  const isDeleting = deletingItemId === item.id;

                  return (
                    <TableRow key={item.id}>
                      <TableCell sx={{ color: '#1e293b', fontSize: '0.875rem' }} style={{ textTransform: 'capitalize' }}>{item.name}</TableCell>
                      <TableCell sx={{ color: '#1e293b', fontSize: '0.875rem' }}>{item.quantity}</TableCell>
                      <TableCell sx={{ color: '#1e293b', fontSize: '0.875rem' }}>${item.amount || item.unit_price}</TableCell>
                      <TableCell sx={{ color: '#1e293b', fontSize: '0.875rem' }}>${item.total || item.total_price}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditItem(item)}
                            disabled={isDiscarded || isDeleting}
                            sx={{
                              bgcolor: '#3b82f6',
                              color: 'white',
                              width: 32,
                              height: 32,
                              '&:hover': { bgcolor: '#2563eb' }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={isDiscarded || isDeleting} 
                            sx={{
                              bgcolor: '#f97316',
                              color: 'white',
                              width: 32,
                              height: 32,
                              '&:hover': { bgcolor: '#ea580c' }
                            }}
                          >
                            {isDeleting ? (
                              <CircularProgress size={20} sx={{ color: 'inherit' }} />
                            ) : (
                              <DeleteIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          //TODO: Below code should be moved to a separate component
          <Box sx={{ 
            p: 4, 
            textAlign: 'center', 
            bgcolor: '#f8fafc', 
            borderRadius: 2, 
            border: '1px solid #e2e8f0' 
          }}>
            <Typography variant="body1" sx={{ color: '#64748b', mb: 2 }}>
              No package items added yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Click "Add Item" to start adding products to this package
            </Typography>
          </Box>
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
