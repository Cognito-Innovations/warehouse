import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import PageHeader from '../components/shared/PageHeader';
import CurrenciesList from '../components/settings/CurrenciesList';
import AddCurrencyDialog from '../components/settings/AddCurrencyDialog';
import { toast } from 'sonner';
import { createCurrency, getCurrencies } from '../services/api.services';

const CurrenciesPage: React.FC = () => {
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      const data = await getCurrencies();
      setCurrencies(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch currencies');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSaveCurrency = async (currency: { country: string; currency_symbol: string; rate: number }) => {
    try {
      setSaving(true);
      await createCurrency(currency);
      toast.success('Currency added successfully!');
      await fetchCurrencies();
      handleCloseDialog();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add currency');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Currencies"
        buttonText="Add Currency"
        onButtonClick={handleOpenDialog}
      />
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <CurrenciesList currencies={currencies} />
      )}
      <AddCurrencyDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveCurrency}
        saving={saving}
      />
    </>
  );
};

export default CurrenciesPage;
