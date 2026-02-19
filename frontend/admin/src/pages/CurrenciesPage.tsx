import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { toast } from 'sonner';

import { createCurrency, getCurrencies, updateCurrency } from '../services/api.services';
import PageHeader from '../components/shared/PageHeader';
import CurrenciesList from '../components/settings/CurrenciesList';
import AddEditCurrencyDialog from '../components/settings/AddEditCurrencyDialog';
import type { CreateCurrencyPayload, Currency } from '../types';

const CurrenciesPage: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      const data = await getCurrencies();
      setCurrencies(data);
    } catch (err) {
      toast.error('Failed to fetch currencies');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setEditingCurrency(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (currency: Currency) => {
    setEditingCurrency(currency);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSaveCurrency = async (formData: CreateCurrencyPayload) => {
    setSaving(true);
    const action = editingCurrency ? 'update' : 'add';

    try {
      let savedCurrency: Currency;

      if (editingCurrency) {
        savedCurrency = await updateCurrency(editingCurrency.id, formData);
      } else {
        savedCurrency = await createCurrency(formData);
      }

      upsertCurrency(savedCurrency);

      toast.success(`Currency ${action === 'add' ? 'added' : 'updated'} successfully!`);
      handleCloseDialog();
    } catch (err) {
      toast.error(`Failed to ${action} currency`);
    } finally {
      setSaving(false);
    }
  };

  const upsertCurrency = (currency: Currency) => {
    setCurrencies(prev => {
      const existingCurrency = prev.some(c => c.id === currency.id);

      if (existingCurrency) {
        return prev.map(c => (c.id === currency.id ? currency : c));
      }

      return [...prev, currency];
    });
  };

  return (
    <>
      <PageHeader title="Currencies" buttonText="Add Currency" onButtonClick={handleOpenAddDialog} />
      
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <CurrenciesList currencies={currencies} onEdit={handleOpenEditDialog} />
      )}

      <AddEditCurrencyDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveCurrency}
        saving={saving}
        initialData={editingCurrency}
      />
    </>
  );
};

export default CurrenciesPage;