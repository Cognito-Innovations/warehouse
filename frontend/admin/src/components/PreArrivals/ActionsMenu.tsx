import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { PreArrival } from '../../types/PreArrival';

interface ActionsMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  selectedRowItem: PreArrival | null;
  onMarkAsReceive: () => void;
  onDelete: () => void;
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({
  anchorEl,
  onClose,
  selectedRowItem,
  onMarkAsReceive,
  onDelete
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem onClick={onMarkAsReceive} disabled={selectedRowItem?.status.toLowerCase() === 'received'}>
        <EditIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
        Mark as Receive
      </MenuItem>
      <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
        <DeleteIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
        Delete
      </MenuItem>
    </Menu>
  );
};

export default ActionsMenu;
