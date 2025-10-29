import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { formatDateTime } from '../../../utils/formatDateTime';
import { formatDimensions } from '../../../utils/formatDimenssion';
import { generateCarrierLabelPDF } from '../../PDF/CarrierLabelPDF';
import { toast } from 'sonner';

interface MeasurementsTableProps {
  shipments?: any;
  isDiscarded: boolean;
}

const MeasurementsTable: React.FC<MeasurementsTableProps> = ({ shipments, isDiscarded }) => {
  const [loading, setLoading] = useState(false);

  const handlePrintClick = async () => {
    if (!shipments) return;
    setLoading(true);
    try {
      await generateCarrierLabelPDF({ ...shipments, num_pieces: "1 PCS" })
      toast.success("Carrier label generated")
    } catch (error) {
      toast.error("Failed to generate Carrier Label PDF");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const processedMeasurements = useMemo(() => {
    if (!shipments) {
      return [];
    }

    let volumetricWeightDisplay: React.ReactNode;

    if (shipments.total_volumetric_weight) {
      const volWeight = parseFloat(shipments.total_volumetric_weight).toFixed(2);
      
      let dimensions = '';
      if (shipments.length && shipments.width && shipments.height) {
        dimensions = `(${formatDimensions(shipments.length)}cm x ${formatDimensions(shipments.width)}cm x ${formatDimensions(shipments.height)}cm)`;
      }

      volumetricWeightDisplay = (
        <Typography component="span" sx={{ color: '#1e293b' }}>
          {volWeight} kg
          {dimensions && (
            <Typography component="span" sx={{ color: '#64748b', ml: 0.5, fontSize: '0.875rem' }}>
              {dimensions}
            </Typography>
          )}
        </Typography>
      );
    } else {
      volumetricWeightDisplay = (
        <Box component="span">
          <Typography
            component="span"
            sx={{ color: '#1e293b', fontWeight: 600 }}
          >
            -
          </Typography>
          <Typography
            component="span"
            sx={{ color: '#ef4444', fontWeight: 600, ml: 0.5 }}
          >
            (no measurements)
          </Typography>
        </Box>
      );
    }

    return [
      {
        pieceNumber: 1,
        weight: shipments.total_weight ? `${shipments.total_weight} Kg` : '-',
        volumetricWeightDisplay,
      },
    ];
  }, [shipments]);

  const getLabel = (trackingNo?: string) => {
    if (!trackingNo) return '-';
    const lastFour = trackingNo.slice(-4);
    return `${lastFour}-1A`;
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
        {processedMeasurements?.length || 0} Piece Measurements
      </Typography>

      {processedMeasurements && processedMeasurements.length > 0 ? (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>Weight</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>Volumetric Weight(L×W×H)</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>Label</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>

            <TableBody>
              {processedMeasurements?.map((measurement, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{measurement.pieceNumber}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{measurement.weight}</TableCell>
                  <TableCell>{measurement.volumetricWeightDisplay}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{getLabel(shipments?.tracking_no)}</TableCell>

                  <TableCell align='right' sx={{ pr: 2 }}>
                    <IconButton
                      onClick={!isDiscarded ? handlePrintClick : undefined}
                      disabled={loading || isDiscarded}
                      sx={{
                        width: 26,
                        height: 26,
                        bgcolor: isDiscarded ? '#cbd5e1' : '#0ea5e9',
                        color: isDiscarded ? '#64748b' : '#fff',
                        borderRadius: '50%',
                        cursor: isDiscarded ? 'not-allowed' : 'pointer',
                        opacity: isDiscarded ? 0.6 : 1,
                        '&:hover': !isDiscarded && {
                          bgcolor: '#0284c7'
                        }
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={20} sx={{ color: '#fff' }} />
                      ) : (
                        <PrintIcon fontSize='small' />
                      )}
                    </IconButton>
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
        Created By {shipments?.user?.name} on {formatDateTime(shipments.created_at)}
      </Typography>
    </Box>
  );
};

export default MeasurementsTable;
