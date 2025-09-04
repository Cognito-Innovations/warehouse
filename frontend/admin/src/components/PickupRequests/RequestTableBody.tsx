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
import { useNavigate } from 'react-router-dom';
import type { PickupRequest } from '../../types';
import { formatDateTime } from '../../utils/formatDateTime';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'REQUESTED':
      return { color: '#F59E0B', bgColor: '#FEF3C7' }; // yellow
    case 'PAID':
      return { color: '#059669', bgColor: '#D1FAE5' }; // green
    case 'CANCELLED':
      return { color: '#DC2626', bgColor: '#FEE2E2' }; // red
    case 'PICKED':
      return { color: '#2563EB', bgColor: '#DBEAFE' }; // blue
    default:
      return { color: '#6B7280', bgColor: '#F3F4F6' }; // gray
  }
};

interface RequestTableBodyProps {
  rows: PickupRequest[];
}

const RequestTableBody: React.FC<RequestTableBodyProps> = ({ rows }) => {
  const navigate = useNavigate();

  const handleViewDetails = (requestNo: string) => {
    navigate(`/pickups/${encodeURIComponent(requestNo)}`);
  };

  return (
  <TableBody>
    {rows.map((row) => {
      const status = getStatusColor(row.status || 'REQUESTED');
      return (
        <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell>
            <Typography variant="body2" fontWeight={500}>{row.id}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body2">{formatDateTime(row.created_at)}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="caption" color="text.secondary">{row.users.name}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body2" fontWeight={500}>{row.pickup_address}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body2" fontWeight={500}>{row.supplier_name}</Typography>
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
          <TableCell align="right">
            <IconButton 
              size="small" 
              sx={{ bgcolor: '#7360F2', color: '#f8f8f8', '&:hover': { backgroundColor: '#5b48d8' }}}
              onClick={() => handleViewDetails(row.id!)}
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