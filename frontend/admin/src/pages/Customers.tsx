import { useState } from 'react';
import { Box } from '@mui/material';
import { customers, type Customer } from '../data/customers';
import TopNavbar from '../components/Layout/TopNavbar';
import CustomerFilters from '../components/Customers/CustomerFilters';
import CustomerTable from '../components/Customers/CustomerTable';

const Customers = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers);

  return (
    <Box>
      <TopNavbar title="Customers" subtitle="/ All" onToggleSidebar={onToggleSidebar} />
      <CustomerFilters onFilter={setFilteredCustomers} />
      <CustomerTable rows={filteredCustomers} />
    </Box>
  );
};

export default Customers;