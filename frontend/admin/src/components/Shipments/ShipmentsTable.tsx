import React from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import ShipmentRow from './ShipmentRow';

interface ShipmentsTableProps {
  shipments: any[];
  status: string;
  loading?: boolean;
}

const ShipmentsTable: React.FC<ShipmentsTableProps> = ({ shipments, status, loading }) => {
  const filteredShipments = shipments.filter(
    (s) => status === 'All' || s.status === status
  );
    
    return (
        <Card>
          <TableContainer>
            <Table aria-label="collapsible table">
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow
                  sx={{
                    '& > *': {
                      whiteSpace: { xs: 'nowrap', sm: 'nowrap' },
                      fontWeight: 600,
                      color: '#374151',
                      py: 2,
                    },
                  }}
                >
                  <TableCell/>
                  <TableCell>Shipment No.</TableCell>
                  <TableCell>Tracking No.</TableCell>
                  <TableCell sx={{ width: 140 }}>Customer</TableCell>
                  <TableCell>Request At</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Pkgs Count</TableCell>
                  <TableCell>Invoice</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredShipments.length > 0 ? (
                  filteredShipments.map((shipment) => ( 
                  <ShipmentRow key={shipment.id} row={shipment} />
                ))
              ): (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
                    No shipments found
                  </TableCell>
                </TableRow>
              )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
    );
};  

export default ShipmentsTable;