import React, { useState, useEffect } from 'react';
import TopNavbar from '../components/Layout/TopNavbar';
import { Box } from '@mui/material';
import type { PreArrival } from '../types/PreArrival';
import { getPreArrivals, markPreArrivalAsReceived } from '../services/api.services';

// Import extracted components
import FiltersSection from '../components/PreArrivals/FiltersSection';
import PreArrivalsTable from '../components/PreArrivals/PreArrivalsTable';
import ReceiveModal from '../components/PreArrivals/ReceiveModal';
import ActionsMenu from '../components/PreArrivals/ActionsMenu';
import PaginationSection from '../components/PreArrivals/PaginationSection';

const PreArrivals: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(15);
  const [selectedItem, setSelectedItem] = useState<PreArrival | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRowItem, setSelectedRowItem] = useState<PreArrival | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [preArrivals, setPreArrivals] = useState<PreArrival[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pre-arrivals data on component mount
  useEffect(() => {
    const fetchPreArrivals = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPreArrivals();
        console.log('API Response:', data);
        console.log('Data type:', typeof data);
        console.log('Is array:', Array.isArray(data));
        
        // Ensure we have an array
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

  const handleEyeClick = (item: PreArrival) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleThreeDotsClick = (event: React.MouseEvent<HTMLElement>, item: PreArrival) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowItem(item);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRowItem(null);
  };

  const handleMarkAsReceive = async () => {
    if (selectedRowItem) {
      try {
        const updatedItem = await markPreArrivalAsReceived(selectedRowItem.id);
        setPreArrivals(prev =>
          prev.map(item =>
            item.id === selectedRowItem.id ? updatedItem : item
          )
        );
        handleCloseMenu();
      } catch (err) {
        console.error('Error marking as received:', err);
        setError(err instanceof Error ? err.message : 'Failed to mark as received');
      }
    }
  };

  const handleDelete = () => {
    if (selectedRowItem) {
      setPreArrivals(prev => prev.filter(item => item.id !== selectedRowItem.id));
      handleCloseMenu();
    }
  };

  const handleReceive = async () => {
    if (selectedItem) {
      try {
        const updatedItem = await markPreArrivalAsReceived(selectedItem.id);
        setPreArrivals(prev =>
          prev.map(item =>
            item.id === selectedItem.id ? updatedItem : item
          )
        );
        handleCloseModal();
      } catch (err) {
        console.error('Error marking as received:', err);
        setError(err instanceof Error ? err.message : 'Failed to mark as received');
      }
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const filteredData = statusFilter === 'All' ? preArrivals : preArrivals.filter(item => item.status.toLowerCase() === statusFilter.toLowerCase());
  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Show loading state
  if (loading) {
    return (
      <>
        <TopNavbar searchValue={searchValue} onSearchChange={handleSearchChange} />
        <Box sx={{ width: '100%', maxWidth: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div>Loading pre-arrivals...</div>
        </Box>
      </>
    );
  }

  // Show error state
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
        {/* Filters */}
        <FiltersSection
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Table */}
        <PreArrivalsTable
          data={paginatedData}
          onEyeClick={handleEyeClick}
          onThreeDotsClick={handleThreeDotsClick}
        />

        {/* Pagination */}
        <PaginationSection
          page={page}
          rowsPerPage={rowsPerPage}
          totalItems={preArrivals.length}
          filteredDataLength={filteredData.length}
          onPageChange={handlePageChange}
        />

        {/* Customer Details Modal */}
        <ReceiveModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedItem={selectedItem}
          onReceive={handleReceive}
        />

        {/* Three Dots Menu */}
        <ActionsMenu
          anchorEl={anchorEl}
          onClose={handleCloseMenu}
          selectedRowItem={selectedRowItem}
          onMarkAsReceive={handleMarkAsReceive}
          onDelete={handleDelete}
        />
      </Box>
    </>
  );
};

export default PreArrivals;
