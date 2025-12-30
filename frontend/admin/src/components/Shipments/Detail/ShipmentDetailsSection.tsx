import React, { useMemo, useState } from 'react';
import { Edit as EditIcon } from '@mui/icons-material';
import { Box, Typography, Card, CardContent, Button, CircularProgress } from '@mui/material';
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

      <Card sx={{ mb: 3, position: 'relative' }}>
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
        
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 3
          }}>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mb: 1 }}>
                REDBOX (air)
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {shipments.tracking_no}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mb: 1 }}>
                Weight
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {totalWeight > 0 ? `${totalWeight.toFixed(2)} kg` : '-'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mb: 1 }}>
                Volumetric Weight
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {totalVolumetricWeight > 0 ? `${totalVolumetricWeight.toFixed(2)} kg` : '-'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 3
          }}>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mb: 1 }}>
                Customs Value
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {shipments.customs_value ? `$${parseFloat(shipments.customs_value).toFixed(2)}` : '0.00'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mb: 1 }}>
                Dangerous Good
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {shipments?.dangerous_good ? '⛔️ Yes' : 'No'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mb: 1 }}>
                Packages Count
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {packagesCount}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 3,
            alignItems: 'start',
          }}>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mb: 1 }}>
                Manifested
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {shipments.manifested ? 'Yes' : 'No'}
              </Typography>
            </Box>
            <Box sx={{ 
              pt: { xs: 0, sm: 0 }, 
              display: 'flex',
              alignItems: 'flex-start'
            }}>
              <Box sx={{ 
                flex: 1,
                display: 'flex',
                alignItems: 'flex-start'
              }}>
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
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <MeasurementsTable 
              shipments={shipments}
              isDiscarded={isDiscarded}
            />
          </Box>
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
