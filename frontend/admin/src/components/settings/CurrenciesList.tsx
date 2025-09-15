import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const mockCurrencies = [
  { id: 1, name: 'United States Dollar', code: 'USD', symbol: '$' },
  { id: 2, name: 'Euro', code: 'EUR', symbol: '€' },
  { id: 3, name: 'British Pound', code: 'GBP', symbol: '£' },
  { id: 4, name: 'Indian Rupee', code: 'INR', symbol: '₹' },
];

const CurrenciesList: React.FC = () => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
      <Table sx={{ minWidth: 650 }} aria-label="currencies table">
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Currency Name</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Code</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Symbol</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockCurrencies.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <Typography variant="body2">{row.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">{row.code}</Typography>
              </TableCell>
               <TableCell>
                <Typography variant="body2" color="text.secondary">{row.symbol}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CurrenciesList;