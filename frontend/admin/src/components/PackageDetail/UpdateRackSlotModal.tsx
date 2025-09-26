import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, Box, Grid, TextField, Button, CircularProgress, MenuItem, Stack, Typography, IconButton
} from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { getRacks, updatePackage } from '../../services/api.services';
import type { Rack } from '../../types';

interface UpdateRackSlotModalProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  packageData: {
    actual_id: string;
    rack?: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
  };
}

const UpdateRackSlotModal: React.FC<UpdateRackSlotModalProps> = ({ open, onClose, onRefresh, packageData }) => {
  const [rackSlots, setRackSlots] = useState<Rack[]>([]);
  const [selectedRackSlot, setSelectedRackSlot] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingRacks, setLoadingRacks] = useState(false);

  const fetchRacks = async () => {
    setLoadingRacks(true);
    try {
      const data = await getRacks();
      setRackSlots(data);
      const currentRack = data.find((r) => r.label === packageData.rack);
      if (currentRack) {
        setSelectedRackSlot(currentRack.id);
      }
    } catch (err) {
      console.error("Failed to fetch racks", err);
    } finally {
      setLoadingRacks(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchRacks();
    }
  }, [open, packageData.rack]);

  const currentRack = useMemo(() =>
    rackSlots.find(r => r.id === selectedRackSlot || r.label === packageData.rack),
    [rackSlots, selectedRackSlot, packageData.rack]
  );

  const handleSaveRackSlot = async () => {
    if (!selectedRackSlot) return;
    setSaving(true);
    try {
      await updatePackage(packageData.actual_id, { rack_slot: selectedRackSlot });
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Failed to update rack slot", err);
    } finally {
      setSaving(false);
    }
  };

  const handleRackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRackSlot(e.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ fontWeight: 600, color: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Rack Movements
        <IconButton onClick={onClose} sx={{ color: '#64748b' }}>
          <CloseOutlined />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {loadingRacks ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={2} alignItems="center" sx={{ pt: 1 }}>
              <Grid item xs={8}>
                <TextField
                  select
                  fullWidth
                  required
                  label="Rack Slot"
                  value={selectedRackSlot}
                  onChange={handleRackChange}
                >
                  {rackSlots.map(r => (
                    <MenuItem key={r.id} value={r.id}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box
                          component="span"
                          sx={{
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            backgroundColor: r.color || '#cccccc',
                            flexShrink: 0
                          }}
                        />
                        <Typography variant="body2" component="span">
                          {r.label}
                        </Typography>
                        <Typography variant="body2" component="span" sx={{ color: '#64748b' }}>
                          (Slot has {r.count} packages)
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <Button
                  onClick={handleSaveRackSlot}
                  variant="contained"
                  fullWidth
                  disabled={saving || !selectedRackSlot || selectedRackSlot === rackSlots.find(r => r.label === packageData.rack)?.id}
                  sx={{
                    textTransform: 'none',
                    bgcolor: '#4f46e5',
                    '&:hover': { bgcolor: '#4338ca' },
                  }}
                >
                  {saving ? <CircularProgress size={24} color="inherit" /> : 'Update'}
                </Button>
              </Grid>
            </Grid>

            {currentRack && (
              <Box sx={{ mt: 3, borderTop: '1px solid #e2e8f0', pt: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    component="span"
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      backgroundColor: currentRack.color || '#cccccc',
                      flexShrink: 0
                    }}
                  />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b', textTransform: 'uppercase' }}>
                      {currentRack.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {packageData.updatedBy} on {packageData.updatedAt}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateRackSlotModal;
