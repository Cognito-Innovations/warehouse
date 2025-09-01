import React from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import {
  DeleteOutlineOutlined as DeleteIcon,
  VisibilityOutlined as ViewIcon,
} from '@mui/icons-material';
import { getStatusColor } from '../../data/shipmentExports';

interface ShipmentExportTableBodyProps {
  rows: any[];
  onViewShipment: (id: string) => void;
}

const ShipmentExportTableBody: React.FC<ShipmentExportTableBodyProps> = ({ rows, onViewShipment }) => (
  <TableBody>
    {rows.map((row) => {
      const status = getStatusColor(row.status);
      return (
        <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell>
            <Typography variant="body2">{row.id}</Typography>
          </TableCell>
          <TableCell>{row.date}</TableCell>
          <TableCell>
            {row.mawb ? (
              <Typography variant="body2">{row.mawb}</Typography>
            ) : (
              <Button
                variant="contained"
                size="small"
                sx={{ textTransform: 'none', borderRadius: 1.5, boxShadow: 'none' }}
              >
                Add MAWB
              </Button>
            )}
          </TableCell>
          <TableCell>{row.count}</TableCell>
          <TableCell>{row.createdBy}</TableCell>
          <TableCell>
            <Chip
              label={row.status}
              size="small"
              sx={{
                color: status.color,
                bgcolor: status.bgColor,
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          </TableCell>
          <TableCell align="right">
            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
              <IconButton 
                size="small" 
                sx={{ bgcolor: '#7360F2', color: '#f8f8f8', '&:hover': { backgroundColor: '#5b48d8' }}}
                onClick={() => onViewShipment(row.id)}
              >
                <ViewIcon fontSize="small" />
              </IconButton>

              {row.status === 'DRAFT' && (
                <IconButton size="small" sx={{ bgcolor: '#e27055', color: '#f8f8f8', '&:hover': { backgroundColor: '#cc6046' }}}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </TableCell>
        </TableRow>
      );
    })}
  </TableBody>
);

export default ShipmentExportTableBody;