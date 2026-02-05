import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { getUsers } from '../services/api.services';
import TopNavbar from '../components/Layout/TopNavbar';
import CustomerFilters from '../components/Customers/CustomerFilters';
import CustomerTable from '../components/Customers/CustomerTable';
import type { User, Customer } from '../types';

//TOD0 P0: Remove these mapping logic
const mapApiUserToCustomer = (user: User): Customer => ({
  suite_no: user.suite_no,
  name: user.name,
  id: user.id,
  email: user.email,
  role: user.role,
  email_verified: user.email_verified,
  phone_number: user.phone_number || '—',
  identifier: user.identifier,
  verified: user.verified,
  is_active: true,
  gender: user.gender || null,
  dob: user.dob
    ? new Date(user.dob).toISOString().split('T')[0]
    : null,
});

const Customers = () => {
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const allUsers = await getUsers();
      const mappedCustomers = allUsers.map(mapApiUserToCustomer);
      setAllCustomers(mappedCustomers);
      setFilteredCustomers(mappedCustomers);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      setError("Failed to load customer data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <Box>
      <TopNavbar pageTitle="Customers" pageSubtitle="All" />

      <CustomerFilters users={allCustomers} onFilter={setFilteredCustomers} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
       <Typography color="error" sx={{ textAlign: 'center', my: 4 }}>{error}</Typography>
      ) : (
       <CustomerTable rows={filteredCustomers} />
      )}

    </Box>
  );
};

export default Customers;