'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  Person,
  Lock,
  LocationOn,
} from '@mui/icons-material';

const menuItems = [
  {
    label: 'Profile',
    icon: <Person />,
    href: '/profile',
  },
  {
    label: 'Password',
    icon: <Lock />,
    href: '/profile/password',
  },
  {
    label: 'Addresses',
    icon: <LocationOn />,
    href: '/profile/addresses',
  },
];

export default function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <Paper
      sx={{
        width: 280,
        height: '100%',
        bgcolor: 'background.paper',
        borderRadius: 0,
        boxShadow: 'none',
        borderRight: '1px solid',
        borderColor: 'grey.200',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <List sx={{ p: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                sx={{
                  borderRadius: '8px',
                  py: 1.5,
                  px: 2,
                  bgcolor: isActive ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  color: isActive ? 'primary.main' : 'grey.700',
                  '&:hover': {
                    bgcolor: isActive ? 'rgba(139, 92, 246, 0.15)' : 'grey.50',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'primary.main' : 'grey.500',
                    minWidth: 36,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}