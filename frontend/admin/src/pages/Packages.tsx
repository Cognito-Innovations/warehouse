import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import TopNavbar from '../components/Layout/TopNavbar';
import { StatusCards, PackagesTable } from '../components/Packages';
import RegisterPackageModal from '../components/Modals/RegisterPackageModal';
import { getPackage } from '../services/api.services';
import { PACKAGE_STATUS_CARDS } from '../utils/constants';
import type { StatusCard } from '../types';

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
      const statusCounts = getPackageStatusCounts(packages);
      const cards = buildStatusCards(statusCounts);

      setStatusCards(cards);
    } catch (error) {
      // Fallback to empty cards
      setStatusCards(getEmptyStatusCards());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusData();
  }, []);

  const getPackageStatusCounts = (packages: Package[]): Record<string, number> => {
    return packages.reduce<Record<string, number>>((counts, pkg) => {
      const status = pkg.status?.value ?? 'Unknown';
      counts[status] = (counts[status] ?? 0) + 1;
      return counts;
    }, {});
  };

  const buildStatusCards = (statusCounts: Record<string, number>): StatusCard[] => {
    return PACKAGE_STATUS_CARDS.map(card => ({
      title: card.title,
      value: statusCounts[card.key] ?? 0,
      color: card.color,
      bgColor: card.bgColor,
      icon: card.icon,
      status: card.key,
    }));
  };

  const getEmptyStatusCards = (): StatusCard[] =>
    PACKAGE_STATUS_CARDS.map(card => ({
      title: card.title,
      value: 0,
      color: card.color,
      bgColor: card.bgColor,
      icon: card.icon,
      status: card.key,
    }));

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