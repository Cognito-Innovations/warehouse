import React, { useMemo, useState } from 'react';
import { Edit as EditIcon } from '@mui/icons-material';
import { Box, Typography, Grid, Card, CardContent, Button, CircularProgress } from '@mui/material';
import RackSlotInfo from './RackSlotInfo';
import AddToRackCard from './AddToRackCard';
import MeasurementsTable from './MeasurementsTable';
import UpdateInfoModal from './UpdateInfoModal';

interface Items {
  total_price: number;
}

interface Package {
  total_weight: string;
  total_volumetric_weight: string;
  items: Items[];
}

export interface Pieces {
  id: string;
  piece_number: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  volumetric_weight: number;
  created_at: number;
  updated_at: number;
}

interface ShipmentDetailsSectionProps {
  shipments: {
    id: string;
    tracking_no: string;
    packages: Package[];
    pieces: Pieces[];
    dangerous_good: string;
    customs_value: string;
    total_weight: number;
    total_volumetric_weight: number;
    length: number;
    width: number;
    height: number;
    manifested?: boolean;
    created_by?: {
      name: string;
    }
    created_at: string;
    updated_at: string;
    status?: string;
    rack_slot?: {
      label: string;
      color: string;
      count?: number
    }
  };
  loading?: boolean
  onRefresh: () => void;
  isDiscarded: boolean;
}

const ShipmentDetailsSection: React.FC<ShipmentDetailsSectionProps> = ({
  shipments,
  loading,
  onRefresh,
  isDiscarded,
}) => {
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const handleOpenInfoModal = () => setInfoModalOpen(true);
  const handleCloseInfoModal = () => setInfoModalOpen(false);

  const { totalWeight, totalVolumetricWeight } = useMemo(() => {
    const pieces = shipments?.pieces || [];

    if (pieces.length > 0) {
      const totalWeight = pieces.reduce((acc: number, p: any) => acc + parseFloat(p.weight || '0'), 0);
      const totalVolumetricWeight = pieces.reduce((acc: number, p: any) => acc + parseFloat(p.volumetric_weight || '0'), 0);
      return { totalWeight, totalVolumetricWeight };
    }

    const packages = shipments?.packages || [];
    
    if (!packages.length) {
      return { totalWeight: 0, totalVolumetricWeight: 0 };
    }

    const totalWeight = packages.reduce((acc, pkg) => {
      const weight = parseFloat(pkg.total_weight || '0');
      return acc + (isNaN(weight) ? 0 : weight);
    }, 0);

    const totalVolumetricWeight = packages.reduce((acc, pkg) => {
      const volWeight = parseFloat(pkg.total_volumetric_weight || '0');
      return acc + (isNaN(volWeight) ? 0 : volWeight);
    }, 0);

    return { totalWeight, totalVolumetricWeight };
  }, [shipments.packages, shipments.pieces]);

  const packagesCount = (shipments?.packages || []).length;

  return (
    <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
              Shipment Details
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

      <Card sx={{ mb: 3, px: 1, position: 'relative' }}>
        {loading && (
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
          <Grid container spacing={4} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mb: 0.5 }}>
                  REDBOX (air)
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {shipments.tracking_no}
                </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mb: 0.5 }}>
                  Weight
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {totalWeight > 0 ? `${totalWeight.toFixed(2)} kg` : '-'}
                </Typography>
              </Grid>

            <Grid item xs={12} sm={4}>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mb: 0.5 }}>
                  Volumetric Weight
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {totalVolumetricWeight > 0 ? `${totalVolumetricWeight.toFixed(2)} kg` : '-'}
                </Typography>
            </Grid>
            
            </Grid>

            <Grid container spacing={4} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mb: 0.5 }}>
                      Customs Value
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {shipments.customs_value ? `$${parseFloat(shipments.customs_value).toFixed(2)}` : '0.00'}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mb: 0.5 }}>
                      Dangerous Good
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {shipments?.dangerous_good 
                        ? (
                          <>
                            ⛔️ Yes 
                          </>
                        ) : (
                          'No'
                        )}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mb: 0.5 }}>
                      Packages Count
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {packagesCount}
                    </Typography>
                </Grid>
            </Grid>

            <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mb: 0.5 }}>
                      Manifested
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {shipments.manifested ? 'Yes' : 'No'}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                    {shipments.rack_slot ? (
                      <RackSlotInfo
                        shipments={shipments}
                        onRefresh={onRefresh}
                        isDiscarded={isDiscarded}
                      />
                    ) : (
                      <AddToRackCard
                        shipmentId={shipments.id}
                        onRefresh={onRefresh}
                        isDiscarded={isDiscarded}
                      />
                    )}
                </Grid>
            </Grid>

          <MeasurementsTable 
            shipments={shipments}
            isDiscarded={isDiscarded}
          />
        </CardContent>
      </Card>

      {infoModalOpen && (
        <UpdateInfoModal
          open={infoModalOpen}
          onClose={handleCloseInfoModal}
          onRefresh={onRefresh}
          shipments={shipments}
        />
      )}
    </>
  )
};

export default ShipmentDetailsSection;
