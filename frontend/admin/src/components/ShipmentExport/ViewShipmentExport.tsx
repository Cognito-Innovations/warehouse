import React from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { getStatusColor } from '../../data/shipmentExports';

interface ViewShipmentExportProps {
  shipment: any;
}

const ViewShipmentExport: React.FC<ViewShipmentExportProps> = ({ shipment }) => {
  const status = getStatusColor(shipment.status);

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', p: 3 }}>
      <Card sx={{ p: 3, mb: 3, borderRadius: 2, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              {shipment.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              UFLASH INTERNATIONAL COURIER, India
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {shipment.count} Box / 0 Shipment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created at {shipment.date}
            </Typography>
          </Box>
          <Chip
            label={shipment.status}
            size="small"
            sx={{
              color: status.color,
              bgcolor: status.bgColor,
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        </Box>
      </Card>

    <TextField
      variant="outlined"
      size="small"
      placeholder="Search shipment"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
      sx={{ mb: 2, width: 475 }}
    />
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      Only the shipments under tracking status (Ready to ship) can be added here
    </Typography>
    <Grid container spacing={3}>
      <Grid spacing={{ xs: 12, md: 5 }}>
        <Card variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontWeight={600}>Box 1</Typography>
              <Typography variant="body2" color="text.secondary">
                Dimension (LxBxH):
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                5 x 5 x 5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gross Weight:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mass Weight:
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ bgcolor: '#e0e7ff', color: '#4f46e5' }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ bgcolor: '#fee2e2', color: '#ef4444' }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Card>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: 'none',
            alignSelf: 'flex-start',
          }}
        >
          Add New Box
        </Button>
      </Grid>
      <Grid spacing={{ xs: 12, md: 7 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            color: 'text.secondary',
            p: 3,
          }}
        >
          <Typography>Please select a box</Typography>
        </Box>
      </Grid>
        </Grid>
    </Box>
  );
};

export default ViewShipmentExport;