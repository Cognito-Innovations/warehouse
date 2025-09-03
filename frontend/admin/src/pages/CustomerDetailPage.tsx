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
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} md={7}>
            <CustomerStats />
          </Grid>
          <Grid item xs={12} md={5} sx={{ pl: 75 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 3 }}>
              <CustomerAddressList />
              <CustomerDocuments />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CustomerDetailPage;