import React, { useState } from 'react';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import {
  Add as AddIcon,
  CalendarTodayOutlined as CalendarIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import Modal from '../common/Modal';
import { createShipmentExport } from '../../services/api.services';

interface ShipmentExportFiltersProps {
  selectedDate: Dayjs | null;
  onDateChange: (date: Dayjs | null) => void;
  onUpdate: () => void;
}

const ShipmentExportFilters: React.FC<ShipmentExportFiltersProps> = ({ selectedDate, onDateChange, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [noOfBoxes, setNoOfBoxes] = useState("1");
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        export_code: `MS/IN/${Date.now()}`,
        boxes_count: parseInt(noOfBoxes, 10),
        created_by: 'admin-123',
      };

      await createShipmentExport(payload);
      onUpdate();
    } catch (err) {
      console.error('Failed to create export:', err);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <>
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
          onClick={handleOpen}
        >
          Create Export
        </Button>
      </Box>

      <Modal open={open} onClose={handleClose} title="Create Export" size="xs">
        <Box sx={{ width: '100%' }}>
          <TextField
            label="No of Boxes"
            value={noOfBoxes}
            onChange={(e) => setNoOfBoxes(e.target.value)}
            fullWidth
            required
            size="small"
            type="number"
            sx={{ mb: 1 }}
          />

          <Typography variant="caption" color="text.secondary">
            Note: Later you can edit no of boxes
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              sx={{
                textTransform: 'none',
                borderRadius: 1,
                bgcolor: '#7c3aed',
                '&:hover': { bgcolor: '#6d28d9' },
                px: 3,
                py: 1,
                fontWeight: 500,
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ShipmentExportFilters;