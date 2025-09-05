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
import { getAllShoppingRequests } from '../../services/api.services';

const RequestTable: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchRequests = async () => {
    try {
      const data = await getAllShoppingRequests();

      const mapped = data.map((req: any) => {
        const createdAt = new Date(req.created_at);
        return {
          orderNo: req.request_code,
          requestedAt: {
            date: createdAt.toLocaleDateString('en-GB'),
            time: createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          customer: {
            name: req.user?.name || 'Unknown',
            id: req.user_id,
          },
          status: req.status,
          noOfItems: req.items,
        };
      });

      setRows(mapped);
    } catch (err) {
      console.error("Error fetching shopping requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRows = statusFilter === 'All'
    ? rows
    : rows.filter((row) => row.status === statusFilter);

  const visibleRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

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