import { useParams } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';

import TopNavbar from '../components/Layout/TopNavbar';
import CustomerHeader from '../components/Customers/CustomerHeader';
import CustomerStats from '../components/Customers/CustomerStats';
import CustomerAddressList from '../components/Customers/CustomerAddressList';
import CustomerDocuments from '../components/Customers/CustomerDocuments';
import { customers } from '../data/customers';

const CustomerDetailPage = () => {
  const { id } = useParams();
  const customer = customers.find(c => c.suiteNo === id);

  if (!customer) {
    return (
      <Box>
        <TopNavbar pageTitle="Customers" pageSubtitle="/ Not Found" />
        <Typography sx={{ p: 3 }}>Customer not found.</Typography>
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