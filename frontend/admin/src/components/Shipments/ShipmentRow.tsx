import React, { useState } from 'react';
import {
  Box,
  TableCell,
  TableRow,
  Collapse,
  IconButton,
  Checkbox,
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
  MoreVertOutlined as MoreIcon,
} from '@mui/icons-material';
import { getStatusAndInvoiceColor } from '../../data/shipments';
import PackageRow from './PackageRow';

interface ItemDetail { 
    name: string; 
    quantity: number; 
    amount: string; 
    total: string; 
}

interface ExpandedItem {
  id: number; 
  packageNo: string; 
  rack: string; 
  trackingNo: string; 
  courier: string;
  receivedAt: string; 
  receivedTime: string; 
  weight: string; 
  volWeight: string; 
  items: ItemDetail[];
}

interface Shipment {
  id: string; 
  trackingNo: string; 
  courier: string;
  customer: { name: string; suiteNo: string; };
  requestAt: string; 
  requestTime: string; 
  status: string; 
  pkgsCount: number; 
  invoice: string;
  items: ExpandedItem[];
}

const ShipmentRow: React.FC<{ row: Shipment }> = ({ row }) => {
  const [open, setOpen] = useState(false);
  const statusColors = getStatusAndInvoiceColor(row.status);
  const invoiceColors = getStatusAndInvoiceColor(row.invoice);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell padding="checkbox"><Checkbox color="primary" /></TableCell>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell><Typography>{row.id}</Typography></TableCell>
        <TableCell>
          <Typography>{row.trackingNo}</Typography>
          <Typography variant="caption" color="text.secondary">{row.courier}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{row.customer.name}</Typography>
          <Typography variant="caption" color="text.secondary">{row.customer.suiteNo}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{row.requestAt}</Typography>
          <Typography variant="caption" color="text.secondary">{row.requestTime}</Typography>
        </TableCell>
        <TableCell>
          <Chip label={row.status} size="small" sx={{ color: statusColors.color, bgcolor: statusColors.bgColor }} />
        </TableCell>
        <TableCell align="center">{row.pkgsCount}</TableCell>
        <TableCell>
          <Chip label={row.invoice} size="small" sx={{ color: invoiceColors.color, bgcolor: invoiceColors.bgColor }} />
        </TableCell>
        {/* TODO: Add view icon when functionality is implemented*/}
        {/* <TableCell>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" sx={{ bgcolor: '#7360F2', color: '#f8f8f8', '&:hover': { backgroundColor: '#5b48d8' }}}><ViewIcon fontSize="small" /></IconButton>
            
            {row.invoice === 'PENDING' && (
                <IconButton size="small" sx={{ bgcolor: '#0b84e3', color: '#f8f8f8', '&:hover': { backgroundColor: '#0969b8' }}}><MoreIcon fontSize="small" /></IconButton>
            )}
          </Box>
        </TableCell> */}
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
                    label={`${row.items.length} packages`} 
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
                        color: '#374151',
                        fontSize: '0.875rem',
                        py: 1.5
                      } 
                    }}>
                      <TableCell sx={{ width: 40 }} />
                      <TableCell sx={{ width: 40 }} />
                      <TableCell>Package No.</TableCell>
                      <TableCell>Rack</TableCell>
                      <TableCell>Tracking No.</TableCell>
                      <TableCell>Received At</TableCell>
                      <TableCell align="right">Weight</TableCell>
                      <TableCell align="right">Vol. Weight</TableCell>
                      <TableCell sx={{ width: 80 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.items.map((pkg, i) => (
                      <PackageRow 
                        key={pkg.id} 
                        item={pkg} 
                        index={i} 
                        isLast={i === row.items.length - 1}
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