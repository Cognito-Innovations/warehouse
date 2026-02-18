import React, { useState, useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { toast } from 'sonner';

import {
  getCouriers,
  createCourier,
  updateCourier,
  getCountries,
} from '../services/api.services';
import PageHeader from '../components/shared/PageHeader';
import CouriersList from '../components/settings/CouriersList';
import AddEditCourierDialog from '../components/settings/AddEditCourierDialog';
import { PromiseStatus } from '../utils/constants';
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
      const results = await Promise.allSettled([
        getCouriers(),
        getCountries(),
      ]);
      
      if (results[0].status === PromiseStatus.Fulfilled) {
        setCouriers(results[0].value);
      } else {
        toast.error('Failed to fetch couriers');
      }
      if (results[1].status === PromiseStatus.Fulfilled) {
        setCountries(results[1].value);
      } else {
        toast.error('Failed to fetch countries');
      }
    } catch (err) {
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