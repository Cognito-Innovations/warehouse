import React from 'react';
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
  VisibilityOutlined as ViewIcon,
} from '@mui/icons-material';
import { formatDateTime } from '../../utils/formatDateTime';
import { getStatusColor } from '../../utils/statusUtils';

interface Package {
  id: string;
  package_id?: string;
  tracking_no?: string;
  customer?: { name?: string; suite_no?: string };
  vendor?: { supplier_name?: string };
  created_at: string;
  status: { value: string };
  rack_slot?: { label?: string };
}

interface PackagesTableViewProps {
  packages: Package[];
  page: number;
  rowsPerPage: number;
  totalPages: number;
  totalFilteredItems: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onViewDetails: (pkg: Package) => void;
  onOpenMenu: (event: React.MouseEvent<HTMLElement>, packageId: string) => void;
}

const PackagesTableView: React.FC<PackagesTableViewProps> = ({
  packages,
  page,
  rowsPerPage,
  totalPages,
  totalFilteredItems,
  onPageChange,
  onViewDetails,
}) => {
  return (
    <>
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
              {packages.map((row, index) => {
                const formattedDate = formatDateTime(row.created_at);
                if (!formattedDate) return null;

                const [date, time] = formattedDate.split(", ");
                return (
                  <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
                        {index + 1 + (page - 1) * rowsPerPage}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
                          {row.package_id || row.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Rack: {row.rack_slot?.label || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
                          {row.tracking_no}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.vendor?.supplier_name || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
                          {row.customer?.name || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.customer?.suite_no || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
                          {date}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {time}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const status = getStatusColor(row.status.value);
                        return (
                          <Chip
                            label={row.status.value}
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
                      <Box style={{paddingLeft:"10px"}}>
                        <IconButton
                          size="small"
                          sx={{ bgcolor: '#6366f1', color: 'white', '&:hover': { bgcolor: '#4f46e5' } }}
                          onClick={() => onViewDetails(row)}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        {/* TODO: Implement delete icon when functionality got updated
                        <IconButton
                          size="small"
                          sx={{ bgcolor: '#3b82f6', color: 'white', '&:hover': { bgcolor: '#2563eb' } }}
                          onClick={(e) => onOpenMenu(e, row.id)}
                        >
                          <MoreIcon fontSize="small" />
                        </IconButton> */}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
              {packages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center' }}>
                    No packages found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {totalFilteredItems > 0 ? (page - 1) * rowsPerPage + 1 : 0} - {Math.min(page * rowsPerPage, totalFilteredItems)} of {totalFilteredItems}
        </Typography>
        <Pagination
          count={totalPages}
          page={page}
          onChange={onPageChange}
          color="primary"
          size="small"
        />
      </Box>
    </>
  );
};

export default PackagesTableView;