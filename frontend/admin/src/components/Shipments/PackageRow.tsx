import React, { useState } from 'react';
import {
  Box,
  TableCell,
  TableRow,
  IconButton,
  Typography,
  Collapse,
  CircularProgress,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  VisibilityOutlined as ViewIcon,
} from '@mui/icons-material';
import ItemTable from './ItemTable';
import { formatDateTime } from '../../utils/formatDateTime';
import { useNavigate } from 'react-router-dom';
import { removePackageFromShipment } from '../../services/api.services';
import { toast } from 'sonner';

interface PackageRowProps {
  item: any;
  index: number;
  showCancel?: boolean;
  shipmentId?: string;
  onPackageRemoved?: () => void;
  isDiscarded?: boolean;
}

const PackageRow: React.FC<PackageRowProps> = ({
  item,
  index,
  showCancel = false,
  shipmentId,
  onPackageRemoved,
  isDiscarded,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleRemovePackage = async () => {
    try {
      setRemoving(true);
      await removePackageFromShipment(shipmentId, item.id);
      onPackageRemoved?.()
    } catch (error) {
      console.error("Failed to remove package:", error);
      toast.error("Failed to remove package.")
    } finally {
      setRemoving(false);
    }
  }

  const handleViewPackage = () => {
    navigate(`/packages/${item.package_id}`);
  };

  const formatWeight = (value) => {
    if (value === null) {
      return "-"
    }

    const num = Number(value);
    return Number.isInteger(num) ? `${num} KG` : `${num} KG`;
  }

  return (
    <>
      <TableRow sx={{ 
        '& > *': {
          borderBottom: 'none !important',
          borderTop: 'none !important', 
          verticalAlign: 'top'
        },
        '&:hover': {
          bgcolor: '#f8fafc'
        }
      }}>
        <TableCell sx={{ py: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton 
            size="small" 
            onClick={() => setOpen(!open)}
            sx={{
              bgcolor: open ? '#e2e8f0' : 'transparent',
              '&:hover': {
                bgcolor: '#d1d5db'
              }
            }}
          >
            {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
          </IconButton>

          <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
            {index + 1}.
          </Typography>

          <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 500, color: '#1f2937' }}>
            {item.package_id}
          </Typography>
        </TableCell>
        <TableCell sx={{ py: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
            {item.rack_slot?.label}
          </Typography>
        </TableCell>
        <TableCell sx={{ py: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
            {item.tracking_no}
          </Typography>
          <Typography variant="caption" color="text.secondary">{item.vendor?.supplier_name }</Typography>
        </TableCell>
        <TableCell sx={{ py: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
            {formatDateTime(item.created_at)}
          </Typography>
        </TableCell>
        <TableCell sx={{ py: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
            {formatWeight(item.total_weight)}
          </Typography>
        </TableCell>
        <TableCell sx={{ py: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
            {formatWeight(item.total_volumetric_weight)}
          </Typography>
        </TableCell>
        <TableCell sx={{ py: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton 
              size="small" 
              onClick={!isDiscarded ? handleViewPackage : undefined}
              disabled={isDiscarded}
              sx={{ 
                bgcolor: isDiscarded ? '#cbd5e1' : '#7360F2',
                color: isDiscarded ? '#64748b' : '#f8f8f8',  
                cursor: isDiscarded ? 'not-allowed' : 'pointer',
                opacity: isDiscarded ? 0.6 : 1,
                '&:hover': { backgroundColor: '#5b48d8' },
                width: 28,
                height: 28
              }}
            >
              <ViewIcon fontSize="small" />
            </IconButton>

            {showCancel && (
              <IconButton
                size="small"
                disabled={ isDiscarded || removing}
                onClick={!isDiscarded ? handleRemovePackage : undefined}
                sx={{
                  bgcolor: isDiscarded ? '#cbd5e1' : '#DC2626',
                  color: isDiscarded ? '#64748b' : '#ffffff',
                  cursor: isDiscarded ? 'not-allowed' : 'pointer',
                  opacity: isDiscarded ? 0.6 : 1,
                  '&:hover': { bgcolor: '#B91C1C' },
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                }}
              >
                {removing ? (
                  <CircularProgress size={14} />
                ) : (
                  '✕'
                )}
              </IconButton>
            )}
          </Box>
        </TableCell>
      </TableRow>

      {item.items && item.items.length > 0 ? (
        <TableRow>
          <TableCell colSpan={9} sx={{ py: 0 }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <ItemTable items={item.items} />
            </Collapse>
          </TableCell>
        </TableRow>
      ) : (
        <TableRow>
          <TableCell colSpan={9} sx={{ py: 0 }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <ItemTable items={[]} />
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default PackageRow;