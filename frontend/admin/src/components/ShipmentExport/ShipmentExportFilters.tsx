import React from 'react';
import { Box, Button, IconButton } from '@mui/material';
import {
  Add as AddIcon,
  CalendarTodayOutlined as CalendarIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

interface ShipmentExportFiltersProps {
  selectedDate: Dayjs | null;
  onDateChange: (date: Dayjs | null) => void;
}

const ShipmentExportFilters: React.FC<ShipmentExportFiltersProps> = ({ selectedDate, onDateChange }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <IconButton>
          <FilterAltOutlinedIcon color="action" />
        </IconButton>

        <DatePicker
          value={selectedDate}
          onChange={(newDate) => onDateChange(newDate)}
          slotProps={{
            textField: {
              variant: 'outlined',
              placeholder: 'Select Date',
              size: 'small',
              InputProps: {
                startAdornment: <CalendarIcon fontSize="small" style={{ marginRight: 8 }} />,
                endAdornment: selectedDate ? (
                  <IconButton size="small" onClick={() => onDateChange(null)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                ) : null,
              },
              sx: {
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  borderColor: '#e2e8f0',
                },
              },
            },
          }}
        />
      </Box>
      
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none' }}
      >
        Create Export
      </Button>
    </Box>
  );
};

export default ShipmentExportFilters;