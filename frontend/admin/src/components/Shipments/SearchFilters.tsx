import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
} from '@mui/material';
import { FilterList as FilterIcon } from '@mui/icons-material';
import { statusMap, statusOptions } from '../../data/shipments';
import ShipReportButton from './ShipReportButton';

interface SearchFiltersProps {
  status: string;
  setStatus: (newStatus: string) => void;
  shipments: any[];
  loading: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ status, setStatus, shipments, loading }) => {
  // const navigate = useNavigate();

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleClearFilters = () => {
    setStatus('All');
  };

  // TODO: Uncomment when functionality implemented
  // const handleCreateShipment = () => {
  //   navigate("/shipments/create");
  // };

  return (
    <Box sx={{ 
      mb: 3, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      p: 2,
      bgcolor: '#f8fafc',
      borderRadius: 2,
      border: '1px solid #e2e8f0'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2
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
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as string)}
            label="Status"
          >
            <MenuItem value="All">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">All Statuses</Typography>
              </Box>
            </MenuItem>
            {statusOptions
              .filter((opt) => opt !== 'ALL')
              .map((option) => (
                <MenuItem key={option} value={option}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {statusMap[option] || option}
                    </Typography>
                  </Box>
                </MenuItem>
            ))}
          </Select>
        </FormControl>

        {status !== 'All' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={status}
              onDelete={handleClearFilters}
              sx={{
                bgcolor: '#3b82f620',
                color: '#3b82f6',
                '& .MuiChip-deleteIcon': {
                  color: '#3b82f6',
                },
              }}
            />
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <ShipReportButton shipments={shipments} loading={loading}/>

        {/* TODO: Uncomment when functionality implemented */}
        {/* <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateShipment}
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
        </Button> */}
      </Box>
    </Box>
  );
};

export default SearchFilters;