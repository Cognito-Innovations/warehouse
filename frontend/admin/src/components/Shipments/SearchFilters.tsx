import React from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, AssessmentOutlined, Close as CloseIcon } from '@mui/icons-material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { statusOptions } from '../../data/shipments';

interface SearchFiltersProps {
  status: string;
  setStatus: (status: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ status, setStatus }) => {
  const handleClearFilter = () => setStatus('All');

  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <IconButton>
          <FilterAltOutlinedIcon color="action" />
        </IconButton>

        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            bgcolor: '#f8fafc',
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
          }}>
          <Typography variant="body2" color="text.secondary">
            Status:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              variant="standard"
              disableUnderline
              sx={{ fontWeight: 600 }}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {status !== 'All' && (
            <IconButton size="small" onClick={handleClearFilter}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AssessmentOutlined />}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            backgroundColor: '#7360F2',
            '&:hover': {
              backgroundColor: '#5b48d8',
            },
          }}
        >
          Ship Requested Report
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: 'none',
            backgroundColor: '#7360F2',
            '&:hover': {
              backgroundColor: '#5b48d8',
            },
          }}
        >
          Create Shipment
        </Button>
      </Box>
    </Box>
  );
};

export default SearchFilters;