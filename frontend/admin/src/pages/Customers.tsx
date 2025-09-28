import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

import TopNavbar from '../components/Layout/TopNavbar';
import CustomerFilters from '../components/Customers/CustomerFilters';
import CustomerTable from '../components/Customers/CustomerTable';
import { getUsers } from '../services/api.services';
import type { User } from '../types';

const mapApiUserToCustomer = (user: User): User => ({
  suiteNo: user.suite_no,
  name: user.name,
  id: user.id,
  email: user.email,
  isEmailVerified: user.email_verified,
  emailVerifiedOn: user.email_verified ? new Date(user.updated_at).toLocaleDateString() : 'Pending',
  phone: user.phone_number || '—',
  identifier: user.identifier,
  isVerified: user.verified,
  isActive: true,
  gender: user.gender || null,
  dob: user.dob
    ? new Date(user.dob).toISOString().split('T')[0]
    : null,
});

const Customers = () => {
  const [allCustomers, setAllCustomers] = useState<User[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const allUsers = await getUsers();
      const users = allUsers.filter((user: User) => user.role === "user")
      const mappedCustomers = users.map(mapApiUserToCustomer);
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

      <CustomerFilters customers={allCustomers} onFilter={setFilteredCustomers} />

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