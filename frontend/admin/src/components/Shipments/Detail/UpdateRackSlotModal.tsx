import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, Box, Grid, TextField, Button, CircularProgress, MenuItem, Stack, Typography, IconButton
} from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import type { Rack } from '../../../types';
import { getRacks } from '../../../services/api.services';

interface UpdateRackSlotModalProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  shipments: {
    id: string;
    rack_slot?:{
      label: string;
    };
    updated_by?: {
      name: string;
    };
    updated_at: string;
  };
}

const UpdateRackSlotModal: React.FC<UpdateRackSlotModalProps> = ({ open, onClose, onRefresh, shipments }) => {
  const [rackSlots, setRackSlots] = useState<Rack[]>([]);
  const [selectedRackSlot, setSelectedRackSlot] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingRacks, setLoadingRacks] = useState(false);

  const fetchRacks = useCallback(async () => {
    setLoadingRacks(true);
    try {
      const data = await getRacks();
      setRackSlots(data);
      const currentRack = data.find((r) => r.label === shipments.rack_slot?.label);
      if (currentRack) {
        setSelectedRackSlot(currentRack.id);
      }
    } catch (err) {
      console.error("Failed to fetch racks", err);
    } finally {
      setLoadingRacks(false);
    }
  }, [shipments.rack_slot?.label]);

  useEffect(() => {
    if (open) {
      fetchRacks();
    }
  }, [open, fetchRacks]);

  const currentRack = useMemo(() =>
    rackSlots.find(r => r.id === selectedRackSlot || r.label === shipments.rack_slot?.label),
    [rackSlots, selectedRackSlot, shipments.rack_slot?.label]
  );

  const handleSaveRackSlot = async () => {
    if (!selectedRackSlot) return;
    setSaving(true);
    try {
        // Replce with to update rack slot of the Shipment
    //   await updatePackage(packageData.id, { rack_slot: selectedRackSlot });
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
                  value={selectedRackSlot || ""}
                  onChange={handleRackChange}
                  sx={{
                    "& .MuiSelect-select": {
                      minWidth: "10rem",
                      display: "flex",
                      alignItems: "center",
                    },
                  }}
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
                  disabled={saving || !selectedRackSlot || selectedRackSlot === rackSlots.find(r => r.label === shipments.rack_slot?.label)?.id}
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

            {shipments.rack_slot && currentRack && (
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
                      {shipments.updated_by?.name} on {shipments.updated_at}
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
