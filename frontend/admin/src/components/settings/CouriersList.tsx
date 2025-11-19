import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import type { Courier } from '../../types';

interface CouriersListProps {
  couriers: Courier[];
  onEdit: (courier: Courier) => void;
}

const CouriersList: React.FC<CouriersListProps> = ({ couriers, onEdit }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
      <Table sx={{ minWidth: 650 }} aria-label="couriers table">
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Contact</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Address</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Country</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#475569', textAlign: 'right' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {couriers.map((courier) => (
            <TableRow key={courier.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>
                <Typography variant="body2" fontWeight="500">{courier.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">{courier.phone_number}</Typography>
                <Typography variant="caption" color="text.secondary">{courier.email}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">{courier.address}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">{courier.country_name}</Typography>
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Edit Courier">
                  <IconButton onClick={() => onEdit(courier)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CouriersList;