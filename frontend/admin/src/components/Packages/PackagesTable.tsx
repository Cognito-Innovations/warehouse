import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'sonner';
import { deletePackage, getPackage } from '../../services/api.services';
import PackageFilter from './PackageFilter';
import ConfirmDialog from '../common/ConfirmDialog';
import PackagesTableView from './PackagesTableView';

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
        <PackagesTableView
          packages={paginatedData}
          page={page}
          rowsPerPage={rowsPerPage}
          totalPages={totalPages}
          totalFilteredItems={filteredPackages.length}
          onPageChange={handlePageChange}
          onViewDetails={handleInfoClick}
          onOpenMenu={handleMenuOpen}
        />
      </Box>

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
