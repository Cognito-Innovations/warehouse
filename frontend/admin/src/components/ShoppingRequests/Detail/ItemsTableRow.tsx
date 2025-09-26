import { Box, TableCell, TableRow, Checkbox, Link, Typography, Chip } from '@mui/material';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { useEffect, useState } from 'react';
import DropdownMenu from '../../common/DropdownMenu';
import EditItemModal from './EditItemModal';
import RemarkModal from './RemarkModal';

interface ItemsTableRowProps {
  item: any;
  index: number;
  requestStatus: string;
  onUpdate: (updates: any) => void;
  onSelectionChange: (itemId: string, isSelected: boolean) => void;
}

const ItemsTableRow = ({ item, index, requestStatus, onUpdate, onSelectionChange, }: ItemsTableRowProps) => {
  const [checked, setChecked] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [remarkOpen, setRemarkOpen] = useState(false);

  useEffect(() => {
    setChecked(false);
  }, [item.id]);

  const handleSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSelected = e.target.checked;
    setChecked(isSelected);
    onSelectionChange(item.id, isSelected); 
  }

  const handleMenuTrigger = () => {
    if (!checked) {
      setChecked(true);
      onSelectionChange(item.id, true);
    }
  };

  const total = item.quantity * (item.unit_price || 0);
  const remarkText = item.if_not_available_color || item.if_not_available_quantity;
  const showApprovedChip = requestStatus === "ORDER_PLACED" && item.available;

  return (
    <>
    <TableRow sx={{ '& > *': { border: 'none' } }}>
      <TableCell sx={{  verticalAlign: 'middle' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Checkbox 
            checked={checked}
            onChange={handleSelection}
            sx={{ p: 0 }}
          />
          <Typography variant="body2">{index + 1}.</Typography>
        </Box>
      </TableCell>

      <TableCell sx={{width: '60%', verticalAlign: 'top'}}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body1" fontWeight={500}>
            {item.name}
          </Typography>
          <Link
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="caption"
            underline="always"
          >
            View link
          </Link>

          {remarkText && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 0.5,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }}
            >
              <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              {remarkText}
            </Typography>
          )}
        </Box>
      </TableCell>

      <TableCell sx={{width: '30%', verticalAlign: 'top'}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
          {item.color && (
            <Typography variant="body2">
              Color: {item.color}
            </Typography>
          )}
          {item.size && (
            <Typography variant="body2">
              Size: {item.size}
            </Typography>
          )}

          {item.details && (
            <Typography variant="caption" color="text.secondary">
              {item.details}
            </Typography>
          )}
        </Box>
      </TableCell>

      <TableCell sx={{verticalAlign: 'middle'}}>
        {item.available && (
          <Chip
            label="YES"
            size="small"
            sx={{ backgroundColor: "#d4edda", color: "#155724", fontWeight: 500 }}
          />
        )}
      </TableCell>

      <TableCell sx={{ verticalAlign: 'middle' }}>
        {showApprovedChip && (
          <Chip
            label="APPROVED"
            size="small"
            sx={{ backgroundColor: "#e6d4f0", color: "#6a0dad", fontWeight: 500 }}
          />
        )}
      </TableCell>

      <TableCell sx={{ verticalAlign: 'middle' }}>
        {item.quantity ? item.quantity : null}
      </TableCell>

      <TableCell sx={{ verticalAlign: 'middle' }}>
        {item.unit_price ? `$${item.unit_price}` : null}
      </TableCell>

      <TableCell sx={{ verticalAlign: 'middle' }}>
        {total ? `$${total.toFixed(2)}` : null}
      </TableCell>
      
      <TableCell sx={{ verticalAlign: 'middle' }}>
        <Box 
          onClick={handleMenuTrigger}
          sx={{cursor: 'pointer', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
          <DropdownMenu
            options={[
              { label: "Edit", onClick: () => setEditOpen(true) },
              { label: "View Remarks", onClick: () => setRemarkOpen(true) }
            ]}
            iconSx={{
              backgroundColor: "#0B84E3",
              color: "#fff",
              '&:hover': {
                backgroundColor: "#096bb3"
              }
            }}
          />
        </Box>
      </TableCell>
    </TableRow>

    {editOpen && (
      <EditItemModal 
        open={editOpen}
        onClose={() => setEditOpen(false)}
        unitPriceInitial={item.unit_price || 0}
        availableInitial={item.available || false}
        onSave={async (data) => {
          await onUpdate(data)
        }}
      />
    )}

    {remarkOpen && (
      <RemarkModal
        open={remarkOpen}
        onClose={() => setRemarkOpen(false)}
        remarks={item.remarks}
      />
    )}
  </>
  );
};

export default ItemsTableRow;