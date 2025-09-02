import React, { useState } from 'react';
import { Box } from '@mui/material';
import TopNavbar from '../components/Layout/TopNavbar';
import RegisterPackageModal from '../components/Modals/RegisterPackageModal';
import { StatusCards, PackagesTable } from '../components/Packages';

const Packages: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleRegisterPackage = () => {
    setOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };


  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%',
    }}>
      <TopNavbar 
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
      />

      <StatusCards onRegisterPackage={handleRegisterPackage} />
      <PackagesTable />

      <RegisterPackageModal open={open} onClose={() => setOpen(false)} />
    </Box>
  );
};

export default Packages;