import { useState } from 'react';
import {
  Box,
  TableCell,
  TableRow,
  Collapse,
  IconButton,
  Typography,
  Chip,
  Table,
  TableHead,
  TableBody,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  VisibilityOutlined as ViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// import { MoreVerticalIcon } from 'lucide-react';
import { getStatusAndInvoiceColor } from '../../data/shipments';
import PackageRow from './PackageRow';
import { formatDateTime } from '../../utils/formatDateTime';

const ShipmentRow = ({ row }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const statusColors = getStatusAndInvoiceColor(row.status);
  const invoiceColors = getStatusAndInvoiceColor(row.invoice?.status);

  const handleViewShipment = (shipmentNo: string) => {
    navigate(`/shipments/${shipmentNo}`);
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
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
          <Typography variant="caption" color="text.secondary">{row.user.suite_no}</Typography>
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
        <TableCell align="center">{row.packages ? row.packages.length : 0}</TableCell>
        <TableCell>
          <Chip 
            label={row.invoice?.status || "PENDING"}
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
              sx={{ bgcolor: '#7360F2', color: '#f8f8f8', '&:hover': { backgroundColor: '#5b48d8' }}}>
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

      <TableRow>
        <TableCell colSpan={10} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ 
              m: 2, 
              p: 3, 
              bgcolor: '#f8fafc', 
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: '#374151',
                  mb: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  Package Details
                  <Chip 
                    label={`${row.packages.length} packages`} 
                    size="small" 
                    sx={{ 
                      bgcolor: '#e2e8f0', 
                      color: '#374151',
                      fontWeight: 500
                    }} 
                  />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Detailed information about packages in this shipment
                </Typography>
              </Box>
              
              <Box sx={{ 
                bgcolor: 'white', 
                borderRadius: 2, 
                border: '1px solid #e2e8f0',
                overflow: 'hidden'
              }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ 
                      bgcolor: '#f1f5f9',
                      '& > *': { 
                        border: 'none',
                        fontWeight: 600,
                        color: "#374151",
                        py: 1.5
                      } 
                    }}>
                      <TableCell sx={{ width: 220, textAlign: "center" }}>Package No.</TableCell>
                      <TableCell>Rack</TableCell>
                      <TableCell>Tracking No.</TableCell>
                      <TableCell>Received At</TableCell>
                      <TableCell >Weight</TableCell>
                      <TableCell >Vol. Weight</TableCell>
                      <TableCell sx={{ width: 80 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.packages.map((pkg, i) => (
                      <PackageRow 
                        key={pkg.id} 
                        item={pkg} 
                        index={i}
                      />
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ShipmentRow;