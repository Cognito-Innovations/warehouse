import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton } from '@mui/material';
import { Visibility as VisibilityIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import type { PreArrival } from '../../types/PreArrival';
import ReceiveModal from './ReceiveModal';
import ActionsMenu from './ActionsMenu';

interface PreArrivalsTableProps {
  data: PreArrival[];
  onMarkAsReceive: (item: PreArrival) => void;
  onDelete: (item: PreArrival) => void;
  onReceive: (item: PreArrival) => void;
}

const PreArrivalsTable: React.FC<PreArrivalsTableProps> = ({ data, onMarkAsReceive, onDelete, onReceive }) => {
  const safeData = Array.isArray(data) ? data : [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PreArrival | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRowItem, setSelectedRowItem] = useState<PreArrival | null>(null);

  const handleEyeClick = (item: PreArrival) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleThreeDotsClick = (event: React.MouseEvent<HTMLElement>, item: PreArrival) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowItem(item);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRowItem(null);
  };

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', paddingY: "10px" }}>OTP / Tracking No</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', paddingY: "10px" }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', paddingY: "10px" }}>ETA</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', paddingY: "10px" }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', paddingY: "10px" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', paddingY: "10px" }}>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              {safeData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No pre-arrivals found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                safeData.map((row) => (
                  <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                    <TableCell sx={{ paddingY: "10px" }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>{row.otp}</Typography>
                        {row.tracking_no && (<Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, }}>{row.tracking_no}</Typography>)}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ paddingY: "10px" }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#0e0e0eba' }}>{row.customer}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, color: '#595959ba' }}>{row.suite}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ paddingY: "10px" }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{row.estimate_arrival_time}</Typography>
                    </TableCell>
                    <TableCell sx={{ paddingY: "10px" }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#696e74' }}>{new Date(row.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, color: '#595959ba' }}>{new Date(row.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ paddingY: "10px" }}>
                      <Chip label={row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase()} size="small" sx={{ bgcolor: row.status.toLowerCase() === 'received' ? '#dcfce7' : '#fef3c7', color: row.status.toLowerCase() === 'received' ? '#166534' : '#92400e', fontWeight: 600, fontSize: '0.75rem' }} />
                    </TableCell>
                    <TableCell sx={{ paddingY: "10px" }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" sx={{ color: '#64748b' }} onClick={() => handleEyeClick(row)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#64748b' }} onClick={(e) => handleThreeDotsClick(e, row)}>
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ReceiveModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedItem={selectedItem}
        onReceive={() => selectedItem && onReceive(selectedItem)}
      />

      <ActionsMenu
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        selectedRowItem={selectedRowItem}
        onMarkAsReceive={() => selectedRowItem && onMarkAsReceive(selectedRowItem)}
        onDelete={() => selectedRowItem && onDelete(selectedRowItem)}
      />
    </>
  );
};

export default PreArrivalsTable;