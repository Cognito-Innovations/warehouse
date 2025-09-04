import React from 'react';
import { Box, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { toast } from 'sonner';

const PackageChargesSection: React.FC = () => {
  // Mock data - replace with actual data from props or API
  const charges: any[] = [
    // { summary: 'Storage Fee', price: 25.00 },
    // { summary: 'Handling Fee', price: 15.00 },
  ];

  const total = charges.reduce((sum, charge) => sum + charge.price, 0);

  const handleAddClick = () => {
    toast.info('Feature coming soon');
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Package Charges
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{ 
              bgcolor: '#3b82f6',
              '&:hover': { bgcolor: '#2563eb' }, 
              textTransform: 'none',
              minWidth: 'auto',
              px: 2
            }}>
            
            ADD
          </Button>
        </Box>
        
        {charges.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No Charge
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Summary</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {charges.map((charge, index) => (
                  <TableRow key={index}>
                    <TableCell>{charge.summary}</TableCell>
                    <TableCell align="right">${charge.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">${total.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default PackageChargesSection;
