import React, { useEffect, useMemo, useState } from 'react';
import { Edit as EditIcon, CloseOutlined } from '@mui/icons-material';
import { Box, Typography, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, CircularProgress, Stack, IconButton } from '@mui/material';
import { getRacks, updatePackage } from '../../services/api.services';
import type { Rack, Status } from '../../types';

interface PackageDetailsSectionProps {
  packageData: {
    actual_id: string;
    trackingNo: string;
    weight: string;
    volumetricWeight: string;
    dangerousGood: string;
    createdBy: string;
    createdAt: string;
    status?: Status;
    rack?: string,
    rackColor?: string,
    count?: number;
    measurements?: {
      pieceNumber: number;
      weight: string;
      volumetricWeight: string;
      hasMeasurements: boolean;
      length?: number;
      width?: number;
      height?: number;
    }[];
  };
  onRefresh: () => void;
}

const PackageDetailsSection: React.FC<PackageDetailsSectionProps> = ({ packageData, onRefresh }) => {
  const [openModal, setOpenModal] = useState(false);
  const [rackModalOpen, setRackModalOpen] = useState(false);
  const [rackSlots, setRackSlots] = useState<Rack[]>([]);
  const [selectedRackSlot, setSelectedRackSlot] = useState('');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    trackingNo: packageData.trackingNo || "",
    weight: packageData.weight || "",
    volumetricWeight: packageData.volumetricWeight || "",
    dangerousGood: packageData.dangerousGood === "Yes" ? "true" : "false",
    rackSlot: "",
  });

  const fetchRacks = async () => {
    try {
      const data = await getRacks();
      setRackSlots(data);
    
      const currentRack = data.find((r) => r.label === packageData.rack);
      if (currentRack) {
        setSelectedRackSlot(currentRack.id);
      }
    } catch (err) {
      console.error("Failed to fetch racks", err);
    }
  };

  useEffect(() => {
    if (rackModalOpen) {
      fetchRacks();
    }
  }, [rackModalOpen, packageData.rack]);

  const currentRack = useMemo(() => 
    rackSlots.find(r => r.id === selectedRackSlot || r.label === packageData.rack), 
    [rackSlots, selectedRackSlot, packageData.rack]
  );

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

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
      handleCloseModal();
    } catch (err) {
      console.error("Failed to update package", err);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenRackModal = () => {
    setRackModalOpen(true);
    fetchRacks();
  };

  const handleCloseRackModal = () => {
    setRackModalOpen(false);
  };

  const handleSaveRackSlot = async () => {
    if (!selectedRackSlot) return;
    setSaving(true);
    try {
      await updatePackage(packageData.actual_id, { rack_slot: selectedRackSlot });
      onRefresh();
      setRackModalOpen(false);
    } catch (err) {
      console.error("Failed to update rack slot", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card sx={{ mb: 3, px: 1 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
              Package Details
            </Typography>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleOpenModal}
              sx={{
                bgcolor: '#3b82f6',
                '&:hover': { bgcolor: '#2563eb' },
                textTransform: 'none',
                borderRadius: 1
              }}
            >
              Update Information
            </Button>
          </Box>

          {/* Two Column Layout */}
          <Grid container spacing={4} sx={{ mb: 3 }}>
            {/* Left Column */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mb: 0.5 }}>
                  Tracking No.
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {packageData.trackingNo}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mb: 0.5 }}>
                  Volumetric Weight
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {packageData.volumetricWeight}
                </Typography>
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mb: 0.5 }}>
                  Weight
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {packageData.weight}
                </Typography>
              </Box>
                             <Box sx={{ mb: 2 }}>
                 <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mb: 0.5 }}>
                   Dangerous Good
                 </Typography>
                 <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    ⛔️  {packageData.dangerousGood}
                 </Typography>
               </Box>
            </Grid>
          </Grid>

          {/* Status Indicator */}
           {packageData.rack && (
             <Box
              sx={{ bgcolor: '#f0fdf4', p: 2, borderRadius: 2, border: '1px solid #84cc16', width: "220px", cursor: 'pointer' }}
              onClick={handleOpenRackModal}
             >
               <Typography variant="body2" sx={{ fontWeight: 600, color: '#166534', display: 'flex', alignItems: 'center', gap: 1 }}>
                 {packageData.rack} →
               </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#166534', display: 'flex', alignItems: 'center', gap: 1 }}>
                  {`Slot has ${packageData.count} pkgs`}
                </Typography>
                 
             </Box>
           )}

          {/* Measurements Table */}
           <Box sx={{ mt: 3 }}>
             <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
               {packageData.measurements?.length || 0} Piece Measurements
             </Typography>
             
             {packageData.measurements && packageData.measurements.length > 0 ? (
               <TableContainer>
                 <Table size="small">
                   <TableHead>
                     <TableRow>
                       <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>#</TableCell>
                       <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>Weight</TableCell>
                       <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>Dimensions (L×W×H)</TableCell>
                       <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>Volumetric Weight</TableCell>
                     </TableRow>
                   </TableHead>
                   <TableBody>
                     {packageData.measurements.map((measurement, index) => (
                       <TableRow key={index}>
                         <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{measurement.pieceNumber}</TableCell>
                         <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{measurement.weight}</TableCell>
                         <TableCell>
                           {measurement.hasMeasurements && measurement.length && measurement.width && measurement.height ? (
                             <Typography component="span" sx={{ color: '#1e293b' }}>
                               {measurement.length}×{measurement.width}×{measurement.height} cm
                             </Typography>
                           ) : (
                             <Typography component="span" sx={{ color: '#ef4444', fontSize: '0.875rem' }}>
                               No dimensions
                             </Typography>
                           )}
                         </TableCell>
                         <TableCell>
                           {measurement.hasMeasurements ? (
                             <Typography component="span" sx={{ color: '#1e293b' }}>
                               {measurement.volumetricWeight}
                             </Typography>
                           ) : (
                             <Typography component="span" sx={{ color: '#ef4444', fontSize: '0.875rem' }}>
                               Not calculated
                             </Typography>
                           )}
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </TableContainer>
             ) : (
               <Box sx={{ 
                 p: 3, 
                 textAlign: 'center', 
                 bgcolor: '#f8fafc', 
                 borderRadius: 2, 
                 border: '1px solid #e2e8f0' 
               }}>
                 <Typography variant="body2" sx={{ color: '#64748b' }}>
                   No piece measurements available
                 </Typography>
               </Box>
             )}
             
             <Typography variant="caption" sx={{ mt: 2, display: 'block', color: '#64748b', maxWidth: "250px" }}>
               Created By {packageData.createdBy} on {packageData.createdAt}
             </Typography>
           </Box>
        </CardContent>
      </Card>

      {/* Update Information Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
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
          <Button onClick={handleCloseModal} sx={{ textTransform: 'none' }}>
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

       <Dialog 
        open={rackModalOpen} 
        onClose={handleCloseRackModal} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Rack Movements
          <IconButton onClick={handleCloseRackModal} sx={{ color: '#64748b' }}>
            <CloseOutlined />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} alignItems="center" sx={{ pt: 1 }}>
            <Grid item xs={8}>
              <TextField
                select
                fullWidth
                required
                label="Rack Slot"
                value={selectedRackSlot}
                onChange={(e) => setSelectedRackSlot(e.target.value)}
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
                          backgroundColor: r.color || '#cccccc', // Fallback color
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
                    {packageData.createdBy} on {new Date(parseInt(packageData.createdAt) * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
};

export default PackageDetailsSection;
