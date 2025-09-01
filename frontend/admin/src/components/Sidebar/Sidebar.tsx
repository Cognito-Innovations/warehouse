import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Tooltip } from '@mui/material';

export interface menuItems{
  text: string;
  icon: React.ElementType;
  path: string;
}

export interface SidebarProps {
  logo: string;
  name: string;
  menuItems: menuItems[];
  expanded: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ logo, name, menuItems, expanded }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const drawerWidth = expanded ? 240 : 72;

  return (
    <Drawer variant="permanent" sx={{width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#fff', borderRight: '1px solid #e2e8f0', transition: 'width 0.3s ease', overflowX: 'hidden' },}}>
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 64 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 32, height: 32, bgcolor: '#6366f1', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              {logo || "S"}
            </Typography>
          </Box>
          {expanded && (
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6366f1', whiteSpace: 'nowrap' }}>
              {name}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Menu Items */}
      <List sx={{ px: 1, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const MenuItemComponent = (
            <ListItemButton onClick={() => navigate(item.path)} sx={{ borderRadius: 2, bgcolor: isActive ? '#f1f5f9' : 'transparent', color: isActive ? '#6366f1' : '#64748b', minHeight: 48, justifyContent: expanded ? 'initial' : 'center', px: expanded ? 2 : 1.5, '&:hover': { bgcolor: '#f8fafc' } }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: expanded ? 40 : 'auto', justifyContent: 'center',}}>
                <item.icon fontSize="small" />
              </ListItemIcon>
              {expanded && (
                <ListItemText  primary={item.text}  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap' }} />
              )}
            </ListItemButton>
          );
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              {expanded ? ( MenuItemComponent ) : (
                <Tooltip title={item.text} placement="right">
                  {MenuItemComponent}
                </Tooltip>
              )}
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;