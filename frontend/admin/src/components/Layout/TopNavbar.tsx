import React from 'react';
import { Box } from '@mui/material';
import SearchBar from './SearchBar';

import PageTitle from './PageTitle';
import UserAvatar from './UserAvatar';

interface TopNavbarProps {
  pageTitle?: string;
  pageSubtitle?: string;
  searchValue?: string;
  placeholder?: string;
  onSearchChange?: (value: string) => void;
  showSearchBar?: boolean;
}

const TopNavbar: React.FC<TopNavbarProps> = ({
  pageTitle,
  pageSubtitle,
  searchValue,
  onSearchChange,
  placeholder,
  showSearchBar = false,
}) => {
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

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Page Title */}
        {pageTitle && (
          <PageTitle title={pageTitle} subtitle={pageSubtitle} />
        )}
      </Box>

      {showSearchBar && (
        <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', maxWidth: '500px', width: '100%' }}>
          <SearchBar value={searchValue} onChange={onSearchChange} placeholder={placeholder} />
        </Box>
      )}
      
      {/* Right Side: Notifications and Avatar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <UserAvatar />
      </Box>
    </Box>
  );
};

export default TopNavbar;
