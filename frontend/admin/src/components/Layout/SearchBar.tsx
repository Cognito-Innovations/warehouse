import React from 'react';
import { Box, InputBase } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search by otp no, tracking or suite no",
  value = "",
  onChange
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      bgcolor: '#f8fafc', 
      borderRadius: 2, 
      px: 2, 
      py: 1, 
      minWidth: 400, 
      border: '1px solid #e2e8f0'
    }}>
      <SearchIcon sx={{ color: '#64748b', mr: 1, fontSize: 20 }} />
      <InputBase 
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        sx={{ 
          flex: 1, 
          fontSize: '0.875rem',
          '& .MuiInputBase-input': {
            color: '#1e293b',
            '&::placeholder': { 
              color: '#64748b', 
              opacity: 1 
            }
          }
        }}
      />
    </Box>
  );
};

export default SearchBar;
