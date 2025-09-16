import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Avatar, Stack } from '@mui/material';

interface CountriesListProps {
  countries: any[];
}

const CountriesList: React.FC<CountriesListProps> = ({ countries }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
      <Table sx={{ minWidth: 650 }} aria-label="countries table">
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Country</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>ISO Code</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Phone Code</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {countries.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <Stack direction="row" alignItems="center" spacing={1}>
                  {row.image && <Avatar src={row.image} alt={row.name} sx={{ width: 24, height: 24 }} />}
                  <Typography variant="body2">{row.name}</Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">{row.code}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">{row.phone_code}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CountriesList;
