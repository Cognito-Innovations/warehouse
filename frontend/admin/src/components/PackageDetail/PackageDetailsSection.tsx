import React, { useState } from 'react';
import { Edit as EditIcon } from '@mui/icons-material';
import { Box, Typography, Grid, Card, CardContent, Button, CircularProgress } from '@mui/material';
import MeasurementsTable from './MeasurementsTable';
import RackSlotInfo from './RackSlotInfo';
import UpdateInfoModal from './UpdateInfoModal';
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

  const handleOpenInfoModal = () => setInfoModalOpen(true);
  const handleCloseInfoModal = () => setInfoModalOpen(false);

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
            <RackSlotInfo
              packageData={packageData}
              isDiscarded={isDiscarded}
              onRefresh={onRefresh}
            />
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
    </>
  )
};

export default PackageDetailsSection;
