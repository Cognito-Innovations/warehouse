import React, { useEffect, useState } from 'react';
import { Box, IconButton, InputBase } from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search by package no, tracking or suite no",
  value = "",
  onChange
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    setInternalValue('');
    onChange?.('');
  };

  const handleClearMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      bgcolor: isFocused ? '#f8fafc' : '#e2e8f0', 
      borderRadius: 2, 
      px: 2, 
      py: 1, 
      minWidth: 400, 
      border: '1px solid #cbd5e1',
      transition: 'border-color 0.2s ease-in-out',
    }}>
      {!isFocused && <SearchIcon sx={{ color: '#64748b', mr: 1, fontSize: 20 }} /> }

      <InputBase 
        placeholder={placeholder}
        value={internalValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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

      {isFocused && internalValue && (
        <Box
          sx={{
            ml: 1,
            display: 'flex',
            alignItems: 'center',
            transition: 'opacity 0.2s, transform 0.2s',
            opacity: isFocused && internalValue ? 1 : 0,
            transform: isFocused && internalValue ? 'translateX(0)' : 'translateX(10px)',
            pointerEvents: isFocused && internalValue ? 'auto' : 'none',
          }}
        >
          <IconButton
            size="small"
            onClick={handleClear}
            onMouseDown={handleClearMouseDown}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
