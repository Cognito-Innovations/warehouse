import React, { useState, useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { toast } from 'sonner';

import PageHeader from '../components/shared/PageHeader';
import CouriersList from '../components/settings/CouriersList';
import AddEditCourierDialog from '../components/settings/AddEditCourierDialog';
import {
  getCouriers,
  createCourier,
  updateCourier,
  getCountries,
} from '../services/api.services';
import type { Country, Courier, CreateCourierPayload } from '../types';

const CouriersPage: React.FC = () => {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [countries, setCountries] = useState<Pick<Country, 'id' | 'name'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCourier, setEditingCourier] = useState<Courier | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [couriersData, countriesData] = await Promise.all([
        getCouriers(),
        getCountries(),
      ]);
      setCouriers(couriersData);
      setCountries(countriesData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch required data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddDialog = () => {
    setEditingCourier(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (courier: Courier) => {
    setEditingCourier(courier);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSaveCourier = async (formData: CreateCourierPayload) => {
    setSaving(true);
    const action = editingCourier ? 'update' : 'add';
    try {
      if (editingCourier) {
        await updateCourier(editingCourier.id, formData);
        setCouriers(couriers.map((courier) => 
            courier.id === editingCourier.id 
                ? { 
                    ...courier, 
                    ...formData, 
                    country_name: countries.find(country => country.id === formData.country_id)?.name || '' 
                  } 
                : courier
        ));
      } else {
        const newCourier = await createCourier(formData);
        const newCourierWithCountryName = {
          ...newCourier,
          country_name: countries.find(country => country.id === newCourier.country_id)?.name || '',
        };
        setCouriers([newCourierWithCountryName, ...couriers]);
      }
      toast.success(`Courier "${formData.name}" ${action === 'add' ? 'added' : 'updated'} successfully!`);
      handleCloseDialog();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${action} courier`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Couriers"
        buttonText="Add Courier"
        onButtonClick={handleOpenAddDialog}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <CouriersList couriers={couriers} onEdit={handleOpenEditDialog} />
      )}
      
      <AddEditCourierDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveCourier}
        saving={saving}
        initialData={editingCourier}
        countries={countries}
      />
    </>
  );
};

export default CouriersPage;