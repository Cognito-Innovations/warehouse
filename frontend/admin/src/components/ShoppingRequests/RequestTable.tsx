import React, { useState } from 'react';
import {
  Card,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  Box,
  TextField,
  MenuItem,
  IconButton
} from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { shoppingRequests } from '../../data/shoppingRequests';
import RequestTableBody from './RequestTableBody';

const RequestTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [statusFilter, setStatusFilter] = useState('All');

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const filteredRows = statusFilter === 'All'
    ? shoppingRequests
    : shoppingRequests.filter((row) => row.status === statusFilter);

  const visibleRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton>
              <FilterAltOutlinedIcon color="action" />
            </IconButton>

            <TextField
                select
                value={statusFilter}
                onChange={handleStatusChange}
                size="small"
                sx={{minWidth: 150}}
                >
                <MenuItem value="All">Status: All</MenuItem>
                <MenuItem value="REQUESTED">Requested</MenuItem>
                <MenuItem value="PAID">Paid</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
                <MenuItem value="ORDER PLACED">Order Placed</MenuItem>
            </TextField>
        </Box>
      <Card>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell>Order No.</TableCell>
                <TableCell>Requested At</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>No. of Items</TableCell>
              </TableRow>
            </TableHead>
            <RequestTableBody rows={visibleRows} />
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

export default RequestTable;