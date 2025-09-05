import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
} from '@mui/material';
import ShipmentExportFilters from './ShipmentExportFilters';
import ShipmentExportTableBody from './ShipmentExportTableBody';
import dayjs, { Dayjs } from 'dayjs';
import { getShipmentExports } from '../../services/api.services';

const ShipmentExportTable: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const fetchExports = async () => {
    setLoading(true);
    try {
      const data = await getShipmentExports();
      setRows(data);
    } catch (err) {
      console.error('Failed to fetch shipment exports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExports();
  }, []);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = selectedDate
    ? rows.filter((row) =>
        dayjs(row.date).format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
      )
    : rows;

  const visibleRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <ShipmentExportFilters selectedDate={selectedDate} onDateChange={setSelectedDate} onUpdate={fetchExports} />
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
              </TableRow>
            </TableHead>
            <ShipmentExportTableBody rows={visibleRows} loading={loading} onUpdate={fetchExports} />
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[15, 25, 50]}
          component="div"
          count={filteredRows.length}
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