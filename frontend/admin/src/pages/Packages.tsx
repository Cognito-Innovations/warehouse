import React, { useState } from 'react';
import { Box } from '@mui/material';
import TopNavbar from '../components/Layout/TopNavbar';
import RegisterPackageModal from '../components/Modals/RegisterPackageModal';
import { StatusCards, PackagesTable } from '../components/Packages';
import PreArrivals from './PreArrivals';
import { useTabContext } from '../App';

const Packages: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { activeTab } = useTabContext();

  const handleRegisterPackage = () => {
    setOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const renderContent = () => {
    if (activeTab === 'pre-arrivals') {
      return <PreArrivals />;
    }
    return (
      <>
        <StatusCards onRegisterPackage={handleRegisterPackage} />
        <PackagesTable />
      </>
    );
  };

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%',
      // border: '3px solid green', // Debug border
      // backgroundColor: 'rgba(0,255,0,0.1)' // Debug background
    }}>
      {/* Header with Page Title and Search */}
      <TopNavbar 
        pageTitle={activeTab === 'pre-arrivals' ? 'Pre Arrivals' : 'Packages'}
        pageSubtitle={activeTab === 'pre-arrivals' ? 'Pre Arrivals / All' : 'All'}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
      />

      {/* Conditional Content */}
      {renderContent()}

      <RegisterPackageModal open={open} onClose={() => setOpen(false)} />
    </Box>
  );
};

export default Packages;