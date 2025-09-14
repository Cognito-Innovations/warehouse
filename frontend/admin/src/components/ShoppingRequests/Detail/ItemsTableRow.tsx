import { Box, TableCell, TableRow, Checkbox, Link, Typography, TextField, Button, Chip, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { useEffect, useState } from 'react';
import DropdownMenu from '../../common/DropdownMenu';
import Modal from '../../common/Modal';
import { getCountries } from '../../../services/api.services'

const ItemsTableRow = ({ item, index, onUpdate }: { item: any, index: number, onUpdate: (updates: any) => void }) => {
  const [open, setOpen] = useState(false);
  const [unitPrice, setUnitPrice] = useState(item.unit_price || 0);
  const [available, setAvailable] = useState(item.available || false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const [remarkOpen, setRemarkOpen] = useState(false);
  const [currency, setCurrency] = useState(item.currency || "");
  const [countries, setCountries] = useState<{ id: string; code: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item.unit_price) {
      setUnitPrice(item.unit_price);
    }
  }, [item.unit_price]);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const data = await getCountries();
      setCountries(data);
    } catch (err) {
      console.error("Failed to load countries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleEditClick = () => setOpen(true);

  const handleSave = async () => {
    try {
      setLoading(true);
      await onUpdate({ unit_price: unitPrice, currency, available });
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

  return (
    <>
    <TableRow sx={{ '& td': { whiteSpace: 'pre-line', verticalAlign: 'top' } }}>
      <TableCell sx={{width: '30%'}}>
        <Box sx={{ display: 'flex' }}>
          <Checkbox 
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            sx={{p:0, pt: '2px', pr: 1, alignSelf: 'flex-start'}}
          />
          <Typography variant="body2" sx={{ pr: 1 }}>{index + 1}.</Typography>
          <Box>
            <Typography variant="body2" fontWeight={500}>{item.name}</Typography>
            <Link href={item.url} target="_blank" rel="noopener noreferrer" variant="caption" underline="hover">View link</Link>
            <br/>
            <Typography variant="body2" fontWeight={500} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 14, color: "text.secondary" }}/>
              {item.if_not_available_color || item.if_not_available_quantity}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell sx={{width: '25%'}}>
        <Typography variant="body2">{item.color || item.size}</Typography>
        <Typography variant="caption" color="text.secondary">{item.details}</Typography>
      </TableCell>
      <TableCell>
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
      <TableCell>{item?.status || "-"}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>${unitPrice}</TableCell>
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
        />
        <FormControl fullWidth size="small">
          <InputLabel id="currency-label">Select Currency</InputLabel>
          <Select
            labelId="currency-label"
            value={currency || ""}
            onChange={(e) => setCurrency(e.target.value)}
            label="Select Currency"
            MenuProps={{
              disablePortal: true,
              PaperProps: {
                sx: {
                  maxHeight: 100,
                  '&::-webkit-scrollbar': {
                    width: 6,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: 8,
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#555',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f1f1f1',
                    borderRadius: 8,
                  },
                },
              },
            }}
          >
            <MenuItem value="">
              <em>Select Currency</em>
            </MenuItem>
            {countries.map((c) => (
              <MenuItem key={c.id} value={c.code}>
                {c.code} - {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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