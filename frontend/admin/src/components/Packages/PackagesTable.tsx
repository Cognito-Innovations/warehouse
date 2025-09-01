import React from 'react';
import {
  Box,
  Card,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Info as InfoIcon,
  Print as PrintIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { packages, getStatusColor } from '../../data/packages';

const PackagesTable: React.FC = () => {
  const columns: GridColDef[] = [
    { field: 'id', headerName: '#', width: 50 },
    {
      field: 'packageNo',
      headerName: 'Package No.',
      width: 190,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Rack: {params.row.status}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'trackingNo',
      headerName: 'Tracking No.',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.carrier}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'customer',
      headerName: 'Customer',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.customerCode}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'receivedAt',
      headerName: 'Received At',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.time}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => {
        const status = getStatusColor(params.row.statusType);
        return (
          <Chip
            label={params.row.statusType}
            size="small"
            sx={{
              color: status.color,
              bgcolor: status.bgColor,
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: '',
      width: 120,
      renderCell: () => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" sx={{ bgcolor: '#6366f1', color: 'white' }}>
            <InfoIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ bgcolor: '#3b82f6', color: 'white' }}>
            <PrintIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ bgcolor: '#3b82f6', color: 'white' }}>
            <MoreIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Card>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={packages}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{ border: 'none','& .MuiDataGrid-cell': { borderBottom: '1px solid #f1f5f9' },
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
            },
          }}
        />
      </Box>
    </Card>
  );
};

export default PackagesTable;
