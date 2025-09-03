import React, { useState } from 'react';
import { Box } from '@mui/material';

import TopNavbar from '../components/Layout/TopNavbar';
import StatusCards from '../components/Shipments/StatusCards';
import SearchFilters from '../components/Shipments/SearchFilters';
import ShipmentsTable from '../components/Shipments/ShipmentsTable';

const Shipments = () => {
  const [statusFilter, setStatusFilter] = useState<string>('All');

  return (
    <Box>
      <TopNavbar pageTitle="Shipments" pageSubtitle="All" />

      <StatusCards onSelectStatus={setStatusFilter} />

      <SearchFilters status={statusFilter} setStatus={setStatusFilter} />

      <ShipmentsTable status={statusFilter} />
    </Box>
  );
};

export default Shipments;