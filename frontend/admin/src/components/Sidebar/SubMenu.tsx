import React from 'react';
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import type { MenuItem } from '../../data/menuItems';

interface SubMenuProps {
  title: string;
  items: MenuItem[];
  level?: number;
}

const SubMenu: React.FC<SubMenuProps> = ({ title, items, level = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (item: MenuItem) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  const isActive = (item: MenuItem): boolean => {
    if (item.path) {
      return location.pathname === item.path;
    }
    return false;
  };

  const hasActiveChild = (item: MenuItem): boolean => {
    if (item.subMenu) {
      return item.subMenu.some(child => 
        isActive(child) || hasActiveChild(child)
      );
    }
    return false;
  };

  return (
    <Box sx={{ 
      width: 280, 
      bgcolor: '#fff', 
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative' // Make it relative to the main sidebar
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid #e2e8f0',
        bgcolor: '#f8fafc'
      }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 600, 
          color: '#1e293b',
          fontSize: '1.5rem'
        }}>
          {title}
        </Typography>
      </Box>

      {/* Menu Items */}
      <List sx={{ p: 0, flex: 1 }}>
        {items.map((item, index) => (
          <Box key={index}>
            <ListItemButton
              onClick={() => handleItemClick(item)}
              sx={{
                px: 3,
                py: 1.5,
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                bgcolor: isActive(item) ? '#f1f5f9' : 'transparent',
                color: isActive(item) ? '#6366f1' : '#64748b',
                '&:hover': {
                  bgcolor: isActive(item) ? '#f1f5f9' : '#f8fafc',
                },
                border: hasActiveChild(item) ? '1px solid #e2e8f0' : 'none',
              }}
            >
              <ListItemIcon sx={{ 
                color: 'inherit', 
                minWidth: 40,
                mr: 2
              }}>
                <item.icon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: isActive(item) ? 500 : 400,
                }}
              />
            </ListItemButton>
            
            {/* Render nested sub-menu if it exists and has active children */}
            {item.subMenu && hasActiveChild(item) && (
              <SubMenu 
                title={item.text} 
                items={item.subMenu} 
                level={level + 1}
              />
            )}
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default SubMenu;
