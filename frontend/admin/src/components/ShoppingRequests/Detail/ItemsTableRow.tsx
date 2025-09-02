import { Box, TableCell, TableRow, Checkbox, Link, Typography, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ItemsTableRow = ({ item }: { item: any }) => (
  <TableRow sx={{ '& td': { whiteSpace: 'pre-line', verticalAlign: 'top' } }}>
    <TableCell sx={{width: '30%'}}>
      <Box sx={{ display: 'flex' }}>
        <Checkbox defaultChecked sx={{p:0, pt: '2px', pr: 1, alignSelf: 'flex-start'}}/>
        <Box>
          <Typography variant="body2" fontWeight={500}>{item.name}</Typography>
          <Link href={item.link} variant="caption" underline="hover">View link</Link>
          <br/>
          <Link href="#" variant="caption" underline="hover">Cancel all items</Link>
        </Box>
      </Box>
    </TableCell>
    <TableCell sx={{width: '25%'}}>
      <Typography variant="body2">{item.colorSize}</Typography>
      <Typography variant="caption" color="text.secondary">{item.details}</Typography>
    </TableCell>
    <TableCell>{item.available}</TableCell>
    <TableCell>{item.status}</TableCell>
    <TableCell>{item.quantity}</TableCell>
    <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
    <TableCell>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        ${item.total.toFixed(2)}
        <IconButton size="small"><MoreVertIcon/></IconButton>
      </Box>
    </TableCell>
  </TableRow>
);
export default ItemsTableRow;