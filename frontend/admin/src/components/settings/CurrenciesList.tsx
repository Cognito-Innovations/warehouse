import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

interface CurrenciesListProps {
  currencies: any[];
}

const CurrenciesList: React.FC<CurrenciesListProps> = ({ currencies }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
      <Table sx={{ minWidth: 650 }} aria-label="currencies table">
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Currency Symbol</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Rate</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Country</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currencies.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <Typography variant="body2">{row.currency_symbol}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">{row.rate}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">{row.country?.name}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CurrenciesList;
