import React, { useState, useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';
import PageHeader from '../components/shared/PageHeader';
import CountriesList from '../components/settings/CountriesList';
import AddCountryDialog from '../components/settings/AddCountryDialog';
import { toast } from 'sonner';
import { createCountry, getCountries } from '../services/api.services';

const CountriesPage: React.FC = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const data = await getCountries();
      setCountries(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch countries');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSaveCountry = async (country: { name: string; code: string }) => {
    try {
      setSaving(true);
      await createCountry(country);
      toast.success(`Country "${country.name}" added successfully!`);
      setCountries((prev) => [...prev, country]);
      handleCloseDialog();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add country');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Countries"
        buttonText="Add Country"
        onButtonClick={handleOpenDialog}
      />
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <CountriesList countries={countries} />
      )}
      <AddCountryDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveCountry}
        saving={saving}
      />
    </>
  );
};

export default CountriesPage;
