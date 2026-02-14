import { TableHead, TableRow, TableCell } from '@mui/material';

const ShipmentsTableHeader = () => {
  return (
    <TableHead sx={{ bgcolor: '#f8fafc' }}>
      <TableRow
        sx={{
          '& > *': {
            whiteSpace: { xs: 'nowrap', sm: 'nowrap' },
            fontWeight: 600,
            color: '#374151',
            py: 2,
          },
        }}
      >
        <TableCell />
        <TableCell>Shipment No.</TableCell>
        <TableCell>Tracking No.</TableCell>
        <TableCell sx={{ width: 140 }}>Customer</TableCell>
        <TableCell>Request At</TableCell>
        <TableCell>Status</TableCell>
        <TableCell align="center">Pkgs Count</TableCell>
        <TableCell>Invoice</TableCell>
        <TableCell />
      </TableRow>
    </TableHead>
  );
};

export default ShipmentsTableHeader;