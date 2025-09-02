import React, { useState } from 'react';
import { Visibility as VisibilityIcon, MoreVert as MoreVertIcon, FilterList as FilterIcon, Clear as ClearIcon, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Pagination, FormControl, Select, MenuItem, InputLabel, Modal, Button, Menu } from '@mui/material';

interface PreArrival {
  id: string;
  otp: string;
  tracking: string;
  customerName: string;
  customerId: string;
  eta: string;
  createdAt: string;
  status: string;
  packageDetails?: string;
}

const PreArrivals: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(15);
  const [selectedItem, setSelectedItem] = useState<PreArrival | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRowItem, setSelectedRowItem] = useState<PreArrival | null>(null);

  // Mock data for Pre Arrivals
  const [preArrivals, setPreArrivals] = useState<PreArrival[]>([
    {
      id: '1',
      otp: '788345',
      tracking: '363054530672',
      customerName: 'Ahmed Hashim',
      customerId: '148-652',
      eta: 'Between 1:30 PM and 10:30 PM',
      createdAt: 'Aug 31, 2025 / 01:06 PM',
      status: 'PENDING',
      packageDetails: 'TruSens Air Purifier'
    },
    {
      id: '2',
      otp: '928542',
      tracking: '',
      customerName: 'Ahmed Mafawiz',
      customerId: '988-126',
      eta: '30th august 2025',
      createdAt: 'Aug 30, 2025 / 01:17 PM',
      status: 'PENDING',
      packageDetails: 'Electronics Package'
    },
    {
      id: '3',
      otp: '308405',
      tracking: '362967370030',
      customerName: 'Hassan Sham',
      customerId: '877-119',
      eta: '27 AUG 14:30 PM - 17:30 PM',
      createdAt: 'Aug 27, 2025 / 01:06 PM',
      status: 'PENDING',
      packageDetails: 'Sahaaf Package'
    },
    {
      id: '4',
      otp: '321245',
      tracking: '363032981601 / sptp66704897',
      customerName: 'Customer Name',
      customerId: '123-456',
      eta: '6 PM',
      createdAt: 'Aug 26, 2025 / 01:06 PM',
      status: 'PENDING',
      packageDetails: 'General Package'
    }
  ]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleClearFilters = () => {
    setStatusFilter('All');
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleEyeClick = (item: PreArrival) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleThreeDotsClick = (event: React.MouseEvent<HTMLElement>, item: PreArrival) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowItem(item);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRowItem(null);
  };

  const handleMarkAsReceive = () => {
    if (selectedRowItem) {
      setPreArrivals(prev => 
        prev.map(item => 
          item.id === selectedRowItem.id 
            ? { ...item, status: 'RECEIVED' }
            : item
        )
      );
      handleCloseMenu();
    }
  };

  const handleDelete = () => {
    if (selectedRowItem) {
      setPreArrivals(prev => prev.filter(item => item.id !== selectedRowItem.id));
      handleCloseMenu();
    }
  };

  const handleReceive = () => {
    if (selectedItem) {
      setPreArrivals(prev => 
        prev.map(item => 
          item.id === selectedItem.id 
            ? { ...item, status: 'RECEIVED' }
            : item
        )
      );
      handleCloseModal();
    }
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
            <MenuItem value="RECEIVED">Received</MenuItem>
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
                        bgcolor: row.status === 'RECEIVED' ? '#dcfce7' : '#fef3c7',
                        color: row.status === 'RECEIVED' ? '#166534' : '#92400e',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#64748b' }}
                        onClick={() => handleEyeClick(row)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#64748b' }}
                        onClick={(e) => handleThreeDotsClick(e, row)}
                      >
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

      {/* Customer Details Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal} aria-labelledby="customer-details-modal" aria-describedby="customer-details-description">
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}>
          {/* Modal Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              Receive
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Modal Content */}
          {selectedItem && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Customer
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedItem.customerName} ({selectedItem.customerId})
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  OTP
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedItem.otp}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Tracking / Order No.
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedItem.tracking || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  ETA
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedItem.eta}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Status
                </Typography>
                <Chip
                  label={selectedItem.status}
                  size="small"
                  sx={{
                    bgcolor: selectedItem.status === 'RECEIVED' ? '#dcfce7' : '#fef3c7',
                    color: selectedItem.status === 'RECEIVED' ? '#166534' : '#92400e',
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Package Details
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedItem.packageDetails || 'N/A'}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Modal Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleReceive}
              disabled={selectedItem?.status === 'RECEIVED'}
              sx={{ 
                minWidth: 100,
                bgcolor: '#8b5cf6',
                '&:hover': { bgcolor: '#7c3aed' }
              }}
            >
              Receive
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Three Dots Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleMarkAsReceive} disabled={selectedRowItem?.status === 'RECEIVED'}>
          <EditIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
          Mark as Receive
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default PreArrivals;
