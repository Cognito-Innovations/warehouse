import React from 'react';
import { Paper, Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import PreArrivalsTableBody from './PreArrivalsTableBody';
import { PRE_ARRIVALS_TABLE_HEADERS } from '../../utils/constants';
import type { PreArrival } from '../../types/PreArrival';

interface PreArrivalsTableProps {
  data: PreArrival[];
  onMarkAsReceive: (item: PreArrival) => Promise<void>;
  onDelete: (item: PreArrival) => void;
  onReceive: (item: PreArrival) => Promise<void>;
}

const PreArrivalsTable: React.FC<PreArrivalsTableProps> = ({ data, onMarkAsReceive, onDelete, onReceive }) => {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                {PRE_ARRIVALS_TABLE_HEADERS.map((header) => (
                  <TableCell key={header} sx={{ fontWeight: 600, color: '#374151', paddingY: "10px" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
          </TableHead>

          <PreArrivalsTableBody 
            data={data}
            onMarkAsReceive={onMarkAsReceive}
            onDelete={onDelete}
            onReceive={onReceive}
          />
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PreArrivalsTable;