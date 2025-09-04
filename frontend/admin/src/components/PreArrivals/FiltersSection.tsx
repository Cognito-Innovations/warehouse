import React from 'react';
import { Box, FormControl, Select, MenuItem, InputLabel, IconButton } from '@mui/material';
import { FilterList as FilterIcon, Clear as ClearIcon } from '@mui/icons-material';

interface FiltersSectionProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  statusFilter,
  onStatusFilterChange,
  onClearFilters
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
      <FilterIcon sx={{ color: '#64748b' }} />
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Status</InputLabel>
        <Select 
          value={statusFilter} 
          label="Status" 
          onChange={(e) => onStatusFilterChange(e.target.value)} 
          sx={{ fontSize: '0.875rem' }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="RECEIVED">Received</MenuItem>
        </Select>
      </FormControl>
      {statusFilter !== 'All' && (
        <IconButton
          onClick={onClearFilters}
          size="small"
          sx={{ color: '#64748b' }}
        >
          <ClearIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default FiltersSection;
