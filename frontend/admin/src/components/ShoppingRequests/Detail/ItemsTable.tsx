import {
  Box, Card, Typography, Table, TableBody,
  TableContainer, TableHead, TableRow, TableCell, Button,
} from '@mui/material';
import ItemsTableRow from './ItemsTableRow';
import ItemsTableSummary from './ItemsTableSummary';

const headers = ["Item Name", "Color/Size", "Available", "Status", "Quantity", "Unit Price", "Total"];

const ItemsTable = ({ details }) => (
  <Card sx={{ mt: 3 }}>
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6" fontWeight={600}>Links / Items</Typography>
      <Button variant="contained" size="small" sx={{textTransform: 'none'}}>Map Items</Button>
    </Box>
    <TableContainer>
      <Table>
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            {headers.map(h => <TableCell key={h} sx={{fontWeight: 600}}>{h}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {details.items_data.map((item, i) => <ItemsTableRow key={i} item={item} />)}
        </TableBody>
      </Table>
    </TableContainer>
    <ItemsTableSummary summary={details.summary} />
  </Card>
);

export default ItemsTable;