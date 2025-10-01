import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Box } from '@mui/material';
import { VisibilityOutlined as ViewIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getStatusColor } from '../../utils/statusUtils';
import type { Customer } from '../../types';

const StatusBadge = ({ status }: { status: boolean }) => {
  const { color, bgColor } = getStatusColor(status ? "YES" : "NO");
  return (
    <Box component="span" sx={{ display: 'inline-block', bgcolor: bgColor, color, fontWeight: 'bold', fontSize: '0.75rem', borderRadius: '6px', px: 1.25, py: 0.5 }}>
      {status ? 'YES' : 'NO'}
    </Box>
  );
};

const CustomerTable = ({ rows }: { rows: Customer[] }) => (
  <Paper sx={{ borderRadius: 3, boxShadow: 'none', overflow: 'hidden' }}>
    <TableContainer>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ '& .MuiTableCell-root': { bgcolor: '#f8fafc', color: '#64748b', fontWeight: 500, fontSize: '0.75rem', py: 1.5, border: 'none' } }}>
          <TableRow>
            {['Suite No.', 'Name', 'Email', 'Phone', 'Provider', 'Verified', 'Active', 'Action']
              .map((head, i) => <TableCell key={head} align={i === 7 ? 'center' : 'left'}>{head}</TableCell>)}
          </TableRow>
        </TableHead>

        <TableBody sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #f1f5f9', py: 1.5 }, '& .MuiTypography-root': { fontSize: '0.875rem' } }}>
          {rows.map((customer, index) => (
            <TableRow key={customer.suite_no} sx={{ '&:last-child td': { border: 0 }, bgcolor: index === 10 ? '#eef2ff' : 'inherit', '&:hover': { bgcolor: '#f8fafc' } }}>
              <TableCell>
                <Typography fontWeight={500} color="#1e293b">{customer.suite_no}</Typography>
              </TableCell>

              <TableCell>
                <Typography component="div" fontWeight={500} color="#1e293b">
                  {customer.name}
                </Typography>
                {customer.id && 
                  <Typography variant="caption" color="#64748b">
                    {customer.id}
                  </Typography>
                }
              </TableCell>

              <TableCell>
                <Typography component="div" fontWeight={500} color="#1e293b">
                  {customer.email}
                </Typography>
                {customer.email_verified && 
                  <Typography variant="caption" color="#64748b">
                    {customer.email_verified}
                  </Typography>
                }
              </TableCell>

              <TableCell>
                <Typography color="#334155">
                  {customer.phone_number || '—'}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography color="#334155">
                  {customer.identifier || '—'}
                </Typography>
              </TableCell>

              <TableCell>
                <StatusBadge status={customer.email_verified} />
              </TableCell>

              <TableCell>
                <StatusBadge status={customer.is_active} />
              </TableCell>

              <TableCell align="center">
                <Link to={`/customers/${customer.suite_no}`} style={{ textDecoration: "none" }}>
                  <IconButton size="small" sx={{ bgcolor: '#7360F2', color: '#f8f8f8', '&:hover': { backgroundColor: '#5b48d8' } }}>
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

export default CustomerTable;