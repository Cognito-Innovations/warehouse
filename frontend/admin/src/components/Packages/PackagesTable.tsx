import React, { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import {
  Info as InfoIcon,
  Print as PrintIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { getPackage } from '../../services/api.services';
import { getStatusColor } from '../../data/packages';
import PackageFilter from './PackageFilter';

interface PackagesTableProps {
  selectedStatus?: string | null;
  searchValue?: string;
  onStatusChange?: (status: string | null) => void;
}

const PackagesTable: React.FC<PackagesTableProps> = ({ 
  selectedStatus, 
  searchValue = '', 
  onStatusChange
}) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(15);
  const [packages, setPackages] = useState<any[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<any[]>([]);
  const [statusCounts, setStatusCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleInfoClick = (packageData: any) => { 
    navigate(`/packages/${packageData.custom_package_id}`);
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await getPackage();
      setPackages(data);
      
      // Calculate status counts
      const counts = data.reduce((acc: any, pkg: any) => {
        const status = pkg.status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
      setStatusCounts(counts);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter packages based on selected status and search value
  const filterPackages = () => {
    let filtered = packages;

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(pkg => pkg.status === selectedStatus);
    }

    // Filter by search value
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(pkg => 
        pkg.custom_package_id?.toLowerCase().includes(searchLower) ||
        pkg.tracking_no?.toLowerCase().includes(searchLower) ||
        pkg.customer?.name?.toLowerCase().includes(searchLower) ||
        pkg.vendor?.supplier_name?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredPackages(filtered);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Remove this useEffect that was causing infinite loops

  useEffect(() => {
    filterPackages();
    setPage(1); // Reset to first page when filters change
  }, [packages, selectedStatus, searchValue]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-GB', { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit' 
      }),
      time: date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const paginatedData = filteredPackages.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(filteredPackages.length / rowsPerPage);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%',  maxWidth: '100%' }}>
      <PackageFilter
        selectedStatus={selectedStatus || null}
        onStatusChange={onStatusChange || (() => {})}
        totalCount={packages.length}
        filteredCount={filteredPackages.length}
        statusCounts={statusCounts}
      />
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
              {paginatedData.map((row, index) => {
                const formattedDate = formatDate(row.created_at);
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
                          {row.custom_package_id || row.id}
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
                          {formattedDate.date}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formattedDate.time}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const status = getStatusColor(row.status);
                        return (
                          <Chip
                            label={row.status}
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
                );
              })}
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
            {((page - 1) * rowsPerPage) + 1} - {Math.min(page * rowsPerPage, filteredPackages.length)} of {filteredPackages.length}
          </Typography>
          <Pagination
            count={totalPages}
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
