import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import { getShipments, getShipmentsByStatus } from '../services/api.services';
import TopNavbar from '../components/Layout/TopNavbar';
import StatusCards from '../components/Shipments/StatusCards';
import SearchFilters from '../components/Shipments/SearchFilters';
import ShipmentsTable from '../components/Shipments/ShipmentsTable';

const Shipments = () => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const fetchShipments = async (status?: string) => {
    setLoading(true);
    try {
      let data = [];
      if (status && status !== 'All') {
        data = await getShipmentsByStatus(status);
      } else {
        data = await getShipments();
      }
      setShipments(data);
    } catch (err) {
      console.error('Failed to fetch shipments:', err);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    fetchShipments(statusFilter);
  }, [statusFilter]);

  return (
    <Box>
      <TopNavbar pageTitle="Shipments" pageSubtitle="All" />

      <StatusCards
        shipments={shipments}
        onSelectStatus={setStatusFilter}
        currentStatus={statusFilter} 
      />

      <SearchFilters 
        status={statusFilter} 
        setStatus={setStatusFilter} 
        shipments={shipments}
        loading={loading}
      />

      <ShipmentsTable shipments={shipments} status={statusFilter} loading={loading} />
    </Box>
  );
};

export default Shipments;