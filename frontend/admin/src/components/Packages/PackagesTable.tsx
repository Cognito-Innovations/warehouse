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
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import {
  VisibilityOutlined as ViewIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'sonner';
import { deletePackage, getPackage } from '../../services/api.services';
import { getStatusColor } from '../../data/packages';
import PackageFilter from './PackageFilter';
import { formatDateTime } from '../../utils/formatDateTime';
import ConfirmDialog from '../common/ConfirmDialog';

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, packageId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedPackageId(packageId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPackageId(null);
  };

  const handleConfirmDelete = (id: string) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      setDeleting(true);
      await deletePackage(deletingId);
      setPackages((prevPackages) =>
        prevPackages.filter((pkg) => pkg.id !== deletingId)
      );
      toast.success("Package deleted successfully!");
      setConfirmOpen(false);
      setDeletingId(null);
    } catch (error) {
      console.error('Failed to delete package:', error);
      toast.error("Failed to delete package.");
    } finally {
      handleMenuClose();
      setDeleting(false);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleInfoClick = (packageData: any) => { 
    navigate(`/packages/${packageData.id}`);
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await getPackage();
      setPackages(data);
      
      // Calculate status counts
      const counts = data.reduce((acc: any, pkg: any) => {
        const status = pkg.status.value || 'Unknown';
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
      filtered = filtered.filter(pkg => pkg.status.value === selectedStatus);
    }

    // Filter by search value
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(pkg => 
        pkg.package_id?.toLowerCase().includes(searchLower) ||
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
    <>
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
                  const formattedDate = formatDateTime(row.created_at);
                  if (!formatDateTime) return null;

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
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            sx={{ bgcolor: '#6366f1', color: 'white' }}
                            onClick={() => handleInfoClick(row)}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ bgcolor: '#3b82f6', color: 'white' }}
                            onClick={(e) => handleMenuOpen(e, row.id)}
                          >
                            <MoreIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {paginatedData.length === 0 && (
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

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => handleConfirmDelete(selectedPackageId!)}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            Delete
          </MenuItem>
        </Menu>

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

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Package"
        message="Are you sure you want to delete this package?"
        confirmText="Delete"
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
        isLoading={deleting}
      />
    </>
  );
};

export default PackagesTable;
