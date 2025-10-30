import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { formatDateTime } from '../../utils/formatDateTime';

interface Measurement {
  piece_number: number;
  weight: string;
  volumetric_weight: string;
  has_measurements: boolean;
  length?: number;
  width?: number;
  height?: number;
}

interface MeasurementsTableProps {
  measurements?: Measurement[];
  createdBy?: string;
  createdAt?: string;
}

const MeasurementsTable: React.FC<MeasurementsTableProps> = ({ measurements, createdBy, createdAt }) => {
  const processedMeasurements = useMemo(() => {
    return measurements?.map((m) => {
      let volumetricWeight = '-';
      if (m.volumetric_weight) {
        volumetricWeight = `${m.volumetric_weight}Kg`;
      } else if (m.has_measurements && m.length && m.width && m.height) {
        const calculatedVolWeight =
          (parseFloat(String(m.length)) * parseFloat(String(m.width)) * parseFloat(String(m.height))) / 5000;
        volumetricWeight = `${calculatedVolWeight.toFixed(3)}Kg`;
      }

      return {
        pieceNumber: m.piece_number,
        weight: `${m.weight || 0}Kg`,
        volumetricWeight,
        hasMeasurements: m.has_measurements,
        length: m.length,
        width: m.width,
        height: m.height,
      };
    });
  }, [measurements]);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
        {processedMeasurements?.length || 0} Piece Measurements
      </Typography>

      {measurements && measurements.length > 0 ? (
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
              {processedMeasurements?.map((measurement, index) => (
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
        {createdBy
          ? `Created By ${createdBy} on ${formatDateTime(createdAt)}`
          : `Created On ${formatDateTime(createdAt)}`
        }
      </Typography>
    </Box>
  );
};

export default MeasurementsTable;
