import React, { useEffect, useState } from 'react';
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
import RequestTableBody from './RequestTableBody';
import type { PickupRequest } from '../../types';
import { getPickupRequests } from '../../services/api.services';

const RequestTable: React.FC = () => {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getPickupRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch pickup requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

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
    ? requests
    : requests.filter((row) => row.status === statusFilter);

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
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
                <MenuItem value="REQUESTED">Requested</MenuItem>
                <MenuItem value="QUOTATION CONFIRMED">Quotation Confirmed</MenuItem>
                <MenuItem value="ACCEPTED">Accepted</MenuItem>
                <MenuItem value="PICKED">Picked</MenuItem>
            </TextField>
        </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell>Request No.</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Pickup Location</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Status</TableCell>
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