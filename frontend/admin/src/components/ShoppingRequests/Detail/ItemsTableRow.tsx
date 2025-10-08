import { Box, TableCell, TableRow, Checkbox, Link, Typography, Chip } from '@mui/material';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { useEffect, useState } from 'react';
import DropdownMenu from '../../common/DropdownMenu';
import EditItemModal from './EditItemModal';
import RemarkModal from './RemarkModal';

interface ItemsTableRowItem {
  id: string;
  name: string;
  quantity: number;
  unit_price?: number;
  currency?: string;
  available?: boolean;
  color?: string;
  size?: string;
  details?: string;
  url?: string;
  remarks?: string;
  if_not_available_color?: string;
  if_not_available_quantity?: string | number;
  [key: string]: unknown;
}

interface ItemsTableRowProps {
  item: ItemsTableRowItem;
  index: number;
  requestStatus?: string;
  disabled: boolean;
  onUpdate: (updates: Partial<ItemsTableRowItem>) => void;
  onSelectionChange: (itemId: string, isSelected: boolean) => void;
}

const ItemsTableRow = ({ item, index, onUpdate, onSelectionChange, disabled, }: ItemsTableRowProps) => {

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
  return (
    <>
    <TableRow sx={{ '& > *': { border: 'none' } }}>
      <TableCell sx={{  verticalAlign: 'middle' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Checkbox 
            checked={checked}
            onChange={handleSelection}
            sx={{ p: 0 }}
            disabled={disabled}
          />
          <Typography variant="body2">{index + 1}.</Typography>
        </Box>
      </TableCell>

      <TableCell sx={{width: '60%', verticalAlign: 'top'}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="body1" fontWeight={500} textTransform="capitalize">
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
                mt: 0.5
              }}
            >
              <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              {remarkText}
            </Typography>
          )}
        </Box>
      </TableCell>

      <TableCell sx={{width: '30%', verticalAlign: 'top'}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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

      <TableCell sx={{verticalAlign: 'middle', textAlign: 'center'}}>
        {item.available && (
          <Chip
            label="YES"
            size="small"
            sx={{ backgroundColor: "#d4edda", color: "#155724", fontWeight: 500 }}
          />
        )}
      </TableCell>

      <TableCell sx={{ verticalAlign: 'middle', textAlign: 'center' }}>
        {item.quantity ? item.quantity : null}
      </TableCell>

      <TableCell sx={{ verticalAlign: 'middle', textAlign: 'center' }}>
        {item.unit_price ? `${item.unit_price && item.unit_price.toFixed(2)}` : null}
      </TableCell>

      <TableCell sx={{ verticalAlign: 'middle', textAlign: 'center' }}>
        {total ? `${item.currency}${total.toFixed(2)}` : null}
      </TableCell>
      
      <TableCell sx={{ verticalAlign: 'middle', textAlign: 'center' }}>
        <Box 
          onClick={disabled ? undefined : handleMenuTrigger}
          sx={{
            cursor: disabled ? 'default' : 'pointer', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <DropdownMenu
            disabled={disabled}
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