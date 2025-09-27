import React from 'react';
import { Box } from '@mui/material';

// import { useTabContext } from '../../App';

import PageTitle from './PageTitle';
import UserAvatar from './UserAvatar';


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

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Page Title */}
        {pageTitle && (
          <PageTitle title={pageTitle} subtitle={pageSubtitle} />
        )}
      </Box>
      
      {/* Right Side: Notifications and Avatar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <UserAvatar />
      </Box>
    </Box>
  );
};

export default TopNavbar;
