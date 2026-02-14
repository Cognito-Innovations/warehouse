import {
  Box,
  Collapse,
  Typography,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

import PackageRow from './PackageRow';

interface ShipmentPackageRowProps {
  open: boolean;
  packages: any[];
}

const ShipmentPackageRow = ({ open, packages }: ShipmentPackageRowProps) => {
  if (!packages || packages.length === 0) return null;

  return (
    <TableRow>
      <TableCell colSpan={10} sx={{ p: 0 }}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box
            sx={{
              m: 2,
              p: 3,
              bgcolor: '#f8fafc',
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#374151',
                  mb: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                Package Details
                <Chip
                  label={`${packages.length} packages`}
                  size="small"
                  sx={{
                    bgcolor: '#e2e8f0',
                    color: '#374151',
                    fontWeight: 500,
                  }}
                />
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Detailed information about packages in this shipment
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: '#f1f5f9',
                      '& > *': {
                        border: 'none',
                        fontWeight: 600,
                        color: '#374151',
                        py: 1.5,
                      },
                    }}
                  >
                    <TableCell sx={{ width: 220, textAlign: 'center' }}>
                      Package No.
                    </TableCell>
                    <TableCell>Rack</TableCell>
                    <TableCell>Tracking No.</TableCell>
                    <TableCell>Received At</TableCell>
                    <TableCell>Weight</TableCell>
                    <TableCell>Vol. Weight</TableCell>
                    <TableCell sx={{ width: 80 }} />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {packages.map((pkg, index) => (
                    <PackageRow
                      key={pkg.id}
                      item={pkg}
                      index={index}
                    />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

export default ShipmentPackageRow;