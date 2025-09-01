import React, { useState } from 'react';
import {
  Box,
  TableCell,
  TableRow,
  IconButton,
  Typography,
  Checkbox,
  Collapse,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  VisibilityOutlined as ViewIcon,
} from '@mui/icons-material';
import ItemTable from './ItemTable';

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

const PackageRow: React.FC<{ item: ExpandedItem; index: number }> = ({ item, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { border: 'none' } }}>
        <TableCell padding="checkbox">
          <Checkbox color="primary" />
        </TableCell>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography>{index + 1}. {item.packageNo}</Typography>
        </TableCell>
        <TableCell>{item.rack}</TableCell>
        <TableCell>
          <Typography variant="body2">{item.trackingNo}</Typography>
          <Typography variant="caption" color="text.secondary">{item.courier}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">{item.receivedAt}</Typography>
          <Typography variant="caption" color="text.secondary">{item.receivedTime}</Typography>
        </TableCell>
        <TableCell align="right">{item.weight}</TableCell>
        <TableCell align="right">{item.volWeight}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" sx={{ bgcolor: '#7360F2', color: '#f8f8f8', '&:hover': { backgroundColor: '#5b48d8' }}}>
              <ViewIcon fontSize="small" />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={9} sx={{ py: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <ItemTable items={item.items} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default PackageRow;