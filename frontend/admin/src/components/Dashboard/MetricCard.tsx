import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

export interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  icon: React.ReactNode;
  bgColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, color, icon, bgColor }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color}}>
          {icon}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: color, mb: 0.5 }}>
        {value}
      </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
        View →
      </Typography>
      <Box />
    </CardContent>
  </Card>
);

export default MetricCard;


