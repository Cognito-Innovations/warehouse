import { TableCell, TableRow } from "@mui/material";
import { useShipmentDetail } from "../../../contexts/ShipmentDetailContext";
import { PrintLabelButton } from "./PrintLabelButton";

interface MeasurementRowProps {
  measurement: {
    pieceNumber: number;
    weight: string;
    volumetricWeightDisplay: React.ReactNode;
  };
}

export const MeasurementRow: React.FC<MeasurementRowProps> = ({ measurement }) => {
  const { shipment } = useShipmentDetail();

  const getLabel = (trackingNo: string) => {
    const lastFour = trackingNo.slice(-4);
    return `${lastFour}-1A`;
  };

  return (
    <TableRow>
      <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{measurement.pieceNumber}</TableCell>
      <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{measurement.weight}</TableCell>
      <TableCell>{measurement.volumetricWeightDisplay}</TableCell>
      <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{getLabel(shipment.tracking_no)}</TableCell>

      <TableCell align='right' sx={{ pr: 2 }}>
        <PrintLabelButton />
      </TableCell>
    </TableRow>
  );
};