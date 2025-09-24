import React, { useState } from 'react';
import { Edit as EditIcon } from '@mui/icons-material';
import { Box, Typography, Grid, Card, CardContent, Button, CircularProgress } from '@mui/material';
import MeasurementsTable from './MeasurementsTable';
import UpdateInfoModal from './UpdateInfoModal';
import UpdateRackSlotModal from './UpdateRackSlotModal';
import type { Status } from '../../types';

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
  isRefreshing?: boolean;
  onRefresh: () => void;
  isDiscarded: boolean;
}

const PackageDetailsSection: React.FC<PackageDetailsSectionProps> = ({
  packageData,
  isRefreshing ,
  onRefresh,
  isDiscarded
}) => {
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [rackModalOpen, setRackModalOpen] = useState(false);

  const handleOpenInfoModal = () => setInfoModalOpen(true);
  const handleCloseInfoModal = () => setInfoModalOpen(false);

  const handleOpenRackModal = () => setRackModalOpen(true);
  const handleCloseRackModal = () => setRackModalOpen(false);

  return (
    <>
      <Card sx={{ mb: 3, px: 1, position: 'relative' }}>
        {isRefreshing && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
              borderRadius: 'inherit',
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
              Package Details
            </Typography>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleOpenInfoModal}
              disabled={isDiscarded}
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

          <Grid container spacing={4} sx={{ mb: 3 }}>
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
                  ⛔️ {packageData.dangerousGood}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {packageData.rack && (
            <Box
             sx={{
              bgcolor: isDiscarded ? '#f1f5f9' : '#f0fdf4', 
              p: 2, borderRadius: 2,
              border: isDiscarded ? '1px solid #cbd5e1' : '1px solid #84cc16', 
              width: "220px",
              cursor: isDiscarded ? 'not-allowed' :'pointer',
              opacity: isDiscarded ? 0.6 : 1,
             }}
             onClick={() => {
               if (!isDiscarded) {
                 handleOpenRackModal();
               }
             }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#166534', display: 'flex', alignItems: 'center', gap: 1 }}>
                {packageData.rack} →
              </Typography>
               <Typography variant="body2" sx={{ fontWeight: 500, color: '#166534', display: 'flex', alignItems: 'center', gap: 1 }}>
                {`Slot has ${packageData.count} pkgs`}
               </Typography>        
            </Box>
          )}

          <MeasurementsTable 
            measurements={packageData.measurements}
            createdBy={packageData.createdBy}
            createdAt={packageData.createdAt}
          />
        </CardContent>
      </Card>

      {infoModalOpen && (
        <UpdateInfoModal
          open={infoModalOpen}
          onClose={handleCloseInfoModal}
          onRefresh={onRefresh}
          packageData={packageData}
        />
      )}

      {rackModalOpen && (
        <UpdateRackSlotModal
          open={rackModalOpen}
          onClose={handleCloseRackModal}
          onRefresh={onRefresh}
          packageData={packageData}
        />
      )}
    </>
  )
};

export default PackageDetailsSection;
