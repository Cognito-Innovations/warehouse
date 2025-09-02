import React, { useState } from 'react';
import { List, Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import MenuItemComponent from './MenuItem';
import SubMenu from './SubMenu';
import type { MenuItem } from '../../data/menuItems';

export interface SidebarProps {
  logo: string;
  menuItems: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ logo, menuItems }) => {
  const drawerWidth = 72; // Always closed, showing only icons
  const [activeSubMenu, setActiveSubMenu] = useState<number | null>(null);
  const location = useLocation();

  const handleMenuItemClick = (index: number, item: MenuItem) => {
    if (item.subMenu) {
      setActiveSubMenu(activeSubMenu === index ? null : index);
    } else if (item.path) {
      setActiveSubMenu(null);
    }
  };

  // Check if a menu item should be active based on current path or defaultPath
  const isMenuItemActive = (item: MenuItem): boolean => {
    if (item.path && location.pathname === item.path) return true;
    if (item.defaultPath && location.pathname === item.defaultPath) return true;
    return false;
  };

  return (
    <Box sx={{ 
      display: 'flex',
      height: '100vh',
      bgcolor: '#fff',
      flexShrink: 0
    }}>
      {/* Main Sidebar */}
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
          {menuItems.map((item, index) => (
            <MenuItemComponent 
              key={`menu-item-${index}`} 
              item={item}
              isActive={activeSubMenu === index || isMenuItemActive(item)}
              onClick={() => handleMenuItemClick(index, item)}
            />
          ))}
        </List>
      </Box>

      {/* Sub Menu */}
      {activeSubMenu !== null && menuItems[activeSubMenu]?.subMenu && (
        <SubMenu 
          title={menuItems[activeSubMenu].text}
          items={menuItems[activeSubMenu].subMenu!}
        />
      )}
    </Box>
  );
};

export default Sidebar;