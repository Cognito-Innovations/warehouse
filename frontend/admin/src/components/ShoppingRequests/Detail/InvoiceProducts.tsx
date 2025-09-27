import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { type InvoiceDetails } from "./InvoiceRow";

export default function InvoiceProducts({ products }: { products?: InvoiceDetails["products"] }) {
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
        <TableBody>
          {products.map((product, idx) => (
            <TableRow 
              key={product.id || idx}
              sx={{ 
                "&:hover": { bgcolor: "action.hover" },
                "&:last-child": { borderBottom: 0 }
              }}
            >
              <TableCell>
                <Box>
                  <Typography variant="body2" fontWeight="500">
                    {product.name}
                  </Typography>
                  {product.description && (
                    <Typography variant="caption" color="text.secondary">
                      {product.description}
                    </Typography>
                  )}
                </Box>
              </TableCell>
              <TableCell align="center">
                <Chip 
                  label={product.quantity} 
                  size="small" 
                  variant="outlined"
                  color="primary"
                />
              </TableCell>
              <TableCell align="right">
                {product.unit_price && product.currency && <p>{product.unit_price}</p>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
