import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import TopNavbar from '../components/Layout/TopNavbar';
import MetricCard from '../components/Dashboard/MetricCard';
import DashboardCharts from '../components/Dashboard/DashboardCharts';
import { metricsData, chartsData } from '../data/dashboard';

const Dashboard: React.FC = () => {
  const metrics = metricsData;
  const charts = chartsData;
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <Box>
      {/* Header with Page Title and Search */}
      <TopNavbar 
        pageTitle="Dashboard"
        pageSubtitle="Overview"
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
      />

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
  );
};

export default Dashboard;