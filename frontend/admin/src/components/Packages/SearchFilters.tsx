import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { statusOptions } from '../../data/packages';

interface SearchFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search by package no, tracking or suite no"
            size="small"
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => onStatusFilterChange(e.target.value)}
              startAdornment={<FilterIcon sx={{ mr: 1, color: 'action.active' }} />}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton onClick={onClearFilters}>
            <ClearIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
