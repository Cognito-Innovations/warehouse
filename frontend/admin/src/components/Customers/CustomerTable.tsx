import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Box } from '@mui/material';
import { EditOutlined as EditIcon, VisibilityOutlined as ViewIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getStatusColor } from '../../utils/statusUtils';
import type { Customer } from '../../types';
import AssignRolePopup from './AssignRolePopup';
import { useState } from 'react';

const StatusBadge = ({ status }: { status: boolean }) => {
  const { color, bgColor } = getStatusColor(status ? "YES" : "NO");
  return (
    <Box component="span" sx={{ display: 'inline-block', bgcolor: bgColor, color, fontWeight: 'bold', fontSize: '0.75rem', borderRadius: '6px', px: 1.25, py: 0.5 }}>
      {status ? 'YES' : 'NO'}
    </Box>
  );
};

const CustomerTable = ({ rows }: { rows: Customer[] }) => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const handleEditClick = (user: any) => {
    setSelectedUser(user);
    setOpen(true);
  };

  return (
    <>
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
              {rows.map((user, index) => (
                <TableRow key={user.suite_no} sx={{ '&:last-child td': { border: 0 }, bgcolor: index === 10 ? '#eef2ff' : 'inherit', '&:hover': { bgcolor: '#f8fafc' } }}>
                  <TableCell>
                    <Typography fontWeight={500} color="#1e293b">{user.suite_no}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography component="div" fontWeight={500} color="#1e293b">
                      {user.name}
                    </Typography>
                    {user.id && 
                      <Typography variant="caption" color="#64748b">
                        {user.id}
                      </Typography>
                    }
                  </TableCell>

                  <TableCell>
                    <Typography component="div" fontWeight={500} color="#1e293b">
                      {user.email}
                    </Typography>
                    {user.email_verified && 
                      <Typography variant="caption" color="#64748b">
                        {user.email_verified}
                      </Typography>
                    }
                  </TableCell>

                  <TableCell>
                    <Typography color="#334155">
                      {user.phone_number || '—'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography color="#334155">
                      {user.identifier || '—'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={user.email_verified} />
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={user.is_active} />
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(user)}
                      sx={{
                        mr: 1,
                        bgcolor: '#e0e7ff',
                        color: '#3730a3',
                        '&:hover': { bgcolor: '#c7d2fe' },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>

                    <Link to={`/customers/${user.suite_no}`} style={{ textDecoration: "none" }}>
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

      <AssignRolePopup
        open={open}
        onClose={() => setOpen(false)}
        userId={selectedUser?.id}
        currentRole={selectedUser?.role}
        onSuccess={() => window.location.reload()}
      />
    </>
  )
};

export default CustomerTable;