import React from 'react';
import {
  Chip,
  IconButton,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import {
  VisibilityOutlined as ViewIcon
} from '@mui/icons-material';
import { getRequestStatusColor } from '../../data/shoppingRequests';
import { useNavigate } from 'react-router-dom';

interface RequestTableBodyProps {
  rows: any[];
}

const RequestTableBody: React.FC<RequestTableBodyProps> = ({ rows }) => {
  const navigate = useNavigate();

  const handleViewDetails = (orderNo: string) => {
    navigate(`/requests/${encodeURIComponent(orderNo)}`);
  };

  return (
  <TableBody>
    {rows.map((row) => {
      const status = getRequestStatusColor(row.status);
      return (
        <TableRow key={row.orderNo} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell>
            <Typography variant="body2" fontWeight={500}>{row.orderNo}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body2">{row.requestedAt.date}</Typography>
            <Typography variant="caption" color="text.secondary">{row.requestedAt.time}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body2" fontWeight={500}>{row.customer.name}</Typography>
            <Typography variant="caption" color="text.secondary">{row.customer.id}</Typography>
          </TableCell>
          <TableCell>
            <Chip
              label={row.status}
              size="small"
              sx={{
                color: status.color,
                bgcolor: status.bgColor,
                fontWeight: 600,
                fontSize: '0.75rem',
                borderRadius: '6px',
                textTransform: 'uppercase'
              }}
            />
          </TableCell>
          <TableCell>
            <Typography variant="body2">{row.noOfItems}</Typography>
          </TableCell>
          <TableCell align="right">
            <IconButton 
              size="small" 
              sx={{ bgcolor: '#7360F2', color: '#f8f8f8', '&:hover': { backgroundColor: '#5b48d8' }}}
              onClick={() => handleViewDetails(row.orderNo)}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    })}
  </TableBody>
  );
};

export default RequestTableBody;