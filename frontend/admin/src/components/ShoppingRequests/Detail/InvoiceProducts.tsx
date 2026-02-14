import { 
  Table,
  TableCell, 
  TableHead, 
  TableRow, 
  Typography,
  Box,
} from "@mui/material";

import type { Invoice } from "./RequestDetailContent";
import InvoiceProductsTableBody from "./InvoiceProductsTableBody";

export default function InvoiceProducts({ products }: { products?: Invoice["products"] }) {
  if (!products?.length) {
    return (
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
          Products
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No products found for this invoice.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="subtitle1" fontWeight="bold" color="primary">
          Products ({products.length})
        </Typography>
      </Box>
      
      <Table size="small" sx={{ 
        border: "1px solid",
        borderColor: "grey.300",
        borderRadius: 1,
        overflow: "hidden",
      }}>
        <TableHead>
          <TableRow sx={{ bgcolor: "grey.100" }}>
            <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">Quantity</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">Unit Price</TableCell>
          </TableRow>
        </TableHead>

        <InvoiceProductsTableBody products={products} />
      </Table>
    </Box>
  );
}
