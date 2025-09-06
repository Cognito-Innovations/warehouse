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

const PackageRow: React.FC<{ item: ExpandedItem; index: number; isLast?: boolean }> = ({ item, index, isLast }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ 
        '& > *': { 
          border: 'none',
          borderBottom: isLast ? 'none' : '1px solid #f1f5f9'
        },
        '&:hover': {
          bgcolor: '#f8fafc'
        }
      }}>
        <TableCell padding="checkbox" sx={{ py: 1.5 }}>
          <Checkbox color="primary" size="small" />
        </TableCell>
        <TableCell sx={{ py: 1.5 }}>
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
        </TableCell>
        <TableCell sx={{ py: 1.5 }}>
          <Typography variant="body2">
            {index + 1}. {item.packageNo}
          </Typography>
        </TableCell>
        <TableCell sx={{ py: 1.5 }}>
          <Typography variant="body2">{item.rack}</Typography>
        </TableCell>
        <TableCell sx={{ py: 1.5 }}>
          <Typography variant="body2">{item.trackingNo}</Typography>
          <Typography variant="caption" color="text.secondary">{item.courier}</Typography>
        </TableCell>
        <TableCell sx={{ py: 1.5 }}>
          <Typography variant="body2">{item.receivedAt}</Typography>
          <Typography variant="caption" color="text.secondary">{item.receivedTime}</Typography>
        </TableCell>
        <TableCell align="right" sx={{ py: 1.5 }}>
          <Typography variant="body2">{item.weight}</Typography>
        </TableCell>
        <TableCell align="right" sx={{ py: 1.5 }}>
          <Typography variant="body2">{item.volWeight}</Typography>
        </TableCell>
        <TableCell sx={{ py: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton 
              size="small" 
              sx={{ 
                bgcolor: '#7360F2', 
                color: '#f8f8f8', 
                '&:hover': { backgroundColor: '#5b48d8' },
                width: 28,
                height: 28
              }}
            >
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