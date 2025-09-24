import React from 'react';
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

interface Measurement {
  pieceNumber: number;
  weight: string;
  volumetricWeight: string;
  hasMeasurements: boolean;
  length?: number;
  width?: number;
  height?: number;
}

interface MeasurementsTableProps {
  measurements?: Measurement[];
  createdBy: string;
  createdAt: string;
}

const MeasurementsTable: React.FC<MeasurementsTableProps> = ({ measurements, createdBy, createdAt }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
        {measurements?.length || 0} Piece Measurements
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
              {measurements.map((measurement, index) => (
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
        Created By {createdBy} on {createdAt}
      </Typography>
    </Box>
  );
};

export default MeasurementsTable;
