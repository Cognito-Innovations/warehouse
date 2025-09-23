import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Box, Grid, TextField, Button, CircularProgress
} from '@mui/material';
import { updatePackage } from '../../services/api.services';

interface UpdateInfoModalProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  packageData: {
    actual_id: string;
    trackingNo: string;
    weight: string;
    volumetricWeight: string;
    dangerousGood: string;
  };
}

const UpdateInfoModal: React.FC<UpdateInfoModalProps> = ({ open, onClose, onRefresh, packageData }) => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    trackingNo: packageData.trackingNo || "",
    weight: packageData.weight || "",
    volumetricWeight: packageData.volumetricWeight || "",
    dangerousGood: packageData.dangerousGood === "Yes" ? "true" : "false",
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        tracking_no: formData.trackingNo,
        weight: formData.weight,
        volumetric_weight: formData.volumetricWeight,
        dangerous_good: formData.dangerousGood === "true",
      };
      await updatePackage(packageData.actual_id, payload);
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Failed to update package", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, color: '#1e293b' }}>
        Update Package Information
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Tracking Number"
                value={formData.trackingNo}
                onChange={handleInputChange('trackingNo')}
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Weight"
                value={formData.weight}
                onChange={handleInputChange('weight')}
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Volumetric Weight"
                value={formData.volumetricWeight}
                onChange={handleInputChange('volumetricWeight')}
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label="Dangerous Good"
                value={formData.dangerousGood}
                onChange={handleInputChange("dangerousGood")}
                SelectProps={{ native: true }}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </TextField>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving}
          sx={{
            bgcolor: '#3b82f6',
            '&:hover': { bgcolor: '#2563eb' },
            textTransform: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          {saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateInfoModal;