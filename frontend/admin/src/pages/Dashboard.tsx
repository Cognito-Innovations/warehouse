import React from 'react';
import { Box, Grid } from '@mui/material';

import MetricCard from '../components/Dashboard/MetricCard';
import DashboardCharts from '../components/Dashboard/DashboardCharts';
import TopNavbar from '../components/Layout/TopNavbar';

import { metricsData, chartsData } from '../data/dashboard';


interface DashboardProps {
  onToggleSidebar: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onToggleSidebar }) => {
  const metrics = metricsData;
  const charts = chartsData;

  return (
    <Box>
      {/* Header */}
      <TopNavbar title="Dashboard" onToggleSidebar={onToggleSidebar} />

      {/* Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid size={{ xs: 12, sm:6, md: 4, lg:3}} key={index}>
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