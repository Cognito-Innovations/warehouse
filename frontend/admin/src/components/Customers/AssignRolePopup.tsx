import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  Box,
  CircularProgress,
} from '@mui/material';
import { updateUserRole } from '../../services/api.services';

type Props = {
  open: boolean;
  onClose: () => void;
  userId: string;
  currentRole: string;
  onSuccess: () => void;
};

const roles = [
  { label: 'User', value: 'user' },
  { label: 'Admin', value: 'admin' },
  { label: 'Super Admin', value: 'super_admin' },
];

const AssignRolePopup = ({
  open,
  onClose,
  userId,
  currentRole,
  onSuccess,
}: Props) => {
  const [role, setRole] = useState(currentRole || 'user');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRole(currentRole || 'user');
  }, [currentRole]);

  const handleUpdate = async () => {
    if (role === currentRole) return;

    try {
      setLoading(true);
      await updateUserRole(userId, role);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to update role', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Assign Role</DialogTitle>

      <DialogContent>
        <Box mt={1}>
          <Select
            fullWidth
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={role === currentRole || loading}
        >
          {loading ? (
            <CircularProgress size={18} sx={{ color: 'white' }} />
          ) : (
            'Update'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignRolePopup;
