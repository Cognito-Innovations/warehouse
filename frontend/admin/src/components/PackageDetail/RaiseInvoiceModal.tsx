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
  TextField,
  IconButton,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from 'sonner';
import { createShipmentInvoice } from '../../services/api.services';

interface Charge {
  category: string;
  description: string;
  amount: number;
  total: number;
}

interface Shipment {
  id: string;
  total_weight?: string | number;
}

const availableCharges = [
  { name: 'Dangerous Goods', amount: 5.00 },
  { name: 'Pickup Charge', amount: 0.00 },
  { name: 'DG Handling', amount: 0.00 },
  { name: 'Special Brand Handling', amount: 0.00 },
  { name: 'Repacking', amount: 0.00 },
  { name: 'Cargo Handling', amount: 0.00 },
];

const RaiseInvoiceModal: React.FC<{ 
  shipment: Shipment; 
  onClose: () => void;
  onUpdated?: () => void;
}> = ({ shipment, onClose, onUpdated }) => {
  const FREIGHT_RATE_PER_KG = 8.50;
  const weight = Number(shipment.total_weight) || 0;
  const freightAmount = weight * FREIGHT_RATE_PER_KG;

  const initialCharges: Charge[] = [
    {
      category: 'Freight Charge',
      description: `UGFLASH Chargeable Weight ${weight} kg`,
      amount: FREIGHT_RATE_PER_KG,
      total: freightAmount,
    },
  ];

  const [charges, setCharges] = useState<Charge[]>(initialCharges);
  const [showAddCharges, setShowAddCharges] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState('');
  const [extraChargeAmount, setExtraChargeAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const hasAdditionalCharges = charges.some(charge => charge.category === 'Additional Services');

  const isUpdating = !!selectedCharge && charges.some(charge => charge.description === selectedCharge);

  const handleSelectChange = (e: any) => {
    const value = e.target.value as string;
    setSelectedCharge(value);
    if (!value) {
      setExtraChargeAmount('');
      return;
    }
    const selected = availableCharges.find(c => c.name === value);
    const existing = charges.find(
      charge => charge.description === value && charge.category === 'Additional Services'
    );
    if (existing) {
      setExtraChargeAmount(existing.amount.toFixed(2));
    } else if (selected && selected.amount > 0) {
      setExtraChargeAmount(selected.amount.toFixed(2));
    } else {
      setExtraChargeAmount('');
    }
  };

  const handleToggleCharge = () => {
    const amountValue = parseFloat(extraChargeAmount);
    if (!selectedCharge || isNaN(amountValue) || amountValue <= 0) return;

    if (isUpdating) {
      setCharges(prev => prev.map(charge => 
        charge.description === selectedCharge ? {...charge, amount: amountValue, total: amountValue} : charge
      ));
    } else {
      setCharges(prev => [...prev, {
        category: 'Additional Services',
        description: selectedCharge,
        amount: amountValue,
        total: amountValue,
      }]);
    }
    setSelectedCharge('');
    setExtraChargeAmount('');
  };

  const handleRemoveCharge = (description: string) => {
    setCharges(prev => prev.filter(charge => charge.description !== description));
  };

  const calculateTotal = () => {
    return charges.reduce((acc, charge) => acc + charge.total, 0).toFixed(2);
  };

  const handleRaiseInvoice = async () => {
    try {
      setLoading(true);  
      await createShipmentInvoice(shipment.id, {
        charges,
        total: Number(calculateTotal())
      })
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
        <Table sx={{ minWidth: hasAdditionalCharges ? 650 : 550 }} aria-label="charges table">
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-root': { fontWeight: 600, bgcolor: '#f8fafc', color: '#475569' } }}>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              {hasAdditionalCharges && <TableCell>Action</TableCell>}
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {charges.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">{row.category}</TableCell>
                <TableCell>{row.description}</TableCell>
                {hasAdditionalCharges && (
                  <TableCell>
                    {row.category !== 'Freight Charge' && (
                      <IconButton size="small" onClick={() => handleRemoveCharge(row.description)} sx={{ color: 'error.main' }}>
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                )}
                <TableCell align="right">${row.amount.toFixed(2)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>${row.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell colSpan={hasAdditionalCharges ? 4 : 3}sx={{ fontWeight: 600, fontSize: '1rem', border: 0 }}>TOTAL</TableCell>
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
              onChange={handleSelectChange}
            >
              {availableCharges.map((charge) => (
                <MenuItem key={charge.name} value={charge.name}>
                  <Typography sx={{ fontWeight: 500 }}>
                    {charge.name}
                    <Typography
                      component="span"
                      sx={{
                        ml: 1,
                        color: 'text.secondary',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      ${charge.amount.toFixed(2)}
                    </Typography>
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedCharge && (
            <>
              <TextField
                size="small"
                type="number"
                label="Amount"
                value={extraChargeAmount}
                onChange={(e) => setExtraChargeAmount(e.target.value)}
                sx={{ width: 150 }}
                inputProps={{ min: 0 }}
              />

              <Button
                variant="contained"
                onClick={handleToggleCharge}
                disabled={!selectedCharge || !extraChargeAmount || parseFloat(extraChargeAmount) <= 0}
                sx={{ textTransform: 'none' }}
              >
                {isUpdating ? 'Update' : 'Add'}
              </Button>
            </>
          )}
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