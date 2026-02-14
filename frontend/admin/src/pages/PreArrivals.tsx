import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

import { getPreArrivals, markPreArrivalAsReceived } from '../services/api.services';
import TopNavbar from '../components/Layout/TopNavbar';
import FiltersSection from '../components/PreArrivals/FiltersSection';
import PreArrivalsTable from '../components/PreArrivals/PreArrivalsTable';
import PaginationSection from '../components/PreArrivals/PaginationSection';
import type { PreArrival } from '../types/PreArrival';

const PreArrivals: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(15);
  const [searchValue, setSearchValue] = useState('');
  const [preArrivals, setPreArrivals] = useState<PreArrival[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreArrivals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPreArrivals();
      
      if (Array.isArray(data)) {
        setPreArrivals(data);
      } else {
        console.error('API returned non-array data:', data);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pre-arrivals');
      console.error('Error fetching pre-arrivals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreArrivals();
  }, []);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleClearFilters = () => {
    setStatusFilter('All');
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleMarkAsReceive = async (itemToUpdate: PreArrival) => {
    try {
      const updatedItem = await markPreArrivalAsReceived(itemToUpdate.id);
      setPreArrivals(prev =>
        prev.map(item =>
          item.id === itemToUpdate.id ? updatedItem : item
        )
      );
    } catch (err) {
      console.error('Error marking as received:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark as received');
    }
  };

  const handleDelete = (itemToDelete: PreArrival) => {
    setPreArrivals(prev => prev.filter(item => item.id !== itemToDelete.id));
  };

  const handleReceive = async (itemToUpdate: PreArrival) => {
    try {
      const updatedItem = await markPreArrivalAsReceived(itemToUpdate.id);
      setPreArrivals(prev =>
        prev.map(item =>
          item.id === itemToUpdate.id ? updatedItem : item
        )
      );
    } catch (err) {
      console.error('Error marking as received:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark as received');
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const filteredData = statusFilter === 'All' ? preArrivals : preArrivals.filter(item => item.status.toLowerCase() === statusFilter.toLowerCase());
  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  if (loading) {
    return (
      <>
        <TopNavbar searchValue={searchValue} onSearchChange={handleSearchChange} />
        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            gap: 2,
          }}
        >
          <CircularProgress />
          <div>Loading pre-arrivals...</div>
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopNavbar searchValue={searchValue} onSearchChange={handleSearchChange} />
        <Box sx={{ width: '100%', maxWidth: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ color: 'red' }}>Error: {error}</div>
        </Box>
      </>
    );
  }

  return (
    <>
    <TopNavbar 
        pageTitle="Pre-Arrivals"
        pageSubtitle="All"
      /> 
      <Box sx={{ width: '100%', maxWidth: '100%' }}>
        <FiltersSection
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          onClearFilters={handleClearFilters}
        />

        <PreArrivalsTable
          data={paginatedData}
          onMarkAsReceive={handleMarkAsReceive}
          onDelete={handleDelete}
          onReceive={handleReceive}
        />

        <PaginationSection
          page={page}
          rowsPerPage={rowsPerPage}
          totalItems={preArrivals.length}
          filteredDataLength={filteredData.length}
          onPageChange={handlePageChange}
        />
      </Box>
    </>
  );
};

export default PreArrivals;
