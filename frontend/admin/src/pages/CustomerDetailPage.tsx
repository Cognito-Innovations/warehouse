import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

import TopNavbar from '../components/Layout/TopNavbar';
import CustomerHeader from '../components/Customers/CustomerHeader';
import CustomerAddressList from '../components/Customers/CustomerAddressList';
import { useEffect, useState } from 'react';
import type { User } from '../types';
import { getUserBySuiteNo } from '../services/api.services';

const CustomerDetailPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setError(null);
      if (id) {
        const data = await getUserBySuiteNo(id);
        setCustomer(data);
      }
    } catch (err) {
      setError('Failed to fetch customer details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !customer) {
    return (
      <Box>
        <TopNavbar pageTitle="Customers" pageSubtitle="/ Not Found" />
        <Typography sx={{ p: 3 }}>
          {error || 'Customer not found.'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <TopNavbar pageTitle="Customers" pageSubtitle={`${customer.name}`} />
      <Box>
        <CustomerHeader customer={customer} />
        <CustomerAddressList />
      </Box>
    </Box>
  );
};

export default CustomerDetailPage;