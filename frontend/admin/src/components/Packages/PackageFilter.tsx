import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { FilterList as FilterIcon } from '@mui/icons-material';

interface PackageFilterProps {
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
  totalCount: number;
  filteredCount: number;
  statusCounts?: { [key: string]: number };
}

const statusOptions = [
  { value: 'Action Required', label: 'Action Required', color: '#ef4444' },
  { value: 'In Review', label: 'In Review', color: '#3b82f6' },
  { value: 'Ready to Send', label: 'Ready to Send', color: '#22c55e' },
  { value: 'Request Ship', label: 'Request Ship', color: '#f59e0b' },
  { value: 'Shipped', label: 'Shipped', color: '#10b981' },
  { value: 'Discarded', label: 'Discarded', color: '#6b7280' },
  { value: 'Draft', label: 'Draft', color: '#ec4899' },
];

const PackageFilter: React.FC<PackageFilterProps> = ({
  selectedStatus,
  onStatusChange,
  totalCount,
  filteredCount,
  statusCounts = {},
}) => {
  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    onStatusChange(value === 'all' ? null : value);
  };

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || '#6b7280';
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2, 
      mb: 2,
      p: 2,
      bgcolor: '#f8fafc',
      borderRadius: 2,
      border: '1px solid #e2e8f0'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FilterIcon sx={{ color: '#64748b' }} />
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
          Filter by Status:
        </Typography>
      </Box>
      
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={selectedStatus || 'all'}
          onChange={handleStatusChange}
          label="Status"
        >
          <MenuItem value="all">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">All Statuses</Typography>
              <Chip 
                label={totalCount} 
                size="small" 
                sx={{ 
                  bgcolor: '#e2e8f0', 
                  color: '#374151',
                  height: 20,
                  fontSize: '0.75rem'
                }} 
              />
            </Box>
          </MenuItem>
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: option.color,
                  }}
                />
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {option.label}
                </Typography>
                <Chip 
                  label={statusCounts[option.value] || 0}
                  size="small" 
                  sx={{ 
                    bgcolor: `${option.color}20`, 
                    color: option.color,
                    height: 20,
                    fontSize: '0.75rem'
                  }} 
                />
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedStatus && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`${selectedStatus}: ${filteredCount}`}
            onDelete={() => onStatusChange(null)}
            sx={{
              bgcolor: `${getStatusColor(selectedStatus)}20`,
              color: getStatusColor(selectedStatus),
              '& .MuiChip-deleteIcon': {
                color: getStatusColor(selectedStatus),
              },
            }}
          />
        </Box>
      )}

      <Box sx={{ ml: 'auto' }}>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Showing {filteredCount} of {totalCount} packages
        </Typography>
      </Box>
    </Box>
  );
};

export default PackageFilter;
