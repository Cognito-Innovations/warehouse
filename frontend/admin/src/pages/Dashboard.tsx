import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';

import { getDashboardMetrics } from '../services/api.services';
import TopNavbar from '../components/Layout/TopNavbar';
import MetricCard, { type MetricCardProps } from '../components/Dashboard/MetricCard';
import DashboardCharts from '../components/Dashboard/DashboardCharts';
import { metricsConfig, chartsData } from '../data/dashboard';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const charts = chartsData;
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const fetchedMetrics = await getDashboardMetrics();

      const metricKeys = [
        'customers',
        'activePackages',
        'actionRequiredPackages',
        'shipRequestShipments',
        'paymentPendingShipments',
        'paymentApprovalShipments',
        'readyToShipShipments',
        'shippedShipments',
        'pickupRequested',
        'shoppingRequested',
        'quotationConfirm',
        'assistPaymentApproval',
      ] as const;

      const updatedMetrics = metricsConfig.map((config, index) => ({
        ...config,
        value: fetchedMetrics[metricKeys[index]].toString(),
      }));

      setMetrics(updatedMetrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopNavbar 
        pageTitle="Dashboard"
        pageSubtitle="Overview"
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
      />

      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Loading Dashboard...
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, p: 3 }}>
          {/* Metrics Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {metrics.map((metric, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                <MetricCard {...metric} />
              </Grid>
            ))}
          </Grid>

          {/* Charts */}
          <DashboardCharts charts={charts} />
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;