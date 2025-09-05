import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import TopNavbar from '../components/Layout/TopNavbar';
import { StatusCards, PackagesTable } from '../components/Packages';
import RegisterPackageModal from '../components/Modals/RegisterPackageModal';
import { getPackage } from '../services/api.services';

interface StatusCard {
  title: string;
  value: number;
  color: string;
  bgColor: string;
  icon: string;
  status: string;
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
      const statusCounts = packages.reduce((acc: any, pkg: any) => {
        const status = pkg.status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Create status cards with real data - only the 3 needed statuses
      const cards: StatusCard[] = [
        {
          title: 'Action Required',
          value: statusCounts['Action Required'] || 0,
          color: '#ef4444',
          bgColor: '#fee2e2',
          icon: 'WarningIcon',
          status: 'Action Required'
        },
        {
          title: 'In Review',
          value: statusCounts['In Review'] || 0,
          color: '#3b82f6',
          bgColor: '#dbeafe',
          icon: 'InfoIcon',
          status: 'In Review'
        },
        {
          title: 'Draft',
          value: statusCounts['Draft'] || 0,
          color: '#ec4899',
          bgColor: '#fce7f3',
          icon: 'InfoIcon',
          status: 'Draft'
        }
      ];

      setStatusCards(cards);
    } catch (error) {
      console.error('Failed to fetch status data:', error);
      // Fallback to empty cards
      setStatusCards([
        { title: 'Action Required', value: 0, color: '#ef4444', bgColor: '#fee2e2', icon: 'WarningIcon', status: 'Action Required' },
        { title: 'In Review', value: 0, color: '#3b82f6', bgColor: '#dbeafe', icon: 'InfoIcon', status: 'In Review' },
        { title: 'Draft', value: 0, color: '#ec4899', bgColor: '#fce7f3', icon: 'InfoIcon', status: 'Draft' }
      ]);
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