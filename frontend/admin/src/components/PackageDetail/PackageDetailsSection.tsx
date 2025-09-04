import React, { useState } from 'react';
import { Edit as EditIcon } from '@mui/icons-material';
import { Box, Typography, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

interface PackageDetailsSectionProps {
  packageData: {
    trackingNo: string;
    weight: string;
    volumetricWeight: string;
    dangerousGood: string;
    createdBy: string;
    createdAt: string;
    status?: string;
    rack?: string,
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
}

const PackageDetailsSection: React.FC<PackageDetailsSectionProps> = ({ packageData }) => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    trackingNo: packageData.trackingNo,
    weight: packageData.weight,
    volumetricWeight: packageData.volumetricWeight,
    dangerousGood: packageData.dangerousGood,
  });

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

  const handleSave = () => {
    console.log('Saving package data:', formData);
    handleCloseModal();
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
           {packageData.status && (
             <Box sx={{ bgcolor: '#f0fdf4', p: 2, borderRadius: 2, border: '1px solid #84cc16', width: "220px" }}>
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
                  fullWidth
                  label="Dangerous Good"
                  value={formData.dangerousGood}
                  onChange={handleInputChange('dangerousGood')}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
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
            sx={{
              bgcolor: '#3b82f6',
              '&:hover': { bgcolor: '#2563eb' },
              textTransform: 'none'
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
};

export default PackageDetailsSection;
