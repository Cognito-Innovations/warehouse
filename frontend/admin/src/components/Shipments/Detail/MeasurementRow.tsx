import { TableCell, TableRow } from "@mui/material";
import { PrintLabelButton } from "./PrintLabelButton";

interface MeasurementRowProps {
  measurement: {
    pieceNumber: number;
    weight: string;
    volumetricWeightDisplay: React.ReactNode;
  };
  trackingNo?: string;
  shipments: any;
  isDiscarded: boolean;
}

export const MeasurementRow: React.FC<MeasurementRowProps> = ({ 
  measurement, 
  trackingNo, 
  shipments, 
  isDiscarded 
}) => {
  const getLabel = (trackingNo?: string) => {
    if (!trackingNo) return '-';
    const lastFour = trackingNo.slice(-4);
    return `${lastFour}-1A`;
  };

  return (
    <TableRow>
      <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{measurement.pieceNumber}</TableCell>
      <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{measurement.weight}</TableCell>
      <TableCell>{measurement.volumetricWeightDisplay}</TableCell>
      <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{getLabel(trackingNo)}</TableCell>

      <TableCell align='right' sx={{ pr: 2 }}>
        <PrintLabelButton 
          shipments={shipments} 
          isDiscarded={isDiscarded} 
        />
      </TableCell>
    </TableRow>
  );
};