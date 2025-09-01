import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';

export interface PageSidebarItem {
  label: string;
  value: string;
  path: string;
}

export interface PageSidebarProps {
  title: string;
  items: PageSidebarItem[];
  activeItem: string;
  onItemChange: (value: string) => void;
  expanded: boolean;
}

const PageSidebar: React.FC<PageSidebarProps> = ({ title, items, activeItem, onItemChange, expanded }) => {
  return (
    <Box sx={{
      width: expanded ? 240 : 0,
      minWidth: expanded ? 240 : 0,
      bgcolor: '#fff',
      borderRight: '1px solid #e2e8f0',
      height: '100vh',
      overflowY: 'auto',
      opacity: expanded ? 1 : 0,
      visibility: expanded ? 'visible' : 'hidden',
      transition: 'width 0.3s ease, opacity 0.3s ease, visibility 0.3s ease',
      boxShadow: expanded ? '2px 0 8px rgba(0,0,0,0.1)' : 'none',
      flexShrink: 0
    }}>
      {/* Page Title */}
      <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>
          {title}
        </Typography>
      </Box>

      {/* Navigation Items */}
      <List sx={{ p: 2 }}>
        {items.map((item) => {
          const isActive = activeItem === item.value;
          return (
            <ListItem key={item.value} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => onItemChange(item.value)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? '#f1f5f9' : 'transparent',
                  color: isActive ? '#6366f1' : '#64748b',
                  '&:hover': {
                    bgcolor: isActive ? '#f1f5f9' : '#f8fafc',
                  },
                  py: 1.5,
                  px: 2,
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default PageSidebar;
