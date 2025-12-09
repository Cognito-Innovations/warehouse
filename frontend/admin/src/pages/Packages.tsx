import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import TopNavbar from '../components/Layout/TopNavbar';
import { StatusCards, PackagesTable } from '../components/Packages';
import RegisterPackageModal from '../components/Modals/RegisterPackageModal';
import { getPackage } from '../services/api.services';
import { PACKAGE_STATUS_CARDS } from '../utils/constants';

interface StatusCard {
  title: string;
  value: number;
  color: string;
  bgColor: string;
  icon: string;
  status: string;
}

interface Package {
  status?: {
    value?: string;
  };
}

const Packages: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [statusCards, setStatusCards] = useState<StatusCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRegisterPackage = () => {
    setOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleStatusClick = (status: string | null) => {
    setSelectedStatus(status);
  };

  const handlePackageCreated = () => {
    // Trigger refresh by updating the key
    setRefreshKey(prev => prev + 1);
    fetchStatusData();
  };

  const fetchStatusData = async () => {
    try {
      setLoading(true);
      const packages = await getPackage();
      
      // Count packages by status
      const statusCounts = packages.reduce<Record<string, number>>((acc, pkg: Package) => {
        const statusValue = pkg.status?.value || 'Unknown';
        acc[statusValue] = (acc[statusValue] || 0) + 1;
        return acc;
      }, {});

      // Create status cards with real data - only the 3 needed statuses
      const cards: StatusCard[] = PACKAGE_STATUS_CARDS.map(card => ({
        title: card.title,
        value: statusCounts[card.key] || 0,
        color: card.color,
        bgColor: card.bgColor,
        icon: card.icon,
        status: card.key
      }))

      setStatusCards(cards);
    } catch (error) {
      console.error('Failed to fetch status data:', error);
      // Fallback to empty cards
      setStatusCards(
        PACKAGE_STATUS_CARDS.map(card => ({
          title: card.title,
          value: 0,
          color: card.color,
          bgColor: card.bgColor,
          icon: card.icon,
          status: card.key,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusData();
  }, []);


  return (
    <Box sx={{ width: '100%', maxWidth: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column'}}>
      <TopNavbar 
        pageTitle="Packages"
        searchValue={searchValue} 
        onSearchChange={handleSearchChange}
        showSearchBar
      />
      <StatusCards 
        onRegisterPackage={handleRegisterPackage}
        statusCards={statusCards}
        selectedStatus={selectedStatus}
        onStatusClick={handleStatusClick}
        loading={loading}
      />
      <PackagesTable 
        key={refreshKey}
        selectedStatus={selectedStatus}
        searchValue={searchValue}
        onStatusChange={handleStatusClick}
      />
      <RegisterPackageModal 
        open={open} 
        onClose={() => setOpen(false)} 
        onPackageCreated={handlePackageCreated}
      />
    </Box>
  );
};

export default Packages;