import React, { useState } from 'react';
import PageHeader from '../components/shared/PageHeader';
import CurrenciesList from '../components/settings/CurrenciesList';
import AddCurrencyDialog from '../components/settings/AddCurrencyDialog';
import { toast } from 'sonner';

const CurrenciesPage: React.FC = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSaveCurrency = (currency: { name: string; code: string; symbol: string }) => {
    console.log('Saving currency:', currency);
    toast.success(`Currency "${currency.name}" has been added successfully!`);
  };

  return (
    <>
      <PageHeader
        title="Currencies"
        buttonText="Add Currency"
        onButtonClick={handleOpenDialog}
      />
      <CurrenciesList />
      <AddCurrencyDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveCurrency}
      />
    </>
  );
};

export default CurrenciesPage;