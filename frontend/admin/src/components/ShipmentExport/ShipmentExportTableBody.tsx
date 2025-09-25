import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
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
import { useNavigate } from 'react-router-dom';
import { deleteShipmentExport } from '../../services/api.services';
import { getStatusColor } from '../../data/shipmentExports';
import UpdateMawbModal from './UpdateMawbModal';
import ConfirmDialog from '../common/ConfirmDialog';

interface ShipmentExportTableBodyProps {
  rows: any[];
  loading: boolean;
  onUpdate: () => void;
}

const ShipmentExportTableBody: React.FC<ShipmentExportTableBodyProps> = ({ rows, loading, onUpdate }) => {
  const [mawbModalOpen, setMawbModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const handleOpenMawbModal = (row: any) => {
    setSelectedRow(row);
    setMawbModalOpen(true);
  };

  const handleCloseMawbModal = () => {
    setMawbModalOpen(false);
    setSelectedRow(null);
  };

  const handleConfirmDelete = (id: string) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setDeleting(true);
      await deleteShipmentExport(deletingId);
      await onUpdate();
      setConfirmOpen(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Failed to delete export:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleViewDetails = (row: any) => {
    navigate(`/shipment/export/${row.id}`);
  };

  if (loading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={7} align="center">
            <CircularProgress size={28} />
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (rows.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={7} align="center">
            <Typography variant="body2" color="text.secondary">
              No shipments found
            </Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <>
    <TableBody>
      {rows.map((row) => {
        const status = getStatusColor(row.status);
        return (
          <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell>
              <Typography variant="body2">{row.export_code}</Typography>
            </TableCell>
            <TableCell>{row.created_at}</TableCell>
            <TableCell>
              {row.mawb ? (
                <Typography variant="body2">{row.mawb}</Typography>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  sx={{ textTransform: 'none', borderRadius: 1.5, boxShadow: 'none' }}
                  onClick={() => handleOpenMawbModal(row)}
                >
                  Add MAWB
                </Button>
              )}
            </TableCell>
            <TableCell>{row.boxes_count}</TableCell>
            <TableCell>{row.created_by}</TableCell>
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
                  onClick={() => handleViewDetails(row)}
                >
                  <ViewIcon fontSize="small" />
                </IconButton>
                {row.status === 'DRAFT' && (
                  <IconButton 
                    size="small" 
                    sx={{ bgcolor: '#e27055', color: '#f8f8f8', '&:hover': { backgroundColor: '#cc6046' }}}
                     onClick={() => handleConfirmDelete(row.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>

     <UpdateMawbModal
        open={mawbModalOpen}
        onClose={handleCloseMawbModal}
        onUpdate={onUpdate}
        shipment={selectedRow}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Shipment Export"
        message="Are you sure you want to delete this shipment export?"
        confirmText="Delete"
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
        isLoading={deleting}
      />
  </>
  )
};

export default ShipmentExportTableBody;