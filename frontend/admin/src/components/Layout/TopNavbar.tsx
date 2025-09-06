import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

// import { useTabContext } from '../../App';

import PageTitle from './PageTitle';
import SearchBar from './SearchBar';
import UserAvatar from './UserAvatar';
import Notifications from './Notifications';


interface TopNavbarProps {
  pageTitle?: string;
  pageSubtitle?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ pageTitle, pageSubtitle, searchValue, onSearchChange }) => {
  //TODO: Don't use this way, correct it
  // const { togglePageSidebar } = useTabContext();
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      mb: 3,
      position: 'relative',
      zIndex: 10,
      p: 2
    }}>
      {/* Left Side: Hamburger and Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Hamburger Menu */}
        {/* <IconButton  sx={{ color: '#64748b', '&:hover': { bgcolor: '#f8fafc' }, p: 1}}>
          <MenuIcon />
        </IconButton> */}

        {/* Page Title */}
        {pageTitle && (
          <PageTitle title={pageTitle} subtitle={pageSubtitle} />
        )}
      </Box>

      {/* Center: Search Bar */}
      {/* TODO: Uncomment this when fully search is implemented */}
      {/* <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', mx: 4 }}>
        <SearchBar value={searchValue} onChange={onSearchChange}/>
      </Box> */}
      
      {/* Right Side: Notifications and Avatar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Notifications />
        <UserAvatar />
      </Box>
    </Box>
  );
};

export default TopNavbar;
