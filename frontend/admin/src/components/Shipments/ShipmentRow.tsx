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
  const [open, setOpen] = useState(row.id === 'S2025180N');
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
        <TableCell><Typography fontWeight={600}>{row.id}</Typography></TableCell>
        <TableCell>
          <Typography fontWeight={600}>{row.trackingNo}</Typography>
          <Typography variant="caption" color="text.secondary">{row.courier}</Typography>
        </TableCell>
        <TableCell>
          <Typography fontWeight={600}>{row.customer.name}</Typography>
          <Typography variant="caption" color="text.secondary">{row.customer.suiteNo}</Typography>
        </TableCell>
        <TableCell>
          <Typography fontWeight={600}>{row.requestAt}</Typography>
          <Typography variant="caption" color="text.secondary">{row.requestTime}</Typography>
        </TableCell>
        <TableCell>
          <Chip label={row.status} size="small" sx={{ color: statusColors.color, bgcolor: statusColors.bgColor }} />
        </TableCell>
        <TableCell align="center">{row.pkgsCount}</TableCell>
        <TableCell>
          <Chip label={row.invoice} size="small" sx={{ color: invoiceColors.color, bgcolor: invoiceColors.bgColor }} />
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" sx={{ bgcolor: '#7360F2', color: '#f8f8f8', '&:hover': { backgroundColor: '#5b48d8' }}}><ViewIcon fontSize="small" /></IconButton>
            
            {row.invoice === 'PENDING' && (
                <IconButton size="small" sx={{ bgcolor: '#0b84e3', color: '#f8f8f8', '&:hover': { backgroundColor: '#0969b8' }}}><MoreIcon fontSize="small" /></IconButton>
            )}
          </Box>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={10} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 1, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& > *': { border: 'none' } }}>
                    <TableCell /><TableCell /><TableCell>Package No.</TableCell>
                    <TableCell>Rack</TableCell><TableCell>Tracking No.</TableCell>
                    <TableCell>Received At</TableCell>
                    <TableCell align="right">Weight</TableCell>
                    <TableCell align="right">Vol. Weight</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.items.map((pkg, i) => <PackageRow key={pkg.id} item={pkg} index={i} />)}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ShipmentRow;