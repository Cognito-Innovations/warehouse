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
import dayjs, { Dayjs } from 'dayjs';
import { toast } from 'sonner';

import { getShipmentExports } from '../../services/api.services';
import ShipmentExportFilters from './ShipmentExportFilters';
import ShipmentExportTableBody, { type ShipmentExportRow } from './ShipmentExportTableBody';
import { SHIPMENT_EXPORT_TABLE_HEADERS } from '../../utils/constants';

const ShipmentExportTable: React.FC = () => {
  const [rows, setRows] = useState<ShipmentExportRow[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchExports = async () => {
    setLoading(true);
    try {
      const data = await getShipmentExports();
      setRows(data);
    } catch (err) {
      toast.error('Failed to fetch shipment exports');
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
        dayjs.unix(Number(row.created_at)).format('YYYY-MM-DD') === 
        selectedDate.format('YYYY-MM-DD')
      )
    : rows;

  const visibleRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleAddRow = (newRow: ShipmentExportRow) => {
    setRows((prev) => [newRow, ...prev]);
  };

  const handleUpdateRow = (updatedRow: ShipmentExportRow) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === updatedRow.id ? { ...row, ...updatedRow } : row
      )
    );
  };

  const handleDeleteRow = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <>
      <ShipmentExportFilters 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onCreate={handleAddRow}
      />

      <Card>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                {SHIPMENT_EXPORT_TABLE_HEADERS.map((header, index) => (
                  <TableCell key={index}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <ShipmentExportTableBody
              rows={visibleRows}
              loading={loading}
              onUpdateRow={handleUpdateRow}
              onDeleteRow={handleDeleteRow}
            />
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