import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateOrderStatus } from "../../services/api.services";

export interface StatusOption {
  value: string;
  label: string;
}

interface EditOrderStatusModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  currentStatus: string;
  statusOptions: StatusOption[];
  onOrderUpdated: () => void;
}

const EditOrderStatusModal: React.FC<EditOrderStatusModalProps> = ({
  open,
  onClose,
  orderId,
  orderNumber,
  currentStatus,
  statusOptions,
  onOrderUpdated,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedStatus(currentStatus);
      setComment("");
      setLoading(false);
    }
  }, [currentStatus, open]);

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleUpdate = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      await updateOrderStatus(orderId, selectedStatus, comment);
      onOrderUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setLoading(false);
    }
  };

  const isUpdateDisabled = selectedStatus === currentStatus && !comment;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      slotProps={{ backdrop: { style: { pointerEvents: loading ? 'none' : 'auto' } } }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" component="div">
              Edit Order Status
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {orderNumber}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <FormControl fullWidth disabled={loading}>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              label="Status"
              onChange={(e) => setSelectedStatus(e.target.value as string)}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Comment (Optional)"
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={loading}
            placeholder="Add a reason for this status update..."
            variant="outlined"
            InputProps={{
              style: { minHeight: '80px' },
            }}
          />
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} color="secondary" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpdate}
          disabled={isUpdateDisabled || loading}
          variant="contained"
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditOrderStatusModal;