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
import { useDebounce } from '../../hooks/useDebounce';
import { deletePackage, getPackage, searchPackages } from '../../services/api.services';
import PackageFilter from './PackageFilter';
import ConfirmDialog from '../common/ConfirmDialog';
import PackagesTableView, { type Package as ViewPackage } from './PackagesTableView';
import { type Package as ApiPackage } from '../../types';

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
  const [packages, setPackages] = useState<ViewPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<ViewPackage[]>([]);
  const [statusCounts, setStatusCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearchValue = useDebounce(searchValue, 500);

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

  const handleInfoClick = (packageData: ViewPackage) => { 
    navigate(`/packages/${packageData.id}`);
  };

  const loadPackages = async () => {
    try {
        setLoading(true);
        const data: ApiPackage[] = debouncedSearchValue
          ? await searchPackages(debouncedSearchValue)
          : await getPackage();

        const validPackages: ViewPackage[] = data
          .filter(pkg => !!pkg.id)
          .map(pkg => ({
            id: pkg.id!,
            package_id: pkg.package_id || '',
            tracking_no: pkg.tracking_no || '',
            customer: pkg.customer
              ? { name: pkg.customer.name || 'Unknown', suite_no: pkg.customer.suite_no || 'N/A' }
              : { name: 'Unknown', suite_no: 'N/A' },
            vendor: pkg.vendor
              ? { supplier_name: pkg.vendor.supplier_name || 'Unknown' }
              : { supplier_name: 'Unknown' },
            created_at: pkg.created_at || '',
            status: { value: pkg.status?.value || 'Unknown' },
            rack_slot: pkg.rack_slot
              ? { label: pkg.rack_slot.label || 'N/A' }
              : { label: 'N/A' }
          }));

        setPackages(validPackages);
        
        // Calculate status counts
        const counts = validPackages.reduce((acc: { [key: string]: number }, pkg: ViewPackage) => {
          const status = pkg.status.value;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        setStatusCounts(counts);

        let statusFiltered = validPackages;
        if (selectedStatus) {
          statusFiltered = validPackages.filter(pkg => pkg.status.value === selectedStatus);
        }

        setFilteredPackages(statusFiltered);
        setPage(1);
      } catch (error) {
        console.error('Failed to fetch packages:', error);
        toast.error("Failed to load packages.");
        setPackages([]);
        setFilteredPackages([]);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadPackages();
  }, [debouncedSearchValue, selectedStatus]);

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
