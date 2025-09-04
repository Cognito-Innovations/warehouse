import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Pagination,
} from '@mui/material';
import {
  Info as InfoIcon,
  Print as PrintIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { packages, getStatusColor } from '../../data/packages';

interface PackagesTableProps {
  // onPackageInfoClick prop removed - now using navigation
}

const PackagesTable: React.FC<PackagesTableProps> = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(15);
  const navigate = useNavigate();

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleInfoClick = (packageData: any) => {
    // Navigate to package detail page instead of opening modal
    navigate(`/packages/${packageData.id}`);
  };

  const paginatedData = packages.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box sx={{ width: '100%',  maxWidth: '100%' }}>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Package No.</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Tracking No.</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Received At</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
                      {row.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
                        {row.packageNo}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Rack: {row.status}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
                        {row.trackingNo}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.carrier}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
                        {row.customer}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.customerCode}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
                        {row.receivedAt}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.time}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const status = getStatusColor(row.statusType);
                      return (
                        <Chip
                          label={row.statusType}
                          size="small"
                          sx={{
                            color: status.color,
                            bgcolor: status.bgColor,
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        />
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        sx={{ bgcolor: '#6366f1', color: 'white' }}
                        onClick={() => handleInfoClick(row)}
                      >
                        <InfoIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ bgcolor: '#3b82f6', color: 'white' }}>
                        <PrintIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ bgcolor: '#3b82f6', color: 'white' }}>
                        <MoreIcon fontSize="small" />
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
            {((page - 1) * rowsPerPage) + 1} - {Math.min(page * rowsPerPage, packages.length)} of {packages.length}
          </Typography>
          <Pagination
            count={Math.ceil(packages.length / rowsPerPage)}
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

export default PackagesTable;
