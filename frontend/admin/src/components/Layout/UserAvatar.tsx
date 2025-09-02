import React, { useState, useRef } from 'react';
import { 
  Box, 
  Avatar, 
  IconButton, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Divider,
  ClickAwayListener,
  Typography
  } from '@mui/material';
import { 
  Person as PersonIcon, 
  Settings as SettingsIcon, 
  Logout as LogoutIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';

interface UserAvatarProps {
  userName?: string;
  userEmail?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  userName = "User Name",
  userEmail = "user@example.com"
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const handleAvatarClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickAway = () => {
    setMenuOpen(false);
  };

  const handleMenuAction = (action: string) => {
    console.log(`Action: ${action}`);
    setMenuOpen(false);
    // Handle different actions here
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
        <Avatar sx={{ bgcolor: '#64748b', width: 32, height: 32 }}></Avatar>
      </IconButton>
      
      {/* User Menu Dropdown */}
      {menuOpen && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper 
            ref={avatarRef} 
            sx={{ 
              position: 'absolute', 
              top: '100%', 
              right: 0, 
              mt: 1, 
              width: 280, 
              zIndex: 1000, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
              border: '1px solid #e2e8f0'
            }}
          >
            {/* User Info Header */}
            <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#6366f1', width: 48, height: 48 }}>
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {userName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {userEmail}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {/* Menu Items */}
            <List sx={{ p: 0 }}>
              <ListItem 
                sx={{ px: 2, py: 1.5, '&:hover': { bgcolor: '#f8fafc' }, cursor: 'pointer' }}
                onClick={() => handleMenuAction('profile')}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <PersonIcon sx={{ color: '#64748b' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Profile" 
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItem>
              
              <ListItem 
                sx={{ px: 2, py: 1.5, '&:hover': { bgcolor: '#f8fafc' }, cursor: 'pointer' }}
                onClick={() => handleMenuAction('account')}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <AccountIcon sx={{ color: '#64748b' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Account Settings" 
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItem>
              
              <ListItem 
                sx={{ px: 2, py: 1.5, '&:hover': { bgcolor: '#f8fafc' }, cursor: 'pointer' }}
                onClick={() => handleMenuAction('settings')}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <SettingsIcon sx={{ color: '#64748b' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Preferences" 
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItem>
              
              <Divider sx={{ my: 1 }} />
              
              <ListItem 
                sx={{ px: 2, py: 1.5, '&:hover': { bgcolor: '#f8fafc' }, cursor: 'pointer' }}
                onClick={() => handleMenuAction('logout')}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LogoutIcon sx={{ color: '#ef4444' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Sign Out" 
                  primaryTypographyProps={{ fontSize: '0.875rem', color: '#ef4444' }}
                />
              </ListItem>
            </List>
          </Paper>
        </ClickAwayListener>
      )}
    </Box>
  );
};

export default UserAvatar;
