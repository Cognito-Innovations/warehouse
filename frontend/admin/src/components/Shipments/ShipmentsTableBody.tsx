import { TableBody, TableRow, TableCell, CircularProgress } from '@mui/material';
import ShipmentRow from './ShipmentRow';

interface ShipmentsTableBodyProps {
  shipments: any[];
  loading?: boolean;
}

const ShipmentsTableBody = ({ shipments, loading }: ShipmentsTableBodyProps) => {
  if (loading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
            <CircularProgress />
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (shipments.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
            No shipments found
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {shipments.map((shipment) => (
        <ShipmentRow key={shipment.id} row={shipment} />
      ))}
    </TableBody>
  );
};

export default ShipmentsTableBody;