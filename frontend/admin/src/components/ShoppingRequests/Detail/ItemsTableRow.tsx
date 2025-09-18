import { Box, TableCell, TableRow, Checkbox, Link, Typography, TextField, Button, Chip, CircularProgress } from '@mui/material';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { useEffect, useState } from 'react';
import DropdownMenu from '../../common/DropdownMenu';
import Modal from '../../common/Modal';
import { numberInputStyle } from '../../../styles/numberInputStyle';

interface ItemsTableRowProps {
  item: any;
  index: number;
  onUpdate: (updates: any) => void;
  onSelectionChange: (itemId: string, isSelected: boolean) => void;
}

const ItemsTableRow = ({ item, index, onUpdate, onSelectionChange }: ItemsTableRowProps) => {
  const [open, setOpen] = useState(false);
  const [unitPrice, setUnitPrice] = useState(item.unit_price || 0);
  const [available, setAvailable] = useState(item.available || false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const [remarkOpen, setRemarkOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUnitPrice(item.unit_price || 0);
    setAvailable(item.available || false);
  }, [item.unit_price, item.available]);

  const handleSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSelected = e.target.checked;
    setChecked(isSelected);
    onSelectionChange(item.id, isSelected); 
  }

  const handleEditClick = () => setOpen(true);

  const handleSave = async () => {
    try {
      setLoading(true);
      await onUpdate({ unit_price: unitPrice, available });
    } catch (err) {
      console.error("Failed to save item", err);
      setLoading(false);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const total = item.quantity * unitPrice;

  const handleUnitPriceChange = (value: string) => {
    if (value === "") {
      setUnitPrice(0);
      setError("Unit Price is mandatory");
      return;
    }

    const num = parseFloat(value);
  
    if (!isNaN(num) && num >= 0 && num <= 999999.99) {
      setUnitPrice(num);
      if (num > 0) setError("");
    }
  };

  const remarkText = item.if_not_available_color || item.if_not_available_quantity;

  return (
    <>
    <TableRow sx={{ '& > *': { border: 'none' } }}>
      <TableCell sx={{width: '30%', verticalAlign: 'top'}}>
        <Box sx={{ display: 'flex' }}>
          <Checkbox 
            checked={checked}
            onChange={handleSelection}
            sx={{p:0, pt: '2px', pr: 1, alignSelf: 'flex-start'}}
          />
          <Typography variant="body2" sx={{ pr: 1 }}>{index + 1}.</Typography>
          <Box>
            <Typography variant="body2" fontWeight={500}>{item.name}</Typography>
            <Link href={item.url} target="_blank" rel="noopener noreferrer" variant="caption" underline="hover">View link</Link>
          </Box>
        </Box>
      </TableCell>
      <TableCell sx={{width: '25%', verticalAlign: 'top'}}>
        <Typography variant="body2">
          {item.color && item.size
            ? `${item.color}/${item.size}`
            : item.color || item.size || ''}
        </Typography>

        <Typography variant="caption" color="text.secondary">{item.details}</Typography>
      </TableCell>
      <TableCell sx={{verticalAlign: 'top'}}>
        {available ? (
          <Chip
            label="YES"
            size="small"
            sx={{ backgroundColor: "#d4edda", color: "#155724", fontWeight: 500 }}
          />
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell sx={{ verticalAlign: 'top' }}>{item?.status || "-"}</TableCell>
      <TableCell sx={{ verticalAlign: 'top' }}>{item.quantity}</TableCell>
      <TableCell sx={{ verticalAlign: 'top' }}>${unitPrice}</TableCell>
      <TableCell sx={{ verticalAlign: 'top' }}>
        <Box sx={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
          <Typography variant="body2">${total.toFixed(2)}</Typography>
          <DropdownMenu
            disabled={!checked} 
            options={[
              { label: "Edit", onClick: handleEditClick },
              { label: "View Remarks", onClick: () => setRemarkOpen(true) }
            ]}
          />
        </Box>
      </TableCell>
    </TableRow>

    {remarkText && (
      <TableRow>
        <TableCell sx={{ pt: 0, pb: 2, pl: '48px' }} colSpan={7}>
          <Typography 
            variant="body2"
            fontWeight={500}
            sx={{ 
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}>
              <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 14, color: "text.secondary" }}/>
              {remarkText}
          </Typography>
        </TableCell>
      </TableRow>
    )}

     <Modal open={open} onClose={() => setOpen(false)} title="Update Item/Link">
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Unit Price"
          type="number"
          value={unitPrice}
          onChange={(e) =>  handleUnitPriceChange(e.target.value)}
          fullWidth
          size="small"
          required
          error={Boolean(error)}
          helperText={error || "Unit price in dollar($)"}
          inputProps={{
            min: 0,
            max: 999999.99,
            step: "0.01",
            maxLength: 9
          }}
          sx={numberInputStyle}
        />
      
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
          />
          <Typography>Available?</Typography>
        </Box>
        <Button 
            variant="contained" 
            size="small" 
            onClick={handleSave} 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
      </Box>
    </Modal>

    <Modal open={remarkOpen} onClose={() => setRemarkOpen(false)} title="Remarks">
      <Box sx={{ p: 2 }}>
        {item.remarks ? (
          <Typography variant="body2">{item.remarks}</Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No remarks available
          </Typography>
        )}
      </Box>
    </Modal>

  </>
  );
};

export default ItemsTableRow;