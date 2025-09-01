import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, Box, Typography, Tooltip } from '@mui/material';

export interface menuItems{
  text: string;
  icon: React.ElementType;
  path: string;
}

export interface SidebarProps {
  logo: string;
  menuItems: menuItems[];
}

const Sidebar: React.FC<SidebarProps> = ({ logo, menuItems }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const drawerWidth = 72; // Always closed, showing only icons

  return (
    <Box sx={{ 
      width: drawerWidth, 
      flexShrink: 0,
      bgcolor: '#fff', 
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 64 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: 32, height: 32, bgcolor: '#6366f1', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              {logo || "S"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Menu Items */}
      <List sx={{ px: 1, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const MenuItemComponent = (
            <ListItemButton onClick={() => navigate(item.path)} sx={{ borderRadius: 2, bgcolor: isActive ? '#f1f5f9' : 'transparent', color: isActive ? '#6366f1' : '#64748b', minHeight: 48, justifyContent: 'center', px: 1.5, '&:hover': { bgcolor: '#f8fafc' } }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 'auto', justifyContent: 'center' }}>
                <item.icon fontSize="small" />
              </ListItemIcon>
            </ListItemButton>
          );
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              
              <Tooltip title={item.text} placement="right">
                {MenuItemComponent}
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;