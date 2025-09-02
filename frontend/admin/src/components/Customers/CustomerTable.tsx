import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Typography, IconButton, Box
} from '@mui/material';
import { VisibilityOutlined as ViewIcon, MoreVertOutlined as MoreIcon } from '@mui/icons-material';
import { getStatusChipColor, type Customer } from '../../data/customers';

const StatusBadge = ({ status }: { status: boolean }) => {
  const { color, bgColor } = getStatusChipColor(status);
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
          {rows.map((c, i) => (
            <TableRow key={c.suiteNo} sx={{ '&:last-child td': { border: 0 }, bgcolor: i === 10 ? '#eef2ff' : 'inherit', '&:hover': { bgcolor: '#f8fafc' } }}>
              <TableCell><Typography fontWeight={500} color="#1e293b">{c.suiteNo}</Typography></TableCell>
              <TableCell>
                <Typography component="div" fontWeight={500} color="#1e293b">{c.name}</Typography>
                {c.id && <Typography variant="caption" color="#64748b">{c.id}</Typography>}
              </TableCell>
              <TableCell>
                <Typography component="div" fontWeight={500} color="#1e293b">{c.email}</Typography>
                {c.emailVerifiedOn && <Typography variant="caption" color="#64748b">{c.emailVerifiedOn}</Typography>}
              </TableCell>
              <TableCell><Typography color="#334155">{c.phone || '—'}</Typography></TableCell>
              <TableCell><Typography color="#334155">{c.provider || '—'}</Typography></TableCell>
              <TableCell><StatusBadge status={c.isVerified} /></TableCell>
              <TableCell><StatusBadge status={c.isActive} /></TableCell>
              <TableCell align="center">
                <IconButton size="small" sx={{ bgcolor: '#7360F2', color: '#f8f8f8', '&:hover': { backgroundColor: '#5b48d8' } }}>
                  <ViewIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: '#000' }}>
                  <MoreIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

export default CustomerTable;