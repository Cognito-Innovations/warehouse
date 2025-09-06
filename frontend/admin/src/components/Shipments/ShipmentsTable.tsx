import React from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from '@mui/material';
import { shipments } from '../../data/shipments';
import ShipmentRow from './ShipmentRow';

interface ShipmentsTableProps {
  status: string;
}

const ShipmentsTable: React.FC<ShipmentsTableProps> = ({ status }) => {
    const filtered = status === 'All' ? shipments : shipments.filter(shipment => shipment.status === status);

    return (
        <Card>
          <TableContainer>
            <Table aria-label="collapsible table">
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow
                  sx={{
                    '& > *': {
                      whiteSpace: { xs: 'nowrap', sm: 'nowrap' },
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: '#374151',
                      py: 2,
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox color="primary" />
                  </TableCell>
                  <TableCell />
                  <TableCell>Shipment No.</TableCell>
                  <TableCell>Tracking No.</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Request At</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Pkgs Count</TableCell>
                  <TableCell>Invoice</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((row) => <ShipmentRow key={row.id} row={row} />)}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
    );
};  

export default ShipmentsTable;