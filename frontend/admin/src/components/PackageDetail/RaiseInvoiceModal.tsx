import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Paper,
  CircularProgress,
} from '@mui/material';
import { toast } from 'sonner';
import { createPackageCharge, updatePackageStatus } from '../../services/api.services';

interface Charge {
  category: string;
  description: string;
  amount: number;
  total: number;
}

const availableCharges = [
  { name: 'Dangerous Goods', amount: 5.00 },
  { name: 'Pickup Charge', amount: 10.00 },
  { name: 'DG Handling', amount: 15.00 },
  { name: 'Special Brand Handling', amount: 20.00 },
  { name: 'Repacking', amount: 8.00 },
  { name: 'Cargo Handling', amount: 12.00 },
];

const RaiseInvoiceModal: React.FC<{ 
    packageData: any; 
    onClose: () => void;
    onUpdated?: () => void;
}> = ({ packageData, onClose, onUpdated }) => {
  const initialCharges: Charge[] = [
    { category: 'Packing Options', description: 'Remove unnecessary packaging and bulky boxes & repack it as single package', amount: 1.00, total: 1.00 },
    { category: 'Other', description: 'Repacking charges from country of origin', amount: 2.00, total: 2.00 },
    { category: 'Freight Charge', description: `REDBOX Chargeable Weight ${packageData.weight || '5 KG'}`, amount: 35.00, total: 35.00 },
  ];

  const [charges, setCharges] = useState<Charge[]>(initialCharges);
  const [showAddCharges, setShowAddCharges] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddCharge = () => {
    const chargeToAdd = availableCharges.find(c => c.name === selectedCharge);
    if (chargeToAdd && !charges.some(c => c.description === chargeToAdd.name)) {
      setCharges(prev => [
        ...prev,
        {
          category: 'Additional Services',
          description: chargeToAdd.name,
          amount: chargeToAdd.amount,
          total: chargeToAdd.amount,
        },
      ]);
      setSelectedCharge('');
    }
  };

  const calculateTotal = () => {
    return charges.reduce((acc, charge) => acc + charge.total, 0).toFixed(2);
  };

  const handleRaiseInvoice = async () => {
    try {
      setLoading(true);  
      //TODO: Combine both and move to in backend side with wrapping transaction
      await updatePackageStatus(packageData.id, "Payment Pending");
      await createPackageCharge({package_id: packageData.actual_id, amount: Number(calculateTotal())});
      onUpdated?.();
      toast.success("Invoice raised successfully! Status updated to Payment Pending.");
      onClose();
    } catch (error) {
      console.error("Failed to raise invoice:", error);
      toast.error("Failed to raise invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', mb: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="charges table">
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-root': { fontWeight: 600, bgcolor: '#f8fafc', color: '#475569' } }}>
              <TableCell>#</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {charges.map((row, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">{index + 1}</TableCell>
                <TableCell component="th" scope="row">{row.category}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell align="right">${row.amount.toFixed(2)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>${row.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell colSpan={4} align="right" sx={{ fontWeight: 600, fontSize: '1rem', border: 0 }}>TOTAL</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '1.2rem', border: 0 }}>${calculateTotal()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      
      <FormControlLabel
        control={<Checkbox checked={showAddCharges} onChange={(e) => setShowAddCharges(e.target.checked)} />}
        label={<Typography sx={{ fontWeight: 500 }}>Add new charges</Typography>}
      />

      {showAddCharges && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
          <FormControl size="small" sx={{ minWidth: 240 }}>
            <InputLabel id="select-charge-label">Select Charge</InputLabel>
            <Select
              labelId="select-charge-label"
              id="select-charge"
              value={selectedCharge}
              label="Select Charge"
              onChange={(e) => setSelectedCharge(e.target.value)}
            >
              {availableCharges.map((charge) => (
                <MenuItem key={charge.name} value={charge.name}>
                  {charge.name} - ${charge.amount.toFixed(2)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleAddCharge}
            disabled={!selectedCharge}
            sx={{ textTransform: 'none' }}
          >
            Add
          </Button>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, pt: 2, borderTop: '1px solid #e2e8f0' }}>
        <Button variant="outlined" onClick={onClose} sx={{ mr: 1, textTransform: 'none' }}>
          Cancel
        </Button>
        <Button 
            variant="contained" 
            onClick={handleRaiseInvoice} 
            disabled={loading}
            sx={{ bgcolor: '#8b5cf6', '&:hover': { bgcolor: '#7c3aed' }, textTransform: 'none' }}
        >
          {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Raise Invoice'}
        </Button>
      </Box>
    </Box>
  );
};

export default RaiseInvoiceModal;