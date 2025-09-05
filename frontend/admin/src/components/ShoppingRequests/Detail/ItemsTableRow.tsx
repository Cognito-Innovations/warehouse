import { Box, TableCell, TableRow, Checkbox, Link, Typography, TextField, Button, Chip } from '@mui/material';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { useEffect, useState } from 'react';
import DropdownMenu from '../../common/DropdownMenu';
import Modal from '../../common/Modal';
import { updateProduct } from '../../../services/api.services'

const ItemsTableRow = ({ item, index }: { item: any, index: number }) => {
  const [open, setOpen] = useState(false);
  const [unitPrice, setUnitPrice] = useState(item.unit_price || 0);
  const [available, setAvailable] = useState(item.available || false);

  useEffect(() => {
    if (item.unit_price) {
      setUnitPrice(item.unit_price);
    }
  }, [item.unit_price]);

  const handleEditClick = () => setOpen(true);

  const handleSave = async () => {
    try {
      await updateProduct(item.id, unitPrice, available);
      setOpen(false);
    } catch (err) {
      console.error("Failed to update unit price:", err);
    }
  };

  const total = item.quantity * unitPrice;

  return (
    <>
    <TableRow sx={{ '& td': { whiteSpace: 'pre-line', verticalAlign: 'top' } }}>
      <TableCell sx={{width: '30%'}}>
        <Box sx={{ display: 'flex' }}>
          <Checkbox defaultChecked sx={{p:0, pt: '2px', pr: 1, alignSelf: 'flex-start'}}/>
          <Typography variant="body2" sx={{ pr: 1 }}>{index + 1}.</Typography>
          <Box>
            <Typography variant="body2" fontWeight={500}>{item.name}</Typography>
            <Link href={item.url} target="_blank" rel="noopener noreferrer" variant="caption" underline="hover">View link</Link>
            <br/>
            <Typography variant="body2" fontWeight={500} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 14, color: "text.secondary" }}/>
              {item.ifNotAvailableColor || item.ifNotAvailableQuantity}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell sx={{width: '25%'}}>
        <Typography variant="body2">{item.color || item.size}</Typography>
        <Typography variant="caption" color="text.secondary">{item.details}</Typography>
      </TableCell>
      <TableCell>
        {item.available ? (
          <Chip
            label="YES"
            size="small"
            sx={{ backgroundColor: "#d4edda", color: "#155724", fontWeight: 500 }}
          />
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell>{item.status}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>${unitPrice.toFixed(2)}</TableCell>
      <TableCell>
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          ${total.toFixed(2)}

          <DropdownMenu
            options={[
              { label: "Edit", onClick: handleEditClick },
              { label: "View Remarks", onClick: () => console.log("View Remarks clicked", item) }
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
          onChange={(e) => setUnitPrice(parseFloat(e.target.value))}
          fullWidth
          size="small"
        />
        <Typography variant="caption" color="text.secondary">
          Unit price in dollar($)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
          />
          <Typography>Available?</Typography>
        </Box>
        <Button variant="contained" size="small" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Modal>
  </>
  );
};

export default ItemsTableRow;