import React, { useState } from 'react';
import { Visibility as VisibilityIcon, MoreVert as MoreVertIcon, FilterList as FilterIcon, Clear as ClearIcon } from '@mui/icons-material';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Pagination, FormControl, Select, MenuItem, InputLabel } from '@mui/material';

interface PreArrival {
  id: string;
  otp: string;
  tracking: string;
  customerName: string;
  customerId: string;
  eta: string;
  createdAt: string;
  status: string;
}

const PreArrivals: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(15);

  // Mock data for Pre Arrivals
  const preArrivals: PreArrival[] = [
    {
      id: '1',
      otp: '788345',
      tracking: '363054530672',
      customerName: 'Ahmed Hashim',
      customerId: '148-652',
      eta: 'Between 1:30 PM and 10:30 PM',
      createdAt: 'Aug 31, 2025 / 01:06 PM',
      status: 'PENDING'
    },
    {
      id: '2',
      otp: '928542',
      tracking: '',
      customerName: 'Ahmed Mafawiz',
      customerId: '988-126',
      eta: '30th august 2025',
      createdAt: 'Aug 30, 2025 / 01:17 PM',
      status: 'PENDING'
    },
    {
      id: '3',
      otp: '308405',
      tracking: '362967370030',
      customerName: 'Hassan Sham',
      customerId: '877-119',
      eta: '27 AUG 14:30 PM - 17:30 PM',
      createdAt: 'Aug 27, 2025 / 01:06 PM',
      status: 'PENDING'
    },
    {
      id: '4',
      otp: '321245',
      tracking: '363032981601 / sptp66704897',
      customerName: 'Customer Name',
      customerId: '123-456',
      eta: '6 PM',
      createdAt: 'Aug 26, 2025 / 01:06 PM',
      status: 'PENDING'
    }
  ];

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleClearFilters = () => {
    setStatusFilter('All');
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const filteredData = statusFilter === 'All' ? preArrivals : preArrivals.filter(item => item.status === statusFilter);
  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      {/* Filters */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <FilterIcon sx={{ color: '#64748b' }} />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            sx={{ fontSize: '0.875rem' }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
          </Select>
        </FormControl>
        {statusFilter !== 'All' && (
          <IconButton 
            onClick={handleClearFilters}
            size="small"
            sx={{ color: '#64748b' }}
          >
            <ClearIcon />
          </IconButton>
        )}
      </Box>

      {/* Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>OTP / Tracking No</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>ETA</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Created At</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
                        {row.otp}
                      </Typography>
                      {row.tracking && (
                        <Typography variant="caption" color="text.secondary">
                          {row.tracking}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
                        {row.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.customerId}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {row.eta}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {row.createdAt}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        bgcolor: '#fef3c7',
                        color: '#92400e',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: '#64748b' }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#64748b' }}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Items per page: {rowsPerPage}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {((page - 1) * rowsPerPage) + 1} - {Math.min(page * rowsPerPage, filteredData.length)} of {filteredData.length}
          </Typography>
          <Pagination
            count={Math.ceil(filteredData.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            size="small"
            showFirstButton
            showLastButton
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PreArrivals;
