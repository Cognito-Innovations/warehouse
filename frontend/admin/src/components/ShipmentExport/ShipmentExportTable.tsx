import React, { useState } from 'react';
import {
  Card,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
} from '@mui/material';
import { shipmentExports } from '../../data/shipmentExports';
import ShipmentExportFilters from './ShipmentExportFilters';
import ShipmentExportTableBody from './ShipmentExportTableBody';
import dayjs, { Dayjs } from 'dayjs';

interface ShipmentExportTableProps {
  onViewShipment: (id: string) => void;
}

const ShipmentExportTable: React.FC<ShipmentExportTableProps> = ({ onViewShipment }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = selectedDate
    ? shipmentExports.filter((row) =>
        dayjs(row.date).format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
      )
    : shipmentExports;

  const visibleRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <ShipmentExportFilters selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <Card>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell>Serial #</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>MAWB</TableCell>
                <TableCell>Count</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <ShipmentExportTableBody rows={visibleRows} onViewShipment={onViewShipment} />
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[15, 25, 50]}
          component="div"
          count={shipmentExports.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
};

export default ShipmentExportTable;