import React from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';

export interface PageTab {
  label: string;
  value: string;
  path: string;
}

export interface PageNavigationProps {
  tabs: PageTab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  title: string;
  subtitle?: string;
}

const PageNavigation: React.FC<PageNavigationProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  title, 
  subtitle 
}) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    onTabChange(newValue);
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Page Title and Subtitle */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleChange} sx={{'& .MuiTab-root': {textTransform: 'none', fontWeight: 500, fontSize: '0.875rem', minHeight: 48,color: '#64748b', '&.Mui-selected': { color: '#6366f1', fontWeight: 600 } }, '& .MuiTabs-indicator': { backgroundColor: '#6366f1', height: 3 } }}>
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} sx={{ px: 3 }}/>
          ))}
        </Tabs>
      </Box>
    </Box>
  );
};

export default PageNavigation;
