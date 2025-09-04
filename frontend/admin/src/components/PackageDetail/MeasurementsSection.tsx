import React from 'react';
import { Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

interface MeasurementsSectionProps {
  packageData: {
    createdBy: string;
    createdAt: string;
  };
}

const MeasurementsSection: React.FC<MeasurementsSectionProps> = ({ packageData }) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
          1 Piece Measurements
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>Weight</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>Volumetric Weight (LxWxH)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>1</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>0.75 kg</TableCell>
                <TableCell>
                  <Typography component="span" sx={{ color: '#1e293b' }}>- </Typography>
                  <Typography component="span" sx={{ color: '#ef4444', fontSize: '0.875rem' }}>
                    (No measurements)
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="caption" sx={{ mt: 2, display: 'block', color: '#64748b', maxWidth: "250px" }}>
          Created By {packageData.createdBy} on {packageData.createdAt}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MeasurementsSection;
