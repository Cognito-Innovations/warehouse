import React from 'react';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import type { Currency } from '../../types';

interface CurrenciesListProps {
  currencies: Currency[];
  onEdit: (currency: Currency) => void;
}

const CurrenciesList: React.FC<CurrenciesListProps> = ({ currencies, onEdit }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
      <Table sx={{ minWidth: 650 }} aria-label="currencies table">
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Currency Code</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Currency Symbol</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Rate</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Country</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#475569', textAlign: 'right' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currencies.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <Typography variant="body2">{row.currency_code}</Typography>
              </TableCell>
              <TableCell component="th" scope="row">
                <Typography variant="body2">{row.currency_symbol}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">{row.rate}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">{row.country?.name}</Typography>
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Edit Currency">
                  <IconButton onClick={() => onEdit(row)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CurrenciesList;
