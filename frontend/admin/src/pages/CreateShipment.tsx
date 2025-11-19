import { useState } from 'react';
import { Box, Card, Typography } from '@mui/material';
import { toast } from 'sonner';
import TopNavbar from '../components/Layout/TopNavbar';
import SearchCustomer from '../components/Shipments/Create/SearchCustomer';
import { getUserBySuiteNo } from '../services/api.services';

const CreateShipment = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [loading, setLoading] = useState<any>(null);

  const handleSearchCustomer = async (suiteNo: string) => {
    setLoading(true);
    setSelectedCustomer(null);

    try {
      const customer = await getUserBySuiteNo(suiteNo);
      setSelectedCustomer(customer)
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("User not found!");
    } finally {
      setLoading(false)
    }
  };

  return (
    <Box>
      <TopNavbar pageTitle="Shipments" pageSubtitle="Create" />

      <Box display="flex" px={2} mt={2}>
        <Box width="50%" pr={2}>
            <Card sx={{ p: 2 }}>
                <SearchCustomer onSearch={handleSearchCustomer} loading={loading} />

                <Box mt={2}>
                    {selectedCustomer ? (
                        <Typography variant='body1'>
                            Selected: {selectedCustomer.name} (Suite {selectedCustomer.suite})
                        </Typography>
                    ) : (
                        <Typography variant='body2'>Search customer</Typography>
                    )}
                </Box>
            </Card>
        </Box>

        <Box width="50%" pl={2}></Box>
      </Box>
    </Box>
  );
};

export default CreateShipment;