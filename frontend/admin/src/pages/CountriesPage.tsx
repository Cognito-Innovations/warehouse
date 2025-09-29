import React, { useState, useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { toast } from 'sonner';

import PageHeader from '../components/shared/PageHeader';
import CountriesList from '../components/settings/CountriesList';
import AddEditCountryDialog from '../components/settings/AddEditCountryDialog';
import { getCountries, createCountry, updateCountry } from '../services/api.services';
import type { Country, CreateCountryPayload } from '../types';

const CountriesPage: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

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

  const handleOpenAddDialog = () => {
    setEditingCountry(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (country: Country) => {
    setEditingCountry(country);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSaveCountry = async (formData: CreateCountryPayload) => {
    setSaving(true);
    const action = editingCountry ? 'update' : 'add';
    try {
      if (editingCountry) {
        await updateCountry(editingCountry.id, {
          name: formData.name, 
          code: formData.code, 
          phone_code: formData.phone_code, 
          image: formData.image 
        });
        setCountries(
          countries.map((c) =>
            c.id === editingCountry.id
              ? { ...c, ...formData }
              : c
          )
        );
      } else {
        const newCountry = await createCountry(formData);
        setCountries([newCountry, ...countries]);
      }
      toast.success(`Country "${formData.name}" ${action === 'add' ? 'added' : 'updated'} successfully!`);
      handleCloseDialog();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${action} country`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="Countries" buttonText="Add Country" onButtonClick={handleOpenAddDialog} />
      
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <CountriesList countries={countries} onEdit={handleOpenEditDialog} />
      )}

      <AddEditCountryDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveCountry}
        saving={saving}
        initialData={editingCountry}
      />
    </>
  );
};

export default CountriesPage;