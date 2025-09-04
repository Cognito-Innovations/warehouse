import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Divider,
  Grid,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface AddSupplierModalProps {
  open: boolean;
  onClose: () => void;
}

const AddSupplierModal: React.FC<AddSupplierModalProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Typography component="span" sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
          Add Supplier
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2}>
          {/* Select Country */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required>
              <InputLabel>Select Country</InputLabel>
              <Select
                label="Select Country *"
                size="small"
                sx={{
                  "& .MuiSelect-select": {
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
              >
                <MenuItem value="US">United States</MenuItem>
                <MenuItem value="UK">United Kingdom</MenuItem>
                <MenuItem value="CA">Canada</MenuItem>
                <MenuItem value="AU">Australia</MenuItem>
                <MenuItem value="IN">India</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Name */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              label="Name"
              size="small"
              sx={{
                "& .MuiInputBase-root": { height: 40 },
              }}
            />
          </Grid>

          {/* Contact Number */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Contact Number"
              size="small"
              sx={{
                "& .MuiInputBase-root": { height: 40 },
              }}
            />
          </Grid>

          {/* Postal Code */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Postal Code"
              size="small"
              sx={{
                "& .MuiInputBase-root": { height: 40 },
              }}
            />
          </Grid>

          {/* Address Line */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Address Line"
              multiline
              rows={2}
              placeholder="Full Address line, eg, House Name, Street, Road"
              sx={{
                "& .MuiInputBase-root": {
                  minHeight: "60px",
                },
              }}
            />
          </Grid>

          {/* Website */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Website"
              size="small"
              sx={{
                "& .MuiInputBase-root": { height: 36 },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            bgcolor: "#9ca3af",
            px: 4,
            "&:hover": { bgcolor: "#6b7280" },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSupplierModal;
