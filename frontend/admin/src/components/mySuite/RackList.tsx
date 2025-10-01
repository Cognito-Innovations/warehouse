import React from 'react';
import { Box, Stack, Typography, IconButton, Divider, CircularProgress } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import CopyButton from './CopyButton';
import type { Rack } from '../../types';

interface RackListProps {
  racks: Rack[];
  onEdit: (rack: Rack) => void;
  onDelete: (id: string) => void;
  deletingRackId: string | null;
}

const RackList: React.FC<RackListProps> = ({ racks, onEdit, onDelete, deletingRackId }) => {
  if (racks.length === 0) {
    return (
      <Typography align="center" color="text.secondary" sx={{ py: 5 }}>
        No racks available. Add your first rack.
      </Typography>
    );
  }

  return (
    <Box>
      {racks.map((rack, i) => (
        <React.Fragment key={rack.id}>
          <Stack direction="row" alignItems="center" sx={{ py: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: rack.color }} />
              <Typography fontWeight={500} flexGrow={1}>{rack.label}</Typography>
              <Typography color="text.secondary" fontWeight={500}>{rack.count}</Typography>
            </Stack>

            <Stack direction="row" spacing={1} ml={3}>
              <CopyButton text={rack.label} />
              <IconButton 
                size="small" 
                sx={{ bgcolor: '#e0e7ff', color: '#4f46e5', '&:hover': { bgcolor: '#c7d2fe' } }}
                onClick={() => onEdit(rack)}
              >
                <Edit fontSize="inherit" />
              </IconButton>
              <IconButton 
                size="small" 
                disabled={deletingRackId === rack.id}
                sx={{ bgcolor: '#ffe4e6', color: '#e11d48', '&:hover': { bgcolor: '#fecdd3' } }}
                onClick={() => onDelete(rack.id!)}
              >
                {deletingRackId === rack.id ? <CircularProgress size={16} /> : <Delete fontSize="inherit" />}
              </IconButton>
            </Stack>
          </Stack>

          {i < racks.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default RackList;
