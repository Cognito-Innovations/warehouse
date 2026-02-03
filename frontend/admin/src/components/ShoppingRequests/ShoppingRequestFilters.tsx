import React from 'react';
import { Box, MenuItem, TextField } from '@mui/material';

interface ShoppingRequestFiltersProps {
  originOptions: string[];
  targetOptions: string[];
  originCountry: string | null;
  targetCountry: string | null;
  onOriginChange: (value: string | null) => void;
  onTargetChange: (value: string | null) => void;
}

const ShoppingRequestFilters: React.FC<ShoppingRequestFiltersProps> = ({
  originOptions,
  targetOptions,
  originCountry,
  targetCountry,
  onOriginChange,
  onTargetChange,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {/* Origin */}
      <TextField
        select
        size="small"
        label="Origin"
        value={originCountry ?? 'All'}
        onChange={(e) =>
          onOriginChange(e.target.value === 'All' ? null : e.target.value)
        }
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="All">All Origins</MenuItem>
        {originOptions.map(country => (
          <MenuItem key={country} value={country}>
            {country}
          </MenuItem>
        ))}
      </TextField>

      {/* Target */}
      <TextField
        select
        size="small"
        label="Target"
        value={targetCountry ?? 'All'}
        onChange={(e) =>
          onTargetChange(e.target.value === 'All' ? null : e.target.value)
        }
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="All">All Targets</MenuItem>
        {targetOptions.map(country => (
          <MenuItem key={country} value={country}>
            {country}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default ShoppingRequestFilters;
