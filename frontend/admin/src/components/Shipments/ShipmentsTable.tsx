import React from 'react';
import { Card, Table, TableContainer } from '@mui/material';
import ShipmentsTableHeader from './ShipmentsTableHeader';
import ShipmentsTableBody from './ShipmentsTableBody';

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
          <ShipmentsTableHeader />

          <ShipmentsTableBody
            shipments={filteredShipments}
            loading={loading}
          />
        </Table>
      </TableContainer>
    </Card>
  );
}; 

export default ShipmentsTable;