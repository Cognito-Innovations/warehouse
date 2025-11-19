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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      if (id) {
        const data = await getUserBySuiteNo(id);
        setUser(data);
      }
    } catch (err) {
      setError('Failed to fetch user details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
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

  if (error || !user) {
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
      <TopNavbar pageTitle="Customers" pageSubtitle={`${user.name}`} />
      <Box>
        <CustomerHeader user={user} />
        <CustomerAddressList />
      </Box>
    </Box>
  );
};

export default CustomerDetailPage;