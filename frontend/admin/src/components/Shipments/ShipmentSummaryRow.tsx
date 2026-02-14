import { useNavigate } from 'react-router-dom';
import {
  Box,
  TableCell,
  TableRow,
  IconButton,
  Typography,
  Chip,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  VisibilityOutlined as ViewIcon,
} from '@mui/icons-material';
// import { MoreVerticalIcon } from 'lucide-react';

import { formatDateTime } from '../../utils/formatDateTime';
import { getStatusAndInvoiceColor } from '../../data/shipments';

interface ShipmentSummaryRowProps {
  row: any;
  open: boolean;
  onToggle: () => void;
}

const ShipmentSummaryRow = ({ row, open, onToggle }: ShipmentSummaryRowProps) => {
  const navigate = useNavigate();

  const statusColors = getStatusAndInvoiceColor(row.status);
  const invoiceColors = getStatusAndInvoiceColor(row.invoice?.status);

  const handleViewShipment = (shipmentNo: string) => {
    navigate(`/shipments/${shipmentNo}`);
  };

  return (
    <TableRow sx={{ '& > *': { borderBottom: 'unset', verticalAlign: 'top' } }}>
      <TableCell>
        <IconButton size="small" onClick={onToggle}>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
          {row.shipment_no}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
          {row.tracking_no}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {row.courier}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
          {row.user.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {row.user.suite_no}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
          {formatDateTime(row.created_at)}
        </Typography>
      </TableCell>

      <TableCell>
        <Chip
          label={row.status}
          size="small"
          sx={{
            color: statusColors.color,
            bgcolor: statusColors.bgColor,
            fontWeight: 500,
            fontSize: '0.75rem',
          }}
        />
      </TableCell>

      <TableCell align="center">
        {row.packages ? row.packages.length : 0}
      </TableCell>

      <TableCell>
        <Chip
          label={row.invoice?.status || 'PENDING'}
          size="small"
          sx={{
            color: invoiceColors.color,
            bgcolor: invoiceColors.bgColor,
            fontWeight: 500,
            fontSize: '0.75rem',
          }}
        />
      </TableCell>

      <TableCell>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => handleViewShipment(row.shipment_no)}
            sx={{
              bgcolor: '#7360F2',
              color: '#f8f8f8',
              '&:hover': { backgroundColor: '#5b48d8' },
            }}
          >
            <ViewIcon fontSize="small" />
          </IconButton>

          {/* TODO: uncomment when functionality implemented */}
          {/* {!row.invoice && (
            <IconButton size="small" sx={{ bgcolor: '#0b84e3', color: '#f8f8f8', '&:hover': { backgroundColor: '#0969b8' }}}>
              <MoreVerticalIcon fontSize="small" />
            </IconButton>
          )} */}
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default ShipmentSummaryRow;