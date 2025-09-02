import React, { useState } from 'react';
import { Box } from '@mui/material';
import TopNavbar from '../components/Layout/TopNavbar';
import { StatusCards, SearchFilters, PackagesTable } from '../components/Packages';
import RegisterPackageModal from '../components/RegisterPackageModal';

interface PackagesProps {
  onToggleSidebar: () => void;
}

const Packages: React.FC<PackagesProps> = ({ onToggleSidebar }) => {
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Action Required');

  const handleRegisterPackage = () => {
    setOpen(true);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleClearFilters = () => {
    setStatusFilter('Action Required');
  };

  return (
    <Box>
      {/* Header */}
      <TopNavbar title="Packages" subtitle="/ All" onToggleSidebar={onToggleSidebar} />

      {/* Status Cards */}
      <StatusCards onRegisterPackage={handleRegisterPackage} />

      {/* Search and Filters */}
      <SearchFilters
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Packages Table */}
      <PackagesTable />

      <RegisterPackageModal open={open} onClose={() => setOpen(false)} />
    </Box>
  );
};

export default Packages;