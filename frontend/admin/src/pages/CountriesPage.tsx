import React, { useState } from 'react';
import PageHeader from '../components/shared/PageHeader';
import CountriesList from '../components/settings/CountriesList';
import AddCountryDialog from '../components/settings/AddCountryDialog';
import { toast } from 'sonner';

const CountriesPage: React.FC = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSaveCountry = (country: { name: string; code: string }) => {
    console.log('Saving country:', country);
    toast.success(`Country "${country.name}" has been added successfully!`);
  };

  return (
    <>
      <PageHeader
        title="Countries"
        buttonText="Add Country"
        onButtonClick={handleOpenDialog}
      />
      <CountriesList />
      <AddCountryDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveCountry}
      />
    </>
  );
};

export default CountriesPage;