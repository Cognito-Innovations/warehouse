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

import { useShipmentDetail } from '../../../contexts/ShipmentDetailContext';
import { MeasurementRow } from './MeasurementRow';
import { VolumetricWeightDisplay } from './VolumetricWeightDisplay';
import { formatDateTime } from '../../../utils/formatDateTime';
import { SHIPMENT_MEASUREMENTS_TABLE_HEADERS } from '../../../utils/constants';
import { normalizeMeasurements } from '../../../utils/measurementNormalizer';

const MeasurementsTable: React.FC = () => {
  const { shipment } = useShipmentDetail();

  const measurements = useMemo(
    () => normalizeMeasurements(shipment),
    [shipment]
  );

  function mapMeasurementToRow(m: any) {
    return {
      pieceNumber: m.pieceNumber,
      weight: m.weight,
      volumetricWeightDisplay: (
        <VolumetricWeightDisplay
          volumetricWeight={m.volumetricWeight}
          dimensions={m.dimensions}
          hasMeasurements={m.hasMeasurements}
        />
      ),
    };
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
        {measurements?.length} Piece Measurements
      </Typography>

      {measurements.length > 0 ? (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {SHIPMENT_MEASUREMENTS_TABLE_HEADERS.map((header) => (
                  <TableCell 
                    key={header} 
                    sx={{ fontWeight: 600, color: '#1e293b' }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {measurements.map((m, index) => (
                <MeasurementRow
                  key={index}
                  measurement={mapMeasurementToRow(m)}
                />
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
        Created By {shipment?.user?.name} on {formatDateTime(shipment?.created_at)}
      </Typography>
    </Box>
  );
};

export default MeasurementsTable;
